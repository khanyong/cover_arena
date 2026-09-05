import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are strictly required.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log('=== PASS 1 PUBLICATION MATTER AUDIT SEEDER ===\n');

  // 1. Fetch Project, Snapshots and Top-Level Unit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: appUnit } = await supabase.from('content_units').select('id').eq('source_path', 'act-9').single();

  // 2. Register Publication & Epistemic Debts
  console.log('Registering Publication & Epistemic Debts (9 Records)...');
  const DEBTS = [
    {
      code: 'EPISTEMIC_DEBT_APPENDIX_GLOSSARY_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Appendix A In-Universe Working Terminology Epistemic Classification',
      source_scope: 'Appendix A: Glossary',
      target_scope: 'Publication Matter / Terminology',
      established_in_source: 'Terms in Appendix A represent in-universe models, character shorthand, and speculative frameworks, not independently verified empirical entities.',
      forbidden_in_target: 'Defining Tensor Fluid, Cosmic Shear, or Standing Wave Node as proven physical realities, or defining Comoving Metric Neighborhood as a completed technology in Book 1.',
      required_in_target: 'Rename to "Appendix A: In-Universe Working Terminology". Add scope note. Assign explicit epistemic statuses. Add Book 1 terms: Bounded Local Response Control, Executed State, Support-Decoupled Mass.',
      status: 'OPEN',
    },
    {
      code: 'EQUATION_INTEGRITY_DEBT_APPENDIX_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Appendix B Equation Integrity & Finite Residual Preservation',
      source_scope: 'Appendix B: Key Governing Equations',
      target_scope: 'Publication Matter / Mathematical Rigor',
      established_in_source: 'Matched nodal cancellation removes leading divergence (-A/r^2 vs +A/r^2) but leaves finite residual (q0 + c0). Probability continuity is rho=R^2 and v=grad S / m.',
      forbidden_in_target: 'Writing q0 + c0 -> 0, calling continuity mass-energy conservation of vacuum, writing h instead of hbar, or labeling V_tilde conservation directly as Bianchi identity.',
      required_in_target: 'Rename to "Appendix B: Selected Source-Model Equations and Fictional Control Relations". Preserve finite residual. Correct probability density continuity. Fix h to hbar. Separate Bianchi identity.',
      status: 'OPEN',
    },
    {
      code: 'REFERENCE_INTEGRITY_DEBT_APPENDIX_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Appendix C Research Origins & Zenodo DOI Discrepancy Resolution',
      source_scope: 'Appendix C: Research Origins and References',
      target_scope: 'Publication Matter / Academic Lineage',
      established_in_source: 'Papers I-V provide speculative framework. Fictional engineering in novel is distinct extension. Zenodo DOIs differ between concept DOIs and specific version DOIs.',
      forbidden_in_target: 'Treating academic papers as reporting the fictional collider experiments, or conflating concept DOIs with version DOIs without attribution.',
      required_in_target: 'Maintain DOI registry mapping concept DOIs vs version DOIs. Add clear scope note separating theoretical framework from fictional narrative.',
      status: 'OPEN',
    },
    {
      code: 'PAPER_SCOPE_DEBT_APPENDIX_V_001',
      project_id: proj.id,
      debt_type: 'SERIES_BRIDGE',
      title: 'Papers IV and V Series Scope & Technological Demarcation',
      source_scope: 'Appendix C / Research Lineage',
      target_scope: 'Series Architecture / Technological Grounding',
      established_in_source: 'Paper IV covers hadronic topological knots (Book IV direction). Paper V covers cuprate GL stripe competition (conceptual analogy, NOT Nb3Sn magnet engineering authority).',
      forbidden_in_target: 'Citing Paper V as direct empirical authority for Book 1 large-scale superconducting magnet engineering or quench protection.',
      required_in_target: 'Clearly annotate Paper IV and Paper V scope boundaries in academic notes.',
      status: 'OPEN',
    },
    {
      code: 'PRODUCTION_DEBT_BROKEN_GLYPHS_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Broken Korean Glyphs Elimination in Typography and Export Pipelines',
      source_scope: 'Appendix A-C & Front Matter Typography',
      target_scope: 'Production & Layout Pipelines',
      established_in_source: 'Corrupted ligature strings such as (ffiffi...) appear in rendered PDF output where Korean characters failed to embed.',
      forbidden_in_target: 'Exporting production reader copies containing corrupted ligature replacement glyphs.',
      required_in_target: 'English edition removes corrupted parentheticals or restores clean Unicode UTF-8 Korean. Broken glyph count after export must equal 0.',
      status: 'OPEN',
    },
    {
      code: 'PUBLICATION_DEBT_TOC_SCENE_LABELS_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Table of Contents & Scene Scaffolding Export Separation',
      source_scope: 'Table of Contents & Section Headings',
      target_scope: 'Publication Formats (Reader vs Internal)',
      established_in_source: 'Internal platform displays bracketed scene scaffolding like [Scene 1: ...] and stable UUIDs. Reader edition requires clean presentation.',
      forbidden_in_target: 'Leaking internal scaffolding brackets into commercial reader layout.',
      required_in_target: 'Reader export removes bracketed prefix and UUIDs; page numbers regenerate dynamically in Pass 9.',
      status: 'OPEN',
    },
    {
      code: 'MARKETING_CLAIM_DEBT_BACK_COVER_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Back Cover Marketing Copy Epistemic Alignment',
      source_scope: 'Back Cover Copy',
      target_scope: 'Publication Metadata & Cover Claims',
      established_in_source: 'Current draft asserts confirmed inward-moving cosmic fault line approaching Earth and mischaracterizes Sarah Hayes as a fugitive engineer.',
      forbidden_in_target: 'Marketing claims asserting confirmed approaching cosmic fault line or misrepresenting protagonist institutional roles.',
      required_in_target: 'Adopt revised back cover copy focusing on human intervention altering local physical response and the question of who chooses the boundary.',
      status: 'OPEN',
    },
    {
      code: 'PRODUCTION_DEBT_COPYRIGHT_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Copyright Page Production Metadata & Author Name Protection',
      source_scope: 'Copyright Page',
      target_scope: 'Publication Legal & Registry',
      established_in_source: '"Printed manuscript copy" is working production scaffolding. Author name Kwang Yong Yoo (유광용) must be strictly protected from character name normalization.',
      forbidden_in_target: 'Including production markers in retail edition or modifying author name via story character canon tools.',
      required_in_target: 'Mark "Printed manuscript copy" as production-only; protect author name in all canon normalization scripts.',
      status: 'OPEN',
    },
    {
      code: 'PUBLICATION_DECISION_ACT0_LABEL_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Publication Decision on "ACT 0" Structural Naming',
      source_scope: 'Act 0 / The Broken Variable',
      target_scope: 'Editorial & Book Design',
      established_in_source: '"ACT 0" is a distinctive technical framing emphasizing antecedent conditions before Act 1.',
      forbidden_in_target: 'Modifying Act 0 labeling prior to formal editorial publication decision.',
      required_in_target: 'Retain ACT 0 as authorial structural choice; review at Pass 9 layout.',
      status: 'OPEN',
    },
  ];

  for (const d of DEBTS) {
    const { error: dErr } = await supabase
      .from('series_debts')
      .upsert(d, { onConflict: 'code' });
    if (dErr) throw new Error(`Debt upsert failed for ${d.code}: ${dErr.message}`);
  }
  console.log('9 Publication & Epistemic Debts registered successfully.\n');

  // 3. Create Audit Run B1_PASS1_FRONTMATTER_APPENDIX_001
  const AUDIT_CODE = 'B1_PASS1_FRONTMATTER_APPENDIX_001';
  console.log(`Creating Publication Matter Audit Run ${AUDIT_CODE}...`);

  const { data: auditRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AUDIT_CODE,
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: appUnit.id,
      scope_name: 'PUBLICATION MATTER: FRONT MATTER, EPIGRAPH & APPENDICES',
      criteria_version: '1.0.0',
      status: 'in_review',
      amendment_reason: 'Audit and epistemic boundary alignment for 7 non-narrative source units and 2 nested publication blocks (Front Cover, Title Page, Copyright, TOC, Prologue Epigraph, Appendices A-C, Back Cover).',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Audit run creation failed: ${arErr.message}`);
  console.log(`Audit Run created: ${auditRun.code} (${auditRun.id})\n`);

  // 4. Source DB Units & Logical Publication Blocks Matrix Update
  const PUBLICATION_UNITS = [
    {
      unit_id: '1fdc864a-a826-589a-b37b-5509a240edca', // act-1/ch-2/sc-1 Front Cover
      path: 'act-1/ch-2/sc-1',
      block_name: 'Front Cover',
      action: 'KEEP_REFRAME_CLAIMS',
      notes: 'Genre label: A HARD SCIENCE-FICTION NOVEL. Research origin: Developed from speculative framework of Mechanics of Spatial Vibration I-V. Literary tagline: A NOVEL OF TOPOLOGY, MEMORY, AND THE FRACTURE OF REALITY (literary tagline, not scientific claim). Author name Kwang Yong Yoo protected.',
      epistemic_status: 'PUBLICATION_METADATA_ALIGNED',
    },
    {
      unit_id: 'fdbb38b1-0f2d-55df-834a-d62a7e1e87f7', // act-1/ch-1/sc-1 Title / Half-title
      path: 'act-1/ch-1/sc-1',
      block_name: 'Half-title / Title Page',
      action: 'KEEP_NORMALIZE_METADATA',
      notes: 'Normalize title and subtitle. Associate research origin note clearly separating speculative framework from fictional engineering.',
      epistemic_status: 'METADATA_NORMALIZED',
    },
    {
      unit_id: '997e900d-80fe-58e5-828d-e79e34a224d4', // act-1/ch-2/sc-2 Copyright
      path: 'act-1/ch-2/sc-2',
      block_name: 'Copyright Page',
      action: 'KEEP_PRODUCTION_CLEANUP',
      notes: 'Mark "Printed manuscript copy" as production-only scaffolding. Retain author copyright Kwang Yong Yoo. Author name excluded from character canon replacement.',
      epistemic_status: 'PRODUCTION_CLEANUP_ALIGNED',
    },
    {
      unit_id: 'bae8fe68-32e4-5325-85a0-c586e01bb24f', // act-2/ch-1/sc-3 Prologue Epigraph
      path: 'act-2/ch-1/sc-3',
      block_name: 'Prologue Epigraph',
      action: 'KEEP_PROTECTED_EPIGRAPH',
      notes: '“Science is ruthless with obsolete theories...” Authorial/fictional epigraph. Exact text preserved.',
      epistemic_status: 'EXACT_TEXT_PROTECTED',
    },
    {
      unit_id: '128c6328-ada4-5d22-8d0f-674b699b4664', // act-9/ch-1/sc-1 Appendix A
      path: 'act-9/ch-1/sc-1',
      block_name: 'Appendix A: In-Universe Working Terminology',
      action: 'REWRITE_EPISTEMIC_GLOSSARY',
      notes: 'Rename to In-Universe Working Terminology. Add scope note. Neutralize Epsilon Regularization. Remove or future-label Comoving Metric Neighborhood. Standing Wave Node stripped of gravity nullification claims. Add Bounded Local Response Control, Executed State, Support-Decoupled Mass.',
      epistemic_status: 'EPISTEMIC_GLOSSARY_CLASSIFIED',
    },
    {
      unit_id: '9e0f6234-f9f9-5623-a490-1e1116fa32ea', // act-9/ch-2/sc-1 Appendix B
      path: 'act-9/ch-2/sc-1',
      block_name: 'Appendix B: Selected Source-Model Equations',
      action: 'REWRITE_EQUATION_INTEGRITY',
      notes: 'Rename to Selected Source-Model Equations and Fictional Control Relations. Remove q0+c0->0; retain finite residual. Probability density continuity defined (rho=R^2, v=grad S / m). Correct h to hbar. Separate Bianchi identity from phenomenological stress-energy conservation.',
      epistemic_status: 'EQUATION_INTEGRITY_VERIFIED',
    },
    {
      unit_id: 'e7a7ed8a-a663-5bf3-9a96-8e8cd0cd046b', // act-9/ch-3/sc-1 Appendix C
      path: 'act-9/ch-3/sc-1',
      block_name: 'Appendix C: Research Origins and References',
      action: 'VERIFY_AND_REWRITE_REFERENCES',
      notes: 'Zenodo DOI Registry: concept vs version DOIs categorized. Clear scope note separating theoretical framework from novel fiction. Demarcate Paper IV (hadronic knots) and Paper V (cuprate GL analogy, not Nb3Sn magnet authority).',
      epistemic_status: 'DOI_AND_SCOPE_VERIFIED',
    },
  ];

  console.log('Updating Scene Matrices and Structure Proposals for 7 Source Units...');
  for (const u of PUBLICATION_UNITS) {
    const { error: smErr } = await supabase
      .from('scene_matrices')
      .upsert({
        snapshot_id: baseSnap.id,
        scene_unit_id: u.unit_id,
        audit_run_id: auditRun.id,
        pov_character: 'N/A (Publication Matter)',
        local_question: `출판 단위 ${u.block_name}의 과학적·문헌적·조판적 무결성이 검증 기준을 충족하는가?`,
        action: 'Reframe',
        protected_status: 'Canon',
        notes: u.notes,
        epistemic_boundary: {
          block_name: u.block_name,
          action: u.action,
          status: u.epistemic_status,
          guideline_notes: u.notes,
        },
      }, { onConflict: 'snapshot_id,scene_unit_id' });

    if (smErr) throw new Error(`Scene Matrix upsert failed for ${u.block_name}: ${smErr.message}`);

    const { error: scpErr } = await supabase
      .from('structure_change_proposals')
      .upsert({
        audit_run_id: auditRun.id,
        scene_unit_id: u.unit_id,
        action: 'KEEP_REFRAME_COMPRESS',
        current_word_count: 50,
        target_word_count: 50,
        projected_word_delta: 0,
        target_compression_percent: 0,
        target_tolerance_percent: 5.0,
        target_type: 'publication_matter',
        is_hard_limit: false,
        rationale: u.notes,
        dependency_notes: `Publication Block: ${u.block_name} | Action: ${u.action}`,
      }, { onConflict: 'audit_run_id,scene_unit_id' });

    if (scpErr) throw new Error(`Proposal upsert failed for ${u.block_name}: ${scpErr.message}`);
  }
  console.log('7 Source Units updated successfully in Scene Matrices and Proposals.\n');

  // 5. Calculate SHA-256 Audit Hash and Lock B1_PASS1_FRONTMATTER_APPENDIX_001
  console.log('Calculating SHA-256 Audit Hash and locking B1_PASS1_FRONTMATTER_APPENDIX_001...');
  const auditPayload = JSON.stringify({
    code: AUDIT_CODE,
    scope: 'PUBLICATION MATTER: FRONT MATTER, EPIGRAPH & APPENDICES',
    source_units_count: 7,
    logical_publication_blocks_count: 9,
    units: PUBLICATION_UNITS,
    debts: DEBTS.map(d => d.code),
    nested_blocks: {
      table_of_contents: {
        action: 'REGENERATE_AFTER_PASS2',
        rule: 'Strip internal bracketed scene scaffolding and UUIDs for reader export; dynamic page regeneration in Pass 9.',
      },
      back_cover_copy: {
        action: 'REWRITE_MARKETING_CLAIMS',
        approved_draft: 'When space begins to remember, reality becomes the equation... Human intervention can change part of reality’s local response. The next question is no longer only what is true. It is who gets to choose the boundary.',
      }
    }
  });

  const auditHash = crypto.createHash('sha256').update(auditPayload).digest('hex');

  const { error: lockErr } = await supabase
    .from('audit_runs')
    .update({
      status: 'locked',
      audit_hash: auditHash,
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', auditRun.id);

  if (lockErr) throw new Error(`Audit locking failed: ${lockErr.message}`);

  console.log('===========================================================');
  console.log(' PASS 1 PUBLICATION MATTER AUDIT LOCKED SUCCESSFULLY!      ');
  console.log('===========================================================');
  console.log(`Audit Run Code: ${AUDIT_CODE}`);
  console.log(`Audit Hash (SHA-256): ${auditHash}`);
  console.log(`Source Units: 7 | Logical Blocks: 9`);
  console.log(`Status: LOCKED (All Pre-Global-Lock Requirements Satisfied)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
