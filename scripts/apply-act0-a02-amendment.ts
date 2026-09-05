import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== PASS 1 ACT 0 AUDIT AMENDMENT A02 & FAMILY NAME CANON ===\n');

  // 1. Fetch project & audits
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: rootRun } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_ACT0_001').single();
  const { data: a01Run } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_ACT0_001_A01').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: act0 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3').single();

  console.log(`Project ID: ${proj.id}`);
  console.log(`Root Audit: ${rootRun.code} (${rootRun.id})`);
  console.log(`Parent A01 Audit: ${a01Run.code} (${a01Run.id})\n`);

  // 2. Seed Character Entities
  console.log('Registering Character Entities (Yoo Ji-man, Jeon Seo-yeon, Ian Yoo)...');
  const CHARACTERS = [
    {
      character_code: 'CHAR_YOO_JIMAN',
      canonical_name_ko: '유지만',
      canonical_name_en: 'Yoo Ji-man',
      canonical_name_formal: 'YOO, JI-MAN',
      relationship_role: 'Father of Ian Yoo, Spouse of Jeon Seo-yeon',
      description: 'Structural engineering consultant, taught Ian bounded imperfection philosophy and the silver compass. Presumed dead in Helios incident.',
    },
    {
      character_code: 'CHAR_JEON_SEOYEON',
      canonical_name_ko: '전서연',
      canonical_name_en: 'Jeon Seo-yeon',
      canonical_name_formal: 'JEON, SEO-YEON',
      relationship_role: 'Mother of Ian Yoo, Spouse of Yoo Ji-man',
      description: 'Documentary records, logistics, and legal compliance auditor. Retains own surname Jeon after marriage per Korean naming tradition.',
    },
    {
      character_code: 'CHAR_IAN_YOO',
      canonical_name_ko: '유이안',
      canonical_name_en: 'Ian Yoo',
      canonical_name_formal: 'YOO, IAN',
      relationship_role: 'Son of Yoo Ji-man and Jeon Seo-yeon',
      description: 'Physicist, protagonist. Inherits father Yoo Ji-man surname Yoo. Direct call: Ian / Dr. Yoo.',
    }
  ];

  const charMap: Record<string, string> = {};
  for (const c of CHARACTERS) {
    const { data: charRow, error: cErr } = await supabase
      .from('character_entities')
      .upsert(c, { onConflict: 'character_code' })
      .select()
      .single();
    if (cErr) throw new Error(`Character entity upsert failed for ${c.character_code}: ${cErr.message}`);
    charMap[c.character_code] = charRow.id;
  }
  console.log('Character entities registered successfully.\n');

  // 3. Seed Character Aliases
  console.log('Registering Character Aliases (Canonical & Historical Deprecated)...');
  const ALIASES = [
    // CHAR_YOO_JIMAN
    { character_id: charMap['CHAR_YOO_JIMAN'], alias_text: 'Yoo Ji-man', alias_type: 'canonical', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_YOO_JIMAN'], alias_text: '유지만', language: 'ko', alias_type: 'canonical', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_YOO_JIMAN'], alias_text: 'YOO, JI-MAN', alias_type: 'formal', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_YOO_JIMAN'], alias_text: 'Mr. Yoo', alias_type: 'direct', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_YOO_JIMAN'], alias_text: 'Kim Ji-man', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, valid_until_snapshot: 'B1_v1.0_LOCKED', replacement_alias: 'Yoo Ji-man', notes: 'Historical source alias in baseline B1_v1.0_LOCKED.' },
    { character_id: charMap['CHAR_YOO_JIMAN'], alias_text: 'KIM, JI-MAN', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, valid_until_snapshot: 'B1_v1.0_LOCKED', replacement_alias: 'YOO, JI-MAN' },
    { character_id: charMap['CHAR_YOO_JIMAN'], alias_text: 'Kim J.M.', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, valid_until_snapshot: 'B1_v1.0_LOCKED', replacement_alias: 'Yoo J.M.' },
    { character_id: charMap['CHAR_YOO_JIMAN'], alias_text: '김지만', language: 'ko', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, replacement_alias: '유지만' },

    // CHAR_JEON_SEOYEON
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: 'Jeon Seo-yeon', alias_type: 'canonical', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: '전서연', language: 'ko', alias_type: 'canonical', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: 'JEON, SEO-YEON', alias_type: 'formal', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: 'Ms. Jeon', alias_type: 'direct', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: 'Yoo Seo-yeon', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, valid_until_snapshot: 'B1_v1.0_LOCKED', replacement_alias: 'Jeon Seo-yeon' },
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: 'YOO, SEO-YEON', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, valid_until_snapshot: 'B1_v1.0_LOCKED', replacement_alias: 'JEON, SEO-YEON' },
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: 'Seo-yeon Yoo', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, replacement_alias: 'Jeon Seo-yeon' },
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: 'Mrs. Yoo', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, replacement_alias: 'Ms. Jeon' },
    { character_id: charMap['CHAR_JEON_SEOYEON'], alias_text: '유서연', language: 'ko', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, replacement_alias: '전서연' },

    // CHAR_IAN_YOO
    { character_id: charMap['CHAR_IAN_YOO'], alias_text: 'Ian Yoo', alias_type: 'canonical', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_IAN_YOO'], alias_text: '유이안', language: 'ko', alias_type: 'canonical', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_IAN_YOO'], alias_text: 'YOO, IAN', alias_type: 'formal', is_canonical: true, is_deprecated: false },
    { character_id: charMap['CHAR_IAN_YOO'], alias_text: 'Dr. Yoo', alias_type: 'allowed', is_canonical: false, is_deprecated: false },
    { character_id: charMap['CHAR_IAN_YOO'], alias_text: 'Yoo Ian', alias_type: 'deprecated_historical', is_canonical: false, is_deprecated: true, replacement_alias: 'Ian Yoo' },
  ];

  for (const a of ALIASES) {
    const { error: aErr } = await supabase.from('character_aliases').insert(a);
    if (aErr) throw new Error(`Alias insertion failed for ${a.alias_text}: ${aErr.message}`);
  }
  console.log(`Inserted ${ALIASES.length} character aliases.\n`);

  // 4. Create and Lock Authorial Canon Decision CANON_DECISION_FAMILY_NAMES_001
  console.log('Creating Authorial Canon Decision CANON_DECISION_FAMILY_NAMES_001...');
  const { data: canonDec, error: cdErr } = await supabase
    .from('canon_decisions')
    .upsert({
      code: 'CANON_DECISION_FAMILY_NAMES_001',
      decision_type: 'AUTHORIAL_CANON',
      status: 'LOCKED',
      effective_scope: 'BOOKS_1_TO_4, ENGLISH_AND_KOREAN_EDITIONS',
      effective_from: 'B1_v1.1_STRUCT_DRAFT',
      summary: 'Family Name Canon: Father is Yoo Ji-man, Mother is Jeon Seo-yeon, Son is Ian Yoo. Ian uses father surname Yoo; Jeon Seo-yeon retains own surname. Discarded prior maternal-surname assumption.',
      details: {
        family: {
          father: { ko: '유지만', en_narrative: 'Yoo Ji-man', en_formal: 'YOO, JI-MAN', direct: 'Ji-man / Mr. Yoo' },
          mother: { ko: '전서연', en_narrative: 'Jeon Seo-yeon', en_formal: 'JEON, SEO-YEON', direct: 'Seo-yeon / Ms. Jeon' },
          son: { ko: '유이안', en_narrative: 'Ian Yoo', en_formal: 'YOO, IAN', direct: 'Ian / Dr. Yoo' },
        },
        patrilineal_naming: 'Ian Yoo is the biological and legal son of Yoo Ji-man. He uses his father surname Yoo.',
        independent_maternal_naming: 'Jeon Seo-yeon retains her own surname Jeon after marriage in accordance with Korean cultural practice.',
        baseline_preservation: 'B1_v1.0_LOCKED remains untouched with original historical text.',
        text_mutation_pass1: 0,
        structure_mutation_pass1: 0,
        supersedes: 'CONTINUITY_DEBT_FAMILY_NAME_001',
      },
      supersedes_code: 'CONTINUITY_DEBT_FAMILY_NAME_001',
      locked_at: new Date().toISOString(),
    }, { onConflict: 'code' })
    .select()
    .single();

  if (cdErr) throw new Error(`Canon decision creation failed: ${cdErr.message}`);
  console.log(`Canon Decision LOCKED: ${canonDec.code} (${canonDec.id})\n`);

  // 5. Update Series Debts with A02 Corrections
  console.log('Updating Series Debts with A02 Epistemic and Source Corrections...');
  const UPDATED_DEBTS = [
    {
      code: 'CONTINUITY_DEBT_FAMILY_NAME_001',
      resolution_status: 'SUPERSEDED',
      resolved_by_canon_code: 'CANON_DECISION_FAMILY_NAMES_001',
      resolution_notes: 'SUPERSEDED BY CANON_DECISION_FAMILY_NAMES_001. Final Canon: Father = Yoo Ji-man, Mother = Jeon Seo-yeon, Son = Ian Yoo. Ian uses father surname Yoo; Jeon Seo-yeon retains own surname Jeon. Discarded prior maternal-surname interpretation. Textual normalization scheduled for Pass 2A.',
    },
    {
      code: 'SERIES_DEBT_A0_B2_MASS_PROOF_001',
      debt_type: 'EPISTEMIC',
      title: 'WIM Vehicle Mass Measurement vs Personal Identity Verification',
      source_scope: 'Book 2 Sketch / The Phantom Transponder / The Weigh-In-Motion Anomaly / The 82-Kilogram Proof',
      target_scope: 'Book 2 / Convoy Tracking',
      established_in_source: 'Book 1 establishes no convoy, RFID tag, or vehicle weight anomaly. Book 2 Sketch proposes transponder activity and WIM sensor axle load data. The +82.4 kg is not a direct observation, but a Model-Derived Estimate relying on multiple assumptions (curb weight, fuel, occupants, cargo, configuration variance).',
      forbidden_in_target: 'Declaring that WIM +82.4 kg proves Yoo Ji-man was inside the vehicle. Treating 82.4 kg as a directly measured identity signature. Using "Mass cannot lie" to bypass model uncertainty.',
      required_in_target: 'Multi-layer corroboration required: transponder continuity + repeated multi-station WIM + vehicle baseline + fuel/cargo accounting + route continuity + independent present-tense biological evidence.',
      resolution_status: 'OPEN',
    },
    {
      code: 'SERIES_DEBT_A0_B2_BODY_IDENTITY_001',
      debt_type: 'SERIES_BRIDGE',
      title: 'Visual Body Identification vs Survival Contradiction',
      source_scope: 'Book 1 / Act 0 / The Official Verdict (Scene 4)',
      target_scope: 'Book 2 / Overall Arc',
      established_in_source: 'Ian Yoo and Jeon Seo-yeon visually viewed a body officially identified and presented as Yoo Ji-man. The face was mostly intact. Preliminary forensic report attributed death to fall trauma (manner: Undetermined). Independent family DNA verification was NOT performed.',
      forbidden_in_target: 'Revealing Yoo Ji-man alive in Book 2 while ignoring or hand-waving the displayed body. Treating urn chronology alone as sufficient proof of survival.',
      required_in_target: 'Explain the identity of the displayed body, how it was processed as Yoo Ji-man, and provide a credible institutional and biological substitution mechanism stronger than the urn discrepancy.',
      resolution_status: 'OPEN',
    },
    {
      code: 'SERIES_DEBT_A0_B2_URN_001',
      debt_type: 'SERIES_BRIDGE',
      title: 'Thermal Timeline & Cremation Custody Chronology Contradiction',
      source_scope: 'Book 1 / Act 0 / The Thermal Timeline (Scene 5)',
      target_scope: 'Book 2 / Opening',
      established_in_source: 'Physically impossible custody chronology: primary cremation cycle ended at 19:48, cooling hold ended at 20:30, but electronic processing occurred at 18:29 and transfer at 18:30. Discrepancy strictly left UNKNOWN in Book 1.',
      forbidden_in_target: 'Jeon Seo-yeon discovering the same 18:30/20:30 discrepancy for the first time in Book 2. Jumping from timeline discrepancy to "father is alive / state extracted him".',
      required_in_target: 'Book 2 Evidence Gate: 1. Contemporary anomaly under Yoo Ji-man identity -> 2. Liveness-dependent evidence (perfusion/pulse/challenge-response) -> 3. Independent corroboration -> 4. Recent-survival inference -> 5. Physical confirmation.',
      resolution_status: 'OPEN',
    },
    {
      code: 'CHARACTER_DEBT_SEOYEON_METHOD_001',
      debt_type: 'CHARACTER_LENS',
      title: "Jeon Seo-yeon's Canonical Investigative Lens: Records, Logistics, Invoices",
      source_scope: 'Book 1 / Act 0 (The Raid, Inverted Logistics, Departure Horizon)',
      target_scope: 'Books 2–4 Series-wide',
      established_in_source: "Jeon Seo-yeon investigates strictly via records, invoices, access logs, timetables, contracts, commercial manifests, and physical sequence cross-referencing. She explicitly rejects 'conspiracy' leaps.",
      forbidden_in_target: 'Degrading Jeon Seo-yeon into an omnipotent cyberpunk hacker who penetrates military networks or biometric mainframes directly.',
      required_in_target: 'Preserve her authentic methodology: procurement tracking, chain-of-custody audits, legal records, commercial manifests, document authentication.',
      resolution_status: 'OPEN',
    }
  ];

  for (const ud of UPDATED_DEBTS) {
    const { error: udErr } = await supabase.from('series_debts').update(ud).eq('code', ud.code);
    if (udErr) throw new Error(`Failed to update series debt ${ud.code}: ${udErr.message}`);
  }
  console.log('Successfully updated 5 Series Debts with A02 requirements.\n');

  // 6. Create Additive Audit Amendment Record B1_PASS1_ACT0_001_A02
  console.log('Creating Additive Audit Amendment Record B1_PASS1_ACT0_001_A02...');
  const A02_CODE = 'B1_PASS1_ACT0_001_A02';

  const { data: a02Run, error: a02Err } = await supabase
    .from('audit_runs')
    .upsert({
      code: A02_CODE,
      parent_audit_id: a01Run.id,
      run_type: 'amendment',
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: act0.id,
      scope_name: 'ACT 0: THE BROKEN VARIABLE (A02 AMENDMENT)',
      criteria_version: '1.2.0',
      status: 'in_review',
      amendment_reason: 'A02 Amendment: WIM evidence classification (Model-Derived Estimate), Body identity distinction (presented identity vs biological verification), Scene 7 & 8 protected asset attribution correction, Family name canon normalization, Act 0 preferred range 22,500-24,650 and Chapter 2 combined 18.0% compression.',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (a02Err) throw new Error(`A02 run creation failed: ${a02Err.message}`);
  console.log(`A02 Audit Run ID: ${a02Run.id}\n`);

  // 7. Update Scene Matrices with Precise A02 Protected Assets and Epistemic Boundaries
  console.log('Updating Scene Matrices with precise A02 Protected Assets and UUID attribution...');
  const SCENE_A02_UPDATES = [
    {
      scene_unit_id: 'ba701488-a4da-52c1-9ac8-33f60adccdb9', // Scene 4: The Official Verdict
      protected_assets: [
        'A body officially identified and presented as Yoo Ji-man was shown to Ian Yoo and Jeon Seo-yeon',
        'Preliminary forensic report attributed death to fall trauma; manner remained Undetermined',
        'Public reporting characterized the death as suicide before evidence supported that conclusion',
        'Yoo Ji-man had longstanding severe discomfort around exposed heights; voluntary jump inconsistent with known behavior',
        'Official reconstruction contained an unobserved eleven-second interval'
      ],
      epistemic_boundary: {
        known: 'A body officially identified and presented as Yoo Ji-man was shown to Ian Yoo and Jeon Seo-yeon. Face mostly intact. Preliminary report: death from fall trauma, manner Undetermined. Ji-man had severe acrophobia. Official reconstruction contained 11-second unobserved interval. Public reporting characterized death as suicide before evidence.',
        institutional_claim: 'The state identified the body as Yoo Ji-man.',
        inference: 'A voluntary jump appears inconsistent with Yoo Ji-man known behavior.',
        limit: 'Behavior during acute distress cannot be reconstructed from acrophobia alone.',
        not_established: 'Independent family-controlled DNA identification. Complete biological chain of identity excluding substitution.',
        unknown: 'Whether the displayed body was biologically Yoo Ji-man. Whether fall was voluntary, forced, staged, or replaced.',
        forbidden_conclusion: 'Official report conclusively ruled suicide; Acrophobia proves murder; Institutional identity automatically proves biological identity.'
      }
    },
    {
      scene_unit_id: '897cef16-f551-501c-858d-4c74e5add72c', // Scene 5: The Thermal Timeline
      protected_assets: [
        'It is a record containing a physically impossible chronology.',
        'The official chronology was broken.',
        'A record may lie. A physical sequence cannot negotiate with time.',
        '19:48 primary cremation cycle ended / 20:30 cooling hold ended / 18:29 scan / 18:30 transfer timestamps',
        'Not false record, but physically impossible chronology'
      ],
      epistemic_boundary: {
        known: '19:48 cremation cycle ended, 20:30 cooling hold ended, 18:29-18:30 electronic processing. This electronic record cannot describe physical processing and transfer of Yoo Ji-man cremated remains. Unscheduled credential used; no corresponding building-entry event found in access record.',
        inference: 'At least one recorded event does not represent the physical event it claims to represent.',
        hypotheses: ['Fabrication', 'Pre-staging', 'Database corruption', 'Workflow misassignment', 'Credential misuse', 'Administrative error'],
        unknown: 'Which hypothesis is correct; whether discrepancy was intentional; whose remains were processed; whether Yoo Ji-man survived.',
        forbidden_conclusion: 'Record was intentionally falsified; urn was definitely substituted; Yoo Ji-man is definitely alive.'
      }
    },
    {
      scene_unit_id: '4d4f7754-aff7-5887-ac2f-36ceb02921c8', // Scene 6: The Inverted Logistics
      protected_assets: [
        'Never turn thousands of people and dozens of institutions into one person.',
        'T-36h infrastructure-security inquiry began',
        'T-17h routine military transport, T-15h commercial restrictions, T-14h emergency cargo, T-12h rail, T-10h fuel, T-8h multi-port, T-4h custody, T0 Helios collapse timeline'
      ],
      epistemic_boundary: {
        known: 'Government-linked transport, fuel, and readiness activity accelerated before Helios. Destination pattern was not primarily direct response toward Helios.',
        inference: 'Some authorities anticipated a significant contingency.',
        unknown: 'What contingency was anticipated; which institutions possessed which information; whether Helios was specifically anticipated; whether detention, readiness, and collapse shared one cause.',
        forbidden_conclusion: 'The government knew Helios would collapse; all pre-event movements were part of one conspiracy; logistical sequence proves a false flag.'
      }
    },
    {
      scene_unit_id: '63e8557e-16c2-509b-a3f6-067a1aa257bc', // Scene 7: Departure Horizon
      action: 'KEEP_COMPRESS',
      protected_assets: [
        'One reality. Incomplete observation.',
        'Uncertainty belongs to the observer, not necessarily to the event.',
        'If all relevant variables were known, the ambiguity would disappear. (Arc-protected: unproven extrapolation; Ian knows it should be marked UNCONFIRMED but leaves it unlabeled)'
      ],
      epistemic_boundary: {
        known: 'Clean departure achieved via lawful corporate manifest and shipping channels. Event has one physical history, but observer access is incomplete.',
        arc_event: 'Ian deterministic hypothesis first appears as a psychological response to uncertainty.',
        epistemic_status: 'First two lines distinguish physical history from observer access. Third line is an unproven extrapolation.',
        forbidden_conclusion: 'Departure was accomplished via cyberpunk mainframe hacking; determinism was proved as objective physical fact.'
      }
    },
    {
      scene_unit_id: '3d005e08-1f42-521b-be86-b6fb3efe0326', // Scene 8: The Absolute Boundary
      action: 'KEEP_REFRAME_COMPRESS',
      protected_assets: [
        'You are using physics to escape philosophy.',
        'Neither of us taught you certainty.',
        'At complete information, uncertainty = 0. (Arc-protected: consciously adopted belief bounded by "No proof. No experiment. No theorem.")',
        'Find the variables no institution can rewrite.'
      ],
      epistemic_boundary: {
        known: 'Jeon Seo-yeon separates truth from ownership and knowledge from completeness.',
        arc_event: 'Ian Yoo converts his emotional refusal of irrecoverable uncertainty into a deterministic principle.',
        epistemic_status: 'At complete information, uncertainty = 0. is not established physical law. It is Ian consciously adopted belief, explicitly bounded by: No proof. No experiment. No theorem.',
        forbidden_conclusion: 'Laplacian determinism is validated as objective physical truth of the novel universe.'
      }
    }
  ];

  for (const sua of SCENE_A02_UPDATES) {
    const updateData: any = {
      protected_assets: sua.protected_assets,
      epistemic_boundary: sua.epistemic_boundary,
    };
    if (sua.action) updateData.action = sua.action.startsWith('KEEP') ? 'Keep' : 'Compress';

    const { error: smErr } = await supabase
      .from('scene_matrices')
      .update(updateData)
      .eq('snapshot_id', baseSnap.id)
      .eq('scene_unit_id', sua.scene_unit_id);
    if (smErr) throw new Error(`Scene Matrix A02 update failed for ${sua.scene_unit_id}: ${smErr.message}`);

    // Update proposal action if specified
    if (sua.action) {
      await supabase
        .from('structure_change_proposals')
        .update({ action: sua.action })
        .eq('audit_run_id', rootRun.id)
        .eq('scene_unit_id', sua.scene_unit_id);
    }
  }
  console.log('Scene Matrices and Proposals updated with exact A02 attributions.\n');

  // 8. Update Chapter 2 Combined Compression Metrics & Proposal Metadata
  console.log('Updating Proposal Metrics (tolerance 5%, Chapter 2 combined 18%, preferred range 22,500-24,650)...');
  await supabase
    .from('structure_change_proposals')
    .update({
      target_tolerance_percent: 5.00,
      target_type: 'editorial_guidance',
      is_hard_limit: false,
    })
    .eq('audit_run_id', rootRun.id);

  // 9. Calculate SHA-256 Amendment Hash and Lock B1_PASS1_ACT0_001_A02
  console.log('Calculating A02 Amendment Hash and locking B1_PASS1_ACT0_001_A02...');
  const a02Payload = JSON.stringify({
    parent_amendment: a01Run.code,
    amendment_code: A02_CODE,
    canon_decision: canonDec.code,
    characters: CHARACTERS,
    debts: UPDATED_DEBTS,
    scene_updates: SCENE_A02_UPDATES,
    metrics: {
      initial_target: 24630,
      act_preferred_range: '22,500-24,650',
      tolerance_percent: 5.0,
      chapter2_combined_compression: 18.0,
      scene4_compression: 19.0,
    }
  });
  const a02Hash = crypto.createHash('sha256').update(a02Payload).digest('hex');

  const { error: lockErr } = await supabase
    .from('audit_runs')
    .update({
      status: 'locked',
      audit_hash: a02Hash,
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', a02Run.id);

  if (lockErr) throw new Error(`A02 locking failed: ${lockErr.message}`);

  console.log('===========================================================');
  console.log(' PASS 1 ACT 0 AUDIT AMENDMENT A02 LOCKED SUCCESSFULLY!     ');
  console.log('===========================================================');
  console.log(`Amendment Code: ${A02_CODE}`);
  console.log(`Parent: ${a01Run.code}`);
  console.log(`Root: ${rootRun.code}`);
  console.log(`Canon Decision: ${canonDec.code}`);
  console.log(`A02 Hash (SHA-256): ${a02Hash}`);
  console.log(`Family Canon: Yoo Ji-man / Jeon Seo-yeon / Ian Yoo`);
  console.log(`Status: LOCKED (Pass 1 Act 0 Finalized with A02)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
