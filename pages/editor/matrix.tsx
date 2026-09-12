import React, { useEffect, useState, useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import {
  getRevisionProjectBySlug,
  getRevisionSnapshotByCode,
  getSceneUnit,
  getSceneWithParagraphs,
  getLatestAuditRun,
  getStructureProposal,
  getChapterGate,
} from '../../shared/lib/revisions/queries';
import {
  createParagraphCheckpoint,
  saveSceneMatrix,
} from '../../shared/lib/revisions/commands';
import type {
  RevisionProject,
  RevisionSnapshot,
  SceneWithParagraphs,
  SceneMatrix,
  SceneAction,
  ProtectedStatus,
  SceneStatus,
} from '../../shared/lib/revisions/types';

// Remote Write Freeze: keep this unfinished editor unavailable, including its
// Next.js data route. Reopening requires separately approved authentication and
// write-gateway safeguards; a query parameter must never bypass this gate.
export const getServerSideProps: GetServerSideProps = async () => ({
  notFound: true,
});

export default function MatrixEditorPage() {
  const router = useRouter();
  const {
    project: projectSlugParam,
    baseline: baselineCodeParam,
    working: workingCodeParam,
    scene: scenePathParam,
  } = router.query;

  const projectSlug = (typeof projectSlugParam === 'string' ? projectSlugParam : 'the-resonance-of-space-book-1');
  const baselineCode = (typeof baselineCodeParam === 'string' ? baselineCodeParam : 'B1_v1.0_LOCKED');
  const workingCode = (typeof workingCodeParam === 'string' ? workingCodeParam : 'B1_v1.1_STRUCT_DRAFT');
  const scenePath = (typeof scenePathParam === 'string' ? scenePathParam : 'act-2/ch-3/sc-2');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [project, setProject] = useState<RevisionProject | null>(null);
  const [baselineSnapshot, setBaselineSnapshot] = useState<RevisionSnapshot | null>(null);
  const [workingSnapshot, setWorkingSnapshot] = useState<RevisionSnapshot | null>(null);

  const [baselineScene, setBaselineScene] = useState<SceneWithParagraphs | null>(null);
  const [workingScene, setWorkingScene] = useState<SceneWithParagraphs | null>(null);

  // Local draft edits per paragraphUnitId
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});
  const [changeNotes, setChangeNotes] = useState<Record<string, string>>({});
  const [savingParagraphId, setSavingParagraphId] = useState<string | null>(null);

  // Scene Matrix form state
  const [matrixState, setMatrixState] = useState<Partial<SceneMatrix>>({});
  const [savingMatrix, setSavingMatrix] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Pass 1 Audit Run & Proposals state
  const [auditRun, setAuditRun] = useState<any | null>(null);
  const [structureProposal, setStructureProposal] = useState<any | null>(null);
  const [chapterGate, setChapterGate] = useState<any | null>(null);

  // View Mode: 'compare' (50/50), 'audit' (65/35), 'focus' (full editor)
  const [viewMode, setViewMode] = useState<'compare' | 'audit' | 'focus'>('compare');

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Project
      const proj = await getRevisionProjectBySlug(projectSlug);
      if (!proj) throw new Error(`Project "${projectSlug}" not found.`);
      setProject(proj);

      // 2. Snapshots
      const baseSnap = await getRevisionSnapshotByCode(proj.id, baselineCode);
      if (!baseSnap) throw new Error(`Baseline snapshot "${baselineCode}" not found.`);
      setBaselineSnapshot(baseSnap);

      const workSnap = await getRevisionSnapshotByCode(proj.id, workingCode);
      if (!workSnap) throw new Error(`Working snapshot "${workingCode}" not found.`);
      setWorkingSnapshot(workSnap);

      // 3. Scene Unit (supports permanent UUID or source_path)
      const scUnit = await getSceneUnit(proj.id, scenePath);
      if (!scUnit) throw new Error(`Scene unit "${scenePath}" not found.`);

      // 4. Baseline & Working scene data
      const baseData = await getSceneWithParagraphs(baseSnap.id, scUnit.id);
      const workData = await getSceneWithParagraphs(workSnap.id, scUnit.id);

      setBaselineScene(baseData);
      setWorkingScene(workData);

      // 5. Fetch Pass 1 Audit Run, Structure Proposal, and Chapter Gate
      const audit = await getLatestAuditRun(proj.id, 1);
      setAuditRun(audit);
      if (audit) {
        const prop = await getStructureProposal(audit.id, scUnit.id);
        setStructureProposal(prop);
        if (scUnit.original_parent_id) {
          const gate = await getChapterGate(audit.id, scUnit.original_parent_id);
          setChapterGate(gate);
        }
      }

      if (workData?.sceneMatrix) {
        setMatrixState(workData.sceneMatrix);
      } else {
        setMatrixState({
          action: 'Keep',
          status: 'Diagnosed',
          protected_status: 'None',
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load Matrix Workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      loadData();
    }
  }, [router.isReady, projectSlug, baselineCode, workingCode, scenePath]);

  // Baseline paragraph lookup
  const baselineParagraphMap = useMemo(() => {
    const map = new Map<string, string>();
    if (baselineScene?.paragraphs) {
      for (const p of baselineScene.paragraphs) {
        map.set(p.unit.id, p.version.body_markdown);
      }
    }
    return map;
  }, [baselineScene]);

  // Handle saving paragraph checkpoint
  const handleCreateCheckpoint = async (paragraphUnitId: string, currentVersionId: string) => {
    if (!workingSnapshot) return;
    const newText = draftEdits[paragraphUnitId];
    if (newText === undefined) return;

    try {
      setSavingParagraphId(paragraphUnitId);
      const note = changeNotes[paragraphUnitId] || 'Manual edit via Matrix Workspace';

      await createParagraphCheckpoint({
        snapshotId: workingSnapshot.id,
        paragraphUnitId,
        expectedCurrentVersionId: currentVersionId,
        newBodyMarkdown: newText,
        changeType: 'rewrite',
        changeNote: note,
      });

      // Clear draft buffer for this paragraph
      setDraftEdits(prev => {
        const next = { ...prev };
        delete next[paragraphUnitId];
        return next;
      });

      setStatusNotification({ msg: `Checkpoint created for paragraph!`, type: 'success' });
      // Reload scene data
      if (workingScene?.sceneUnit.id) {
        const refreshedWorkData = await getSceneWithParagraphs(workingSnapshot.id, workingScene.sceneUnit.id);
        setWorkingScene(refreshedWorkData);
      }
    } catch (err: any) {
      console.error(err);
      setStatusNotification({ msg: `Checkpoint failed: ${err.message}`, type: 'error' });
    } finally {
      setSavingParagraphId(null);
    }
  };

  // Handle restoring paragraph to baseline
  const handleRestoreToBaseline = (paragraphUnitId: string) => {
    const originalText = baselineParagraphMap.get(paragraphUnitId);
    if (originalText !== undefined) {
      setDraftEdits(prev => ({ ...prev, [paragraphUnitId]: originalText }));
      setStatusNotification({ msg: 'Restored text to baseline in draft buffer.', type: 'success' });
    }
  };

  // Handle saving Scene Matrix
  const handleSaveMatrix = async () => {
    if (!workingSnapshot || !workingScene) return;
    try {
      setSavingMatrix(true);
      await saveSceneMatrix({
        ...matrixState,
        snapshot_id: workingSnapshot.id,
        scene_unit_id: workingScene.sceneUnit.id,
      });
      setStatusNotification({ msg: 'Scene Matrix successfully saved!', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setStatusNotification({ msg: `Save Matrix failed: ${err.message}`, type: 'error' });
    } finally {
      setSavingMatrix(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0e] text-zinc-300 flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-amber-500/80 tracking-widest text-sm uppercase">Loading Matrix Workspace...</div>
        </div>
      </div>
    );
  }

  if (error || !project || !baselineSnapshot || !workingSnapshot || !workingScene) {
    return (
      <div className="min-h-screen bg-[#0a0a0e] text-zinc-300 flex items-center justify-center font-sans p-6">
        <div className="bg-zinc-900/80 border border-rose-500/30 p-8 rounded-2xl max-w-lg text-center shadow-2xl">
          <h2 className="text-rose-400 font-bold text-xl mb-3">Workspace Error</h2>
          <p className="text-zinc-400 text-sm mb-6">{error || 'Unknown initialization error.'}</p>
          <button
            onClick={() => router.reload()}
            className="px-5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-sm transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-200 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-100">
      <Head>
        <title>Matrix Workspace | {workingScene.sceneUnit.title || 'Scene Revision'}</title>
      </Head>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#0f1016]/95 backdrop-blur-md border-b border-zinc-800/80 px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Phase A Pilot
              </span>
              <h1 className="text-base font-bold text-zinc-100 tracking-tight">
                {workingScene.sceneUnit.title}
              </h1>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5 flex items-center gap-2">
              <span>UUID: <span className="text-zinc-300 select-all font-semibold">{workingScene.sceneUnit.id}</span></span>
              <span>•</span>
              <span>Path: <span className="text-zinc-400">{workingScene.sceneUnit.source_path}</span></span>
              <span>•</span>
              <span>Paragraphs: <span className="text-zinc-300">{workingScene.paragraphs.length}</span></span>
            </p>
          </div>
        </div>

        {/* Snapshot Badges & View Modes */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-zinc-800/70 border border-zinc-700 text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
              Baseline: <strong className="text-zinc-200">{baselineSnapshot.code}</strong> (LOCKED)
            </span>
            <span className="text-zinc-600">➔</span>
            <span className="px-2.5 py-1 rounded-md bg-amber-950/30 border border-amber-600/40 text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Working: <strong className="text-amber-200">{workingSnapshot.code}</strong> (DRAFT)
            </span>
          </div>

          <div className="h-5 w-px bg-zinc-800" />

          {/* View Mode Toggle */}
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'compare' ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Compare
            </button>
            <button
              onClick={() => setViewMode('audit')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'audit' ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Audit
            </button>
            <button
              onClick={() => setViewMode('focus')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'focus' ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Focus
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {statusNotification && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-2xl border text-sm flex items-center gap-3 animate-fade-in ${
          statusNotification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
        }`}>
          <span>{statusNotification.msg}</span>
          <button onClick={() => setStatusNotification(null)} className="text-zinc-400 hover:text-zinc-100 text-xs">✕</button>
        </div>
      )}

      {/* Main 3-Pane Matrix Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Baseline (v1.0 Read-only) */}
        {viewMode !== 'focus' && (
          <aside className={`${viewMode === 'compare' ? 'w-5/12' : 'w-4/12 hidden xl:block'} border-r border-zinc-800/70 overflow-y-auto p-6 bg-[#0a0b0e]`}>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">
                  Baseline Source ({baselineSnapshot.code})
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Read-Only
              </span>
            </div>

            <div className="space-y-6 font-serif text-sm leading-relaxed text-zinc-300">
              {baselineScene?.paragraphs.map((p, idx) => {
                const isDifferent = baselineParagraphMap.get(p.unit.id) !== workingScene.paragraphs.find(wp => wp.unit.id === p.unit.id)?.version.body_markdown;
                return (
                  <div
                    key={p.unit.id}
                    id={`base-${p.unit.id}`}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isDifferent ? 'bg-rose-950/10 border-rose-500/30' : 'bg-zinc-900/30 border-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 mb-2">
                      <span>#{String(idx + 1).padStart(3, '0')}</span>
                      <span>v{p.version.version_no} ({p.version.word_count} words)</span>
                    </div>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {p.version.body_markdown}
                    </ReactMarkdown>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center Pane: Working Draft (v1.1 Editor) */}
        <main className={`flex-1 overflow-y-auto p-6 bg-[#0e0f14] ${viewMode === 'focus' ? 'max-w-4xl mx-auto' : ''}`}>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold">
                Working Draft ({workingSnapshot.code})
              </h3>
            </div>
            <div className="text-xs font-mono text-zinc-500">
              Auto-diff enabled • Copy-on-Write
            </div>
          </div>

          <div className="space-y-6">
            {workingScene.paragraphs.map((p, idx) => {
              const currentText = draftEdits[p.unit.id] !== undefined ? draftEdits[p.unit.id] : p.version.body_markdown;
              const isModified = draftEdits[p.unit.id] !== undefined && draftEdits[p.unit.id] !== p.version.body_markdown;
              const baseText = baselineParagraphMap.get(p.unit.id);
              const differsFromBase = currentText !== baseText;

              return (
                <div
                  key={p.unit.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isModified
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-950/20'
                      : differsFromBase
                      ? 'bg-emerald-950/15 border-emerald-500/40'
                      : 'bg-zinc-900/40 border-zinc-800/60'
                  }`}
                >
                  {/* Paragraph Header */}
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 mb-2.5 pb-2 border-b border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-500/80">#{String(idx + 1).padStart(3, '0')}</span>
                      <span className="text-zinc-500">|</span>
                      <span className="text-zinc-400">Ver: v{p.version.version_no}</span>
                      {differsFromBase && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                          Modified vs v1.0
                        </span>
                      )}
                      {isModified && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-600/40 animate-pulse">
                          Unsaved Draft
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {differsFromBase && (
                        <button
                          onClick={() => handleRestoreToBaseline(p.unit.id)}
                          className="px-2 py-0.5 text-[10px] text-zinc-400 hover:text-rose-300 hover:bg-rose-950/30 rounded border border-zinc-700/50 transition-colors"
                        >
                          Revert to v1.0
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Paragraph Editor */}
                  <textarea
                    value={currentText}
                    onChange={(e) => setDraftEdits(prev => ({ ...prev, [p.unit.id]: e.target.value }))}
                    rows={Math.max(2, Math.ceil(currentText.length / 80))}
                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 text-zinc-200 font-serif text-sm leading-relaxed focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 resize-y"
                    placeholder="Enter paragraph text..."
                  />

                  {/* Live Rendered Markdown & Math Preview */}
                  <div className="mt-3 p-3 bg-[#08090c] rounded-lg border border-zinc-800/40 text-xs font-serif text-zinc-400 leading-relaxed">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Live KaTeX / Markdown Preview:</div>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {currentText}
                    </ReactMarkdown>
                  </div>

                  {/* Checkpoint Action Bar */}
                  {isModified && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-4 font-mono text-xs">
                      <input
                        type="text"
                        placeholder="Change note (e.g. tightened staccato, calibrated claim)..."
                        value={changeNotes[p.unit.id] || ''}
                        onChange={(e) => setChangeNotes(prev => ({ ...prev, [p.unit.id]: e.target.value }))}
                        className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
                      />
                      <button
                        onClick={() => handleCreateCheckpoint(p.unit.id, p.version.id)}
                        disabled={savingParagraphId === p.unit.id}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-md shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {savingParagraphId === p.unit.id ? 'Checkpointing...' : 'Create Checkpoint'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* Right Pane: Contextual Audit & Scene Matrix */}
        {viewMode !== 'focus' && (
          <aside className={`${viewMode === 'audit' ? 'w-5/12' : 'w-3/12 hidden lg:block'} border-l border-zinc-800/70 overflow-y-auto p-6 bg-[#0a0b0e]`}>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold">
                  Scene Matrix Audit
                </h3>
              </div>
              <button
                onClick={handleSaveMatrix}
                disabled={savingMatrix}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-md text-xs font-mono font-medium transition-all disabled:opacity-50"
              >
                {savingMatrix ? 'Saving...' : 'Save Matrix'}
              </button>
            </div>
            {/* Pass 1 Audit Run Badge & Proposal Banner */}
            {auditRun && (
              <div className="mb-5 p-3 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-amber-400 mb-1.5 pb-1 border-b border-amber-500/20">
                  <span className="font-bold uppercase tracking-wider">{auditRun.code}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">{auditRun.status}</span>
                </div>
                {structureProposal && (
                  <div className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Action:</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-bold border border-zinc-700">
                        {structureProposal.action}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Words:</span>
                      <span>
                        <strong className="text-zinc-200">{structureProposal.current_word_count}</strong> ➔ <strong className="text-emerald-400">{structureProposal.target_word_count}</strong>
                        <span className="text-zinc-500 text-[10px] ml-1">({structureProposal.projected_word_delta} w, -{structureProposal.target_compression_percent}%)</span>
                      </span>
                    </div>
                  </div>
                )}
                {chapterGate && (
                  <div className="mt-2.5 pt-2 border-t border-amber-500/20 font-sans text-[11px] text-zinc-400">
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 mb-1">
                      <span>Chapter Gate:</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/40 font-bold">
                        {chapterGate.verdict}
                      </span>
                    </div>
                    <p className="italic text-zinc-300 text-[10px] leading-tight">{chapterGate.verdict_notes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">POV / Focal Character</label>
                <input
                  type="text"
                  value={matrixState.pov_character || ''}
                  onChange={e => setMatrixState(s => ({ ...s, pov_character: e.target.value }))}
                  placeholder="e.g. Ian Yoo"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">Local Question</label>
                <textarea
                  value={matrixState.local_question || ''}
                  onChange={e => setMatrixState(s => ({ ...s, local_question: e.target.value }))}
                  rows={2}
                  placeholder="What question does this scene ask?"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-zinc-400 mb-1">Action</label>
                  <select
                    value={matrixState.action || 'Keep'}
                    onChange={e => setMatrixState(s => ({ ...s, action: e.target.value as SceneAction }))}
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                  >
                    <option value="Keep">Keep</option>
                    <option value="Compress">Compress</option>
                    <option value="Merge">Merge</option>
                    <option value="Reorder">Reorder</option>
                    <option value="Reframe">Reframe</option>
                    <option value="Rewrite">Rewrite</option>
                    <option value="Archive">Archive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-zinc-400 mb-1">Status</label>
                  <select
                    value={matrixState.status || 'Diagnosed'}
                    onChange={e => setMatrixState(s => ({ ...s, status: e.target.value as SceneStatus }))}
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                  >
                    <option value="Diagnosed">Diagnosed</option>
                    <option value="Structure Approved">Structure Approved</option>
                    <option value="Science Cleared">Science Cleared</option>
                    <option value="Rewrite Ready">Rewrite Ready</option>
                    <option value="Drafted">Drafted</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Locked">Locked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">Protected Status</label>
                <select
                  value={matrixState.protected_status || 'None'}
                  onChange={e => setMatrixState(s => ({ ...s, protected_status: e.target.value as ProtectedStatus }))}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                >
                  <option value="None">None</option>
                  <option value="Exact Text">Exact Text</option>
                  <option value="Semantic">Semantic</option>
                  <option value="Structural">Structural</option>
                  <option value="Canon">Canon</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">New Evidence (Observation)</label>
                <textarea
                  value={matrixState.new_evidence || ''}
                  onChange={e => setMatrixState(s => ({ ...s, new_evidence: e.target.value }))}
                  rows={2}
                  placeholder="e.g. Phase kinetic term leading cancellation..."
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">Model Movement</label>
                <textarea
                  value={matrixState.model_movement || ''}
                  onChange={e => setMatrixState(s => ({ ...s, model_movement: e.target.value }))}
                  rows={2}
                  placeholder="Which model strengthens or weakens?"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">Capability & Constraint</label>
                <textarea
                  value={matrixState.capability || ''}
                  onChange={e => setMatrixState(s => ({ ...s, capability: e.target.value }))}
                  rows={2}
                  placeholder="New capability & material constraint..."
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">Character Decision & Power Shift</label>
                <textarea
                  value={matrixState.character_decision || ''}
                  onChange={e => setMatrixState(s => ({ ...s, character_decision: e.target.value }))}
                  rows={2}
                  placeholder="Who decides what? Where does authority move?"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">Final Consequence & Next Problem</label>
                <textarea
                  value={matrixState.final_consequence || ''}
                  onChange={e => setMatrixState(s => ({ ...s, final_consequence: e.target.value }))}
                  rows={2}
                  placeholder="Measurable consequence and next problem..."
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">Audit Notes</label>
                <textarea
                  value={matrixState.notes || ''}
                  onChange={e => setMatrixState(s => ({ ...s, notes: e.target.value }))}
                  rows={3}
                  placeholder="Pass 1 diagnosis and editorial notes..."
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
