"""Build compact presentation inputs from the independently audited V4 Excel readback."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
src=json.loads((root/'projects/temsco/v4/analysis/valuation-source.json').read_text())
market=json.loads((root/'projects/temsco/v4/analysis/valuation-market-inputs.json').read_text())
fields=['revenue','cogs','grossProfit','sga','sgaSalary','ebit','nonOperatingNet','ebt','tax','netIncome']
def value(metric):
    assert metric['eok'] is not None, metric
    return metric['eok']
out={'sourceFiles':{k:{'name':v['nameNFC'],'sha256':v['sha256']} for k,v in src['sources'].items()},'entities':{},'assetPools':{},'depreciationProxy':[]}
for entity in ['parent','subsidiary','consolidated']:
    inp=src['entities'][entity]
    bs=next(x for x in inp['balanceSheets'] if x['year']==2025)
    out['entities'][entity]={'income':[{'year':x['year'],'status':x['status'],**{k:x[k]['eok'] for k in fields},'source':'; '.join(f"{r['fileId']} {r['sheet']}!{r['cell']}" for r in x['ebit']['sources'])} for x in inp['incomeStatement']], 'balance2025':{k:value(bs[k]) for k in ['assets','liabilities','equity','cash','interestBearingDebt','netDebt']},'capex':[{'year':x['year'],'amount':value(x['companyScheduleTotal'])} for x in inp['capex']]}
for entity in ['parent','subsidiary']:
    pools=src['assetPools2025'][entity]
    assert pools['ppeUnallocatedResidual']['eok']==0
    # Only disclosed classes enter the cohort: no invented land/buildings for WeFOMS.
    out['assetPools'][entity]={k:pools[k]['eok'] for k in ['land','building','equipment','finiteIntangible','cip'] if pools[k]['eok'] is not None}
for x in src['forecastDaKnownAndProxy']:
    out['depreciationProxy'].append({'year':x['year'],'parent':value(x['parentTotalDepreciationProxy']),'subsidiary':value(x['subsidiaryDepreciationKnown'])})
out['growthAssetPlan']=[]
for entity in ['parent','subsidiary']:
    mappings={'equipment':'equipment','land':'land','buildings':'building'} if entity=='parent' else {'growthEquipment':'equipment'}
    for row in src['entities'][entity]['capex']:
        actual=0
        for field,asset in mappings.items():
            amount=row[field]['eok']
            if amount is not None and amount>0:
                out['growthAssetPlan'].append({'company':entity,'year':row['year'],'assetClass':asset,'cost':amount})
                actual+=amount
        assert abs(actual-row['companyScheduleTotal']['eok'])<1e-9
out['ownership']={'parent':.75,'nci':.25,'source':'사용자 제공 / 2026-09-13 / 템스코의 위폼스 지분율'}
out['market']={'wacc':market['wacc'],'industry':market['industryOperatingAssumptions'],'tax':market['taxReference'],'dnp':market['peers'][0],'nano':market['peers'][1],'sources':[{'id':x['id'],'title':x.get('title',x['id']),'url':x.get('sourceUrl') or x.get('url')} for x in market['sources']]}
(root/'components/TemscoV4/valuationData.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('V4 compact input generated; no V3 company data used')

display={'sources':{k:{'nameNFC':v['nameNFC']} for k,v in src['sources'].items()},'entities':{},'consolidationAdjustments':[]}
def display_metric(m):
    return {'eok':m['eok'],'sources':[{k:c[k] for k in ['fileId','sheet','cell']} for c in m['sources']]}
for e in ['parent','subsidiary','consolidated']:
    display['entities'][e]={'incomeStatement':[{'year':r['year'],'status':r['status'],**{k:display_metric(r[k]) for k in fields+['badDebtOperating']}} for r in src['entities'][e]['incomeStatement']]}
for r in src['consolidationAdjustments']:
    display['consolidationAdjustments'].append({'year':r['year'],'rawAdjustmentLines':{'revenue':display_metric(r['rawAdjustmentLines']['revenue'])}})
(root/'components/TemscoV4/financialDisplayData.json').write_text(json.dumps(display,ensure_ascii=False,indent=2)+'\n')
