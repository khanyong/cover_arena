import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function canonicalJson(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(item => canonicalJson(item)).join(',') + ']';
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map(key => `${JSON.stringify(key)}:${canonicalJson(obj[key])}`);
  return '{' + pairs.join(',') + '}';
}

async function main() {
  console.log('===========================================================');
  console.log('     PASS 2B EDITORIAL REVISION PACKET GENERATOR           ');
  console.log('===========================================================\n');

  const SCENE_UUID = '55b46292-0335-5fbc-ab9e-baa44d3bea70';
  const AUDIT_CODE = 'B1_PASS2B_PROLOGUE_001';
  const PACKET_CODE = 'B1_PASS2B_PRO_SC1_PACKET_001';

  // 1. Maintain Audit Run in PROPOSED state
  console.log('1. Setting Audit Run status to PROPOSED...');
  await supabase
    .from('audit_runs')
    .update({
      status: 'PROPOSED',
      amendment_reason: 'PASS 2B EDITORIAL CONTROL: PROPOSED state maintained. All automated compression disabled. Awaiting human editorial revision packet review.'
    })
    .eq('code', AUDIT_CODE);

  // 2. Mark existing block map as NEEDS_SOURCE_REMAP / SUPERSEDED_DRAFT
  console.log('2. Marking preliminary 15-block map as NEEDS_SOURCE_REMAP / SUPERSEDED_DRAFT...');
  if (fs.existsSync('reports/pass-2b-prologue-block-map.json')) {
    const rawMap = JSON.parse(fs.readFileSync('reports/pass-2b-prologue-block-map.json', 'utf-8'));
    rawMap.status = 'NEEDS_SOURCE_REMAP';
    rawMap.execution_permission = 'NOT_APPROVED_FOR_EXECUTION';
    rawMap.editorial_note = 'Superceded draft; automated execution prohibited by Pass 2B Editorial Control Policy.';
    fs.writeFileSync('reports/pass-2b-prologue-block-map.json', JSON.stringify(rawMap, null, 2), 'utf-8');
  }
  if (fs.existsSync('exports/B1_PASS2B_PROLOGUE_001.block-map.json')) {
    const rawExportMap = JSON.parse(fs.readFileSync('exports/B1_PASS2B_PROLOGUE_001.block-map.json', 'utf-8'));
    rawExportMap.status = 'NEEDS_SOURCE_REMAP';
    rawExportMap.execution_permission = 'NOT_APPROVED_FOR_EXECUTION';
    fs.writeFileSync('exports/B1_PASS2B_PROLOGUE_001.block-map.json', JSON.stringify(rawExportMap, null, 2), 'utf-8');
  }

  // 3. Fetch Snapshots and Working Manifest Hash
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('*').eq('code', 'B1_PASS2A_CANON_NORMALIZED_LOCKED').single();
  const { data: draftSnap } = await supabase.from('revision_snapshots').select('*').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: sceneUnit } = await supabase.from('content_units').select('*').eq('id', SCENE_UUID).single();

  if (!baseSnap || !draftSnap || !sceneUnit) {
    throw new Error('Required snapshot or scene unit not found.');
  }

  console.log(`   Baseline: ${baseSnap.code} (LOCKED)`);
  console.log(`   Working:  ${draftSnap.code} (DRAFT)`);
  console.log(`   Working Manifest Hash: ${draftSnap.manifest_hash}`);
  console.log(`   Scene:    ${sceneUnit.title} (${sceneUnit.id})\n`);

  // 4. Fetch Scene Matrix
  const { data: sceneMatrix } = await supabase
    .from('scene_matrices')
    .select('*')
    .eq('snapshot_id', draftSnap.id)
    .eq('scene_unit_id', SCENE_UUID)
    .maybeSingle();

  // 5. Fetch Protected Assets for Scene 1
  const protectedAssetsRaw = JSON.parse(fs.readFileSync('exports/B1_PASS1_GLOBAL_001.protected-assets.json', 'utf-8'));
  const sceneProtectedAssets = protectedAssetsRaw.filter((a: any) => a.scene_unit_id === SCENE_UUID);

  // 6. Chapter Gate Metadata
  const chapterGate = {
    chapter_title: 'Chapter 1: The Cathedral in the Molasse',
    chapter_scope: 'Prologue / Chapter 1',
    verdict: 'PASS',
    compression_requirement: '10~15% editorial compression on organizational and theoretical repetition',
    core_epistemic_envelope: [
      'Local execution only (Paper I physics and 5-tier authority envelope protected)',
      'Subterranean CERN Molasse setting and institutional hierarchy',
      'No cosmic causes, no planetary shield, no severance claims',
      'Epsilon is strictly a phenomenological response model, NOT a fundamental theory'
    ]
  };

  // 7. Scientific Claim Metadata
  const scientificClaims = {
    epsilon_model: {
      status: 'PHENOMENOLOGICAL_MODEL',
      formula: 'V_{\\epsilon}(r) \\sim \\frac{1}{r^2+\\epsilon^2}',
      claim_rule: 'Cannot be claimed as fundamental theory of quantum gravity in Book 1; strictly an assumed finite response scale.'
    },
    cern_molasse_infrastructure: {
      location: 'Underground Molasse rock formation, Geneva basin',
      depth: '100 meters underground',
      authority_envelope: 'Tier-5 manual execution override required for anomalous field ramps'
    },
    sandbox_authority: {
      rule: 'Offline test-bench/sandbox possesses bounded local authority only; never has global or central accelerator authority.'
    },
    actuator_distinction: {
      rule: 'Slow main superconducting dipoles vs. fast secondary corrector actuators must be physically distinguished.'
    }
  };

  // 8. Fetch all 87 Paragraphs for Scene 1 in Working Draft
  console.log('3. Fetching 87 Paragraphs of Scene 1...');
  const { data: mapRows } = await supabase
    .from('revision_content_map')
    .select('unit_id, position, paragraph_version_id, is_included')
    .eq('snapshot_id', draftSnap.id)
    .eq('parent_unit_id', SCENE_UUID)
    .order('position');

  if (!mapRows || mapRows.length !== 87) {
    throw new Error(`Expected exactly 87 paragraphs, got ${mapRows?.length}`);
  }

  const pvIds = mapRows.map(r => r.paragraph_version_id);
  const { data: pvs } = await supabase
    .from('paragraph_versions')
    .select('id, paragraph_unit_id, version_no, body_markdown, word_count, change_type')
    .in('id', pvIds);

  const pvMap = new Map(pvs!.map(p => [p.id, p]));

  // Also fetch content_units for source paths
  const unitIds = mapRows.map(r => r.unit_id);
  const { data: units } = await supabase
    .from('content_units')
    .select('id, source_path')
    .in('id', unitIds);
  const unitPathMap = new Map(units!.map(u => [u.id, u.source_path]));

  const paragraphsList: any[] = [];
  const katexFormulas: any[] = [];
  let sceneTotalWords = 0;
  let fullSceneConcatenatedText = '';

  for (let i = 0; i < mapRows.length; i++) {
    const row = mapRows[i];
    const pv = pvMap.get(row.paragraph_version_id);
    const sourcePath = unitPathMap.get(row.unit_id) || '';
    const bodyText = pv?.body_markdown || '';
    const wordCount = pv?.word_count || bodyText.trim().split(/\s+/).length;
    const bodyHash = crypto.createHash('sha256').update(bodyText).digest('hex');

    sceneTotalWords += wordCount;
    fullSceneConcatenatedText += bodyText + '\n\n';

    // KaTeX detection
    const hasMath = bodyText.includes('$') || bodyText.includes('\\(') || bodyText.includes('\\[') || bodyText.includes('\\frac');
    if (hasMath) {
      katexFormulas.push({
        paragraph_index: i + 1,
        source_path: sourcePath,
        raw_katex_snippet: bodyText
      });
    }

    paragraphsList.push({
      paragraph_index: i + 1,
      source_path: sourcePath,
      paragraph_unit_id: row.unit_id,
      paragraph_version_id: row.paragraph_version_id,
      version_no: pv?.version_no || 1,
      word_count: wordCount,
      body_hash: bodyHash,
      contains_katex: hasMath,
      body_markdown: bodyText
    });
  }

  const sceneBodyHash = crypto.createHash('sha256').update(fullSceneConcatenatedText).digest('hex');

  // 9. Fetch Preceding 5 Paragraphs
  console.log('4. Fetching Preceding 5 Paragraphs Context...');
  const precedingUnitPaths = [
    'act-1/ch-2/sc-1/p-0004',
    'act-1/ch-2/sc-1/p-0005',
    'act-1/ch-2/sc-2/p-0001',
    'act-1/ch-2/sc-2/p-0002',
    'act-2/ch-1/sc-3/p-0001'
  ];

  const { data: precUnits } = await supabase.from('content_units').select('id, source_path').in('source_path', precedingUnitPaths);
  const precMap: any[] = [];
  for (const path of precedingUnitPaths) {
    const u = precUnits?.find(x => x.source_path === path);
    if (u) {
      const { data: m } = await supabase.from('revision_content_map').select('paragraph_version_id').eq('snapshot_id', draftSnap.id).eq('unit_id', u.id).single();
      const { data: pv } = await supabase.from('paragraph_versions').select('body_markdown, word_count').eq('id', m?.paragraph_version_id).single();
      precMap.push({
        source_path: u.source_path,
        unit_id: u.id,
        paragraph_version_id: m?.paragraph_version_id,
        word_count: pv?.word_count || 0,
        body_markdown: pv?.body_markdown || ''
      });
    }
  }

  // 10. Fetch Succeeding 5 Paragraphs (from Scene 2)
  console.log('5. Fetching Succeeding 5 Paragraphs Context...');
  const succeedingUnitPaths = [
    'act-2/ch-3/sc-1/p-0001',
    'act-2/ch-3/sc-1/p-0002',
    'act-2/ch-3/sc-1/p-0003',
    'act-2/ch-3/sc-1/p-0004',
    'act-2/ch-3/sc-1/p-0005'
  ];

  const { data: succUnits } = await supabase.from('content_units').select('id, source_path').in('source_path', succeedingUnitPaths);
  const succMap: any[] = [];
  for (const path of succeedingUnitPaths) {
    const u = succUnits?.find(x => x.source_path === path);
    if (u) {
      const { data: m } = await supabase.from('revision_content_map').select('paragraph_version_id').eq('snapshot_id', draftSnap.id).eq('unit_id', u.id).single();
      const { data: pv } = await supabase.from('paragraph_versions').select('body_markdown, word_count').eq('id', m?.paragraph_version_id).single();
      succMap.push({
        source_path: u.source_path,
        unit_id: u.id,
        paragraph_version_id: m?.paragraph_version_id,
        word_count: pv?.word_count || 0,
        body_markdown: pv?.body_markdown || ''
      });
    }
  }

  // 11. Build Complete JSON Revision Packet
  const revisionPacket = {
    packet_code: PACKET_CODE,
    packet_type: 'SCENE_REVISION_PACKET',
    status: 'READY_FOR_EDITORIAL_REVIEW',
    execution_permission: 'READ_ONLY_AWAITING_APPROVED_FOR_IMPORT_PACKAGE',
    policy: 'PASS 2B EDITORIAL CONTROL POLICY (ZERO AUTOMATED PROSE GENERATION)',
    audit_run: AUDIT_CODE,
    scene_metadata: {
      scene_unit_id: SCENE_UUID,
      scene_title: sceneUnit.title,
      scene_source_path: sceneUnit.source_path,
      chapter: chapterGate.chapter_title,
      total_paragraphs: paragraphsList.length,
      scene_total_words: sceneTotalWords,
      scene_body_hash_sha256: sceneBodyHash
    },
    snapshots: {
      immediate_baseline: baseSnap.code,
      working_draft: draftSnap.code,
      working_manifest_hash: draftSnap.manifest_hash
    },
    scene_matrix: sceneMatrix,
    chapter_gate: chapterGate,
    protected_assets: sceneProtectedAssets,
    scientific_claims: scientificClaims,
    katex_sources: katexFormulas,
    context: {
      preceding_5_paragraphs: precMap,
      succeeding_5_paragraphs: succMap
    },
    paragraphs: paragraphsList
  };

  // Ensure directories exist
  fs.mkdirSync('reports/revision-packets', { recursive: true });
  fs.mkdirSync('docs/revision-platform/revision-packets', { recursive: true });

  fs.writeFileSync(
    'reports/revision-packets/B1_PASS2B_PRO_SC1_PACKET_001.json',
    JSON.stringify(revisionPacket, null, 2),
    'utf-8'
  );

  // 12. Build Markdown Document
  let mdContent = `# Scene Revision Packet: The Architecture of Consensus

**패킷 식별자:** \`${PACKET_CODE}\`  
**씬 식별자 (Scene UUID):** \`${SCENE_UUID}\`  
**씬 제목:** \`${sceneUnit.title}\`  
**원천 경로 (Source Path):** \`${sceneUnit.source_path}\`  
**상위 챕터:** \`${chapterGate.chapter_title}\`  
**관련 감사 계획:** \`${AUDIT_CODE}\` (PROPOSED)  
**직전 기준본 (Immediate Baseline):** \`${baseSnap.code}\` (LOCKED)  
**작업본 (Working Draft):** \`${draftSnap.code}\` (DRAFT)  
**현재 작업본 매니페스트 해시:** \`${draftSnap.manifest_hash}\`  
**씬 단어 수:** **${sceneTotalWords} words**  
**씬 문단 수:** **${paragraphsList.length} paragraphs**  
**씬 전체 원문 해시 (SHA-256):** \`${sceneBodyHash}\`  
**편집 제어 정책:** **PASS 2B EDITORIAL CONTROL POLICY (자동 생성·자동 수정 일체 금지)**  

---

## 1. Chapter Gate & 과학적·인식론적 메타데이터

### 1.1 Chapter Gate 규정
* **게이트 판정:** ${chapterGate.verdict}
* **감축 가이드:** ${chapterGate.compression_requirement}
* **핵심 인식론적 경계:**
${chapterGate.core_epistemic_envelope.map(e => `  * ${e}`).join('\n')}

### 1.2 과학적 주장(Scientific Claims) 제약
* **Epsilon 수식:** \`$$ ${scientificClaims.epsilon_model.formula} $$\`
  * **규정:** 1권에서 Epsilon은 근본 이론(fundamental theory)이 아니며, 진공의 유한 응답 스케일에 대한 현상학적 유한 반응 모델(phenomenological model)로 한정됨.
* **CERN 몰라스 지하시설:** 제네바 분지 지하 100m 몰라스 암반층.
* **샌드박스 제어권:** 국소 시험대(sandbox)는 국소 권한만을 가지며, 중앙 가속기 통제권(global central authority)을 갖지 않음.
* **자석 제어:** 느린 주 쌍극자 자석(slow main dipoles)과 빠른 보조 액추에이터(fast secondary actuators)의 물리적 시간 스케일 구분 엄수.

---

## 2. 보호 자산 (Protected Assets: 6건)

${sceneProtectedAssets.map((a: any, idx: number) => `${idx + 1}. **[${a.status}]** ${a.asset}`).join('\n\n')}

---

## 3. KaTeX 수식 원천 (KaTeX Sources: ${katexFormulas.length}건)

${katexFormulas.map((k: any) => `* **문단 #${k.paragraph_index} (\`${k.source_path}\`):**\n  \`\`\`latex\n  ${k.raw_katex_snippet}\n  \`\`\``).join('\n\n')}

