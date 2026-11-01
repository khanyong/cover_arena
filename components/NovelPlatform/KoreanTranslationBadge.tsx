import React, { useEffect, useState } from 'react';
import { reviewBadgeText } from '../../lib/novel-local-review/badgeStatus.mjs';
import type { NovelScene } from './novelData';
import { supabase, novels } from '../../shared/lib/supabase';

interface KoreanTranslationBadgeProps {
  novelSlug: string;
  actNumber: number;
  scene: NovelScene;
  customVersionMap: Record<string, string>;
}

// Share the authenticated list request between the contents and Reader badges.
const refreshedEvents = new WeakSet<Event>();
let draftRequest: { token: string; expires: number; promise: Promise<any[]> } | undefined;
async function drafts(token: string) {
  if (process.env.NODE_ENV !== 'development' || !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) return [];
  if (!draftRequest || draftRequest.token !== token || draftRequest.expires < Date.now()) {
    draftRequest = { token, expires: Date.now() + 15000, promise: fetch('/api/novel-local-review?list=1', {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
    }).then(async response => {
      if (!response.ok) throw new Error('검토판 목록 조회 실패');
      return (await response.json()).reviews || [];
    }) };
  }
  return draftRequest.promise;
}

let counterpartRequest: { token: string; expires: number; promise: Promise<any> } | undefined;
async function counterpart(token: string) {
  if (!counterpartRequest || counterpartRequest.token !== token || counterpartRequest.expires < Date.now()) {
    counterpartRequest = { token, expires: Date.now() + 60000, promise: novels.getNovelBySlug('quantum-vibration-novel') };
  }
  const { data, error } = await counterpartRequest.promise;
  if (error || !data) throw new Error('대응 장면 조회 실패');
  return data;
}

export function KoreanTranslationBadge({ scene, novelSlug }: KoreanTranslationBadgeProps) {
  const [badge, setBadge] = useState<{ sceneId: string; text: string } | null>(null);
  const managedId = scene.managedSceneId;
  useEffect(() => {
    let active = true;
    let generation = 0;
    setBadge(null);
    if (!managedId && novelSlug !== 'quantum-vibration-novel-en') return;
    const load = async () => {
      const requestGeneration = ++generation;
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      let resolvedId = managedId;
      if (!resolvedId) {
        const korean = await counterpart(data.session.access_token);
        const matches = korean.acts.flatMap(a => a.chapters.flatMap(c => c.scenes)).filter(s => s.id === scene.id);
        if (matches.length !== 1 || !matches[0].managedSceneId) return;
        resolvedId = matches[0].managedSceneId;
      }
      const list = await drafts(data.session.access_token).catch(() => []);
      const draft = list.find(item => item.managedSceneId === resolvedId);
      let text = '';
      if (draft) text = reviewBadgeText(draft);
      else {
        const { data: history, error } = await supabase.rpc('ros_bilingual_revision_history', { p_managed_scene_id: resolvedId });
        if (error) return;
        const publication = history?.find(item => item.current);
        if (publication) text = `수정본 r${publication.revision} · 게시`;
      }
      if (active && requestGeneration === generation && text) setBadge({ sceneId: scene.id, text });
    };
    const refresh = (event: Event) => { if (!refreshedEvents.has(event)) { refreshedEvents.add(event); draftRequest = undefined; } void load().catch(() => {}); };
    window.addEventListener('ros-review-updated', refresh);
    window.addEventListener('focus', refresh);
    void load().catch(() => {});
    const { data: listener } = supabase.auth.onAuthStateChange((event) => { if (active && event === 'SIGNED_OUT') setBadge(null); });
    return () => { active = false; window.removeEventListener('ros-review-updated', refresh); window.removeEventListener('focus', refresh); listener.subscription.unsubscribe(); };
  }, [managedId, scene.id, novelSlug]);
  if (!badge || badge.sceneId !== scene.id) return null;
  return <span data-scene-comparison-badge={scene.id}
    className="mr-1 inline-block whitespace-nowrap rounded border border-sky-500/40 bg-sky-500/10 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-sky-300"
    title="수정 전후 비교 데이터가 있는 장면입니다. 수정 전후 비교 버튼으로 확인하세요.">
    [{badge.text}]
  </span>;
}
