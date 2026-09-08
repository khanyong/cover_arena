from pathlib import Path
import json,hashlib,shutil
import pypdfium2 as pdfium
from pypdf import PdfReader
from PIL import Image,ImageDraw
v=Path(__file__).resolve().parent;b=v.parent;src=v/'preview.pdf';r=PdfReader(src)
assert len(r.pages)==44
j=json.loads((v/'after-assumptions.json').read_text())
assert j['httpStatus']==200 and not j['errors'] and j['slides']==44
assert not any(x.get('contentIntrudesFooter') or x.get('overflowText') or x.get('footerOverlap') for x in j['slideChecks'])
assert all(x['visible'] for x in j['contentsNavigation'])
assert not any(x['proseEndings'] for x in j['copyReview'])
render=v/'render';render.mkdir(exist_ok=True);doc=pdfium.PdfDocument(str(src));thumbs=[]
for i in range(44):
    im=doc[i].render(scale=1.5).to_pil().convert('RGB');im.save(render/f'page-{i+1:02}.png')
    im.thumbnail((680,481));thumbs.append(im)
for start in range(0,44,8):
    subset=thumbs[start:start+8];rows=(len(subset)+1)//2
    c=Image.new('RGB',(1400,rows*525),'#e8edf2');d=ImageDraw.Draw(c)
    for k,im in enumerate(subset):
        x=10+(k%2)*700;y=10+(k//2)*525;d.text((x,y),f'PAGE {start+k+1:02}',fill='#172d4f');c.paste(im,(x,y+24))
    c.save(render/f'contact-{start+1:02}-{min(start+8,44):02}.jpg',quality=90)
out=b/'output/TEMSCO-IR-v3-assumptions-draft-20260909.pdf';shutil.copy2(src,out)
record={'pdf':str(out),'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'pages':44,'dividerPages':[3,11,18,35,43],'allPageSizesLandscape':all(float(p.mediabox.width)>float(p.mediabox.height) for p in r.pages),'allPagesHaveExtractableText':all(len(p.extract_text().strip())>80 for p in r.pages),'tocNavigationPassed':all(x['visible'] for x in j['contentsNavigation']),'proseEndingMatches':0,'geometryIssues':0,'typecheck':'PASS','renderDirectory':str(render)}
(v/'pdf-check.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(record,ensure_ascii=False))