---

## 4. 전후 문맥 (Context: 직전 5문단 & 다음 5문단)

### 4.1 직전 5개 문단 (Preceding 5 Paragraphs)
${precMap.map((p, idx) => `#### [직전 #${5 - idx}] \`${p.source_path}\` (${p.word_count}단어)\n${p.body_markdown}`).join('\n\n')}

---

### 4.2 다음 5개 문단 (Succeeding 5 Paragraphs — Scene 2: The Accumulating Residual)
${succMap.map((p, idx) => `#### [다음 #${idx + 1}] \`${p.source_path}\` (${p.word_count}단어)\n${p.body_markdown}`).join('\n\n')}

---

## 5. 씬 전체 원문 (Full Raw Text: 87 Paragraphs, 무삭제·무요약)

`;

  for (const p of paragraphsList) {
    mdContent += `### [P-${String(p.paragraph_index).padStart(4, '0')}] \`${p.source_path}\`
* **Unit ID:** \`${p.paragraph_unit_id}\`
* **Version ID:** \`${p.paragraph_version_id}\` (v${p.version_no})
* **Word Count:** ${p.word_count}단어
* **SHA-256:** \`${p.body_hash}\`

${p.body_markdown}

---

`;
  }

  fs.writeFileSync('docs/revision-platform/revision-packets/B1_PASS2B_PRO_SC1_PACKET_001.md', mdContent, 'utf-8');

  console.log('\n===========================================================');
  console.log('       REVISION PACKET GENERATION COMPLETED!               ');
  console.log('===========================================================');
  console.log(`Packet Code:           ${PACKET_CODE}`);
  console.log(`Total Paragraphs:      ${paragraphsList.length}`);
  console.log(`Total Words:           ${sceneTotalWords}`);
  console.log(`Full Scene Body Hash:  ${sceneBodyHash}`);
  console.log(`JSON Packet:           reports/revision-packets/B1_PASS2B_PRO_SC1_PACKET_001.json`);
  console.log(`Markdown Packet:       docs/revision-platform/revision-packets/B1_PASS2B_PRO_SC1_PACKET_001.md`);
  console.log(`Manuscript Mutations:  0 (Strict Read-Only Packet Extraction)\n`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
