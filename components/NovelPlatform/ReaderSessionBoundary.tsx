import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../shared/lib/supabase';
import { getSafeAuthReturnPath } from '../../shared/lib/authReturnPath';
import { createReaderSessionController } from '../../shared/lib/readerSession';

type ReaderUser = { id: string; email: string };
type SessionState = {
  status: 'checking' | 'ready' | 'signed-out' | 'signing-out' | 'error';
  user: ReaderUser | null;
  epoch: number;
};
const AccountContext = createContext<{ user: ReaderUser; leave: (switchAccount: boolean) => void } | null>(null);

export function ReaderAccountControls() {
  const account = useContext(AccountContext);
  if (!account) return null;
  return (
    <nav aria-label="Reader 계정" className="flex flex-wrap items-center justify-end gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-200">
      <span className="mr-auto break-all" aria-label="현재 로그인 계정">로그인: {account.user.email || '이메일 미등록 계정'}</span>
      <button type="button" onClick={() => account.leave(false)} className="rounded border border-zinc-600 px-3 py-1.5 hover:bg-zinc-800">로그아웃</button>
      <button type="button" onClick={() => account.leave(true)} className="rounded bg-amber-500 px-3 py-1.5 font-semibold text-zinc-950 hover:bg-amber-400">다른 계정으로 로그인</button>
    </nav>
  );
}

// All Reader hooks, open dialogs and in-memory comparisons live below this key.
// A new authenticated identity never reuses the previous Reader component tree.
export function ReaderSessionBoundary({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>({ status: 'checking', user: null, epoch: 0 });
  const controller = useRef<ReturnType<typeof createReaderSessionController> | null>(null);
  const queryClient = useQueryClient();
  const loginUrl = () => {
    const current = window.location.pathname + window.location.search + window.location.hash;
    const next = getSafeAuthReturnPath(current);
    return `/auth?next=${encodeURIComponent(next)}`;
  };

  useEffect(() => {
    const instance = createReaderSessionController({
      auth: supabase.auth,
      onChange: (state) => setSession(state as SessionState),
      clearPrivateState: () => queryClient.clear(),
    });
    controller.current = instance;
    instance.start();
    // Recheck a restored page; don't revive a cached authenticated Reader on Back.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => {
      controller.current = null;
      instance.dispose();
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [queryClient]);

  const leave = async (switchAccount: boolean) => {
    if (!window.confirm('저장하지 않은 편집 내용은 사라집니다. 저장 중인 작업이 있다면 완료 후 진행해 주세요. 현재 브라우저에서 로그아웃하시겠습니까?')) return;
    const destination = loginUrl();
    const success = await controller.current?.signOut();
    if (success && switchAccount) window.location.replace(destination);
  };

  if (session.status === 'ready' && session.user) {
    return (
      <AccountContext.Provider value={{ user: session.user, leave }}>
        <React.Fragment key={`${session.user.id}:${session.epoch}`}>{children}</React.Fragment>
      </AccountContext.Provider>
    );
  }

  const busy = session.status === 'checking' || session.status === 'signing-out';
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100" data-reader-session-state={session.status}>
      <section className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-center">
        <h1 className="mb-3 text-xl font-bold">Reader 계정</h1>
        <p role={session.status === 'error' ? 'alert' : 'status'} aria-live="polite">
          {session.status === 'checking' ? '로그인 상태를 확인하고 있습니다.'
            : session.status === 'signing-out' ? '로그아웃 중입니다.'
              : session.status === 'error' ? '계정 확인 또는 로그아웃을 완료하지 못했습니다. 안전을 위해 원고를 숨겼습니다.'
                : '로그아웃 상태입니다. 로그인하면 Reader로 돌아옵니다.'}
        </p>
        {!busy && (
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {session.status === 'error' ? (
              <>
                <button type="button" onClick={() => controller.current?.verify()} className="rounded border border-zinc-500 px-4 py-2">다시 확인</button>
                <button type="button" onClick={() => leave(true)} className="rounded bg-amber-500 px-4 py-2 font-semibold text-zinc-950">로그아웃 재시도</button>
              </>
            ) : (
              <button type="button" onClick={() => window.location.replace(loginUrl())} className="rounded bg-amber-500 px-4 py-2 font-semibold text-zinc-950">로그인 / 다른 계정으로 로그인</button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
