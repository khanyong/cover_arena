import assert from 'node:assert/strict';
import test from 'node:test';
import { createReaderSessionController } from '../../shared/lib/readerSession.js';

// Pure synthetic fixtures: no real accounts, tokens, network, or manuscript.
const userA = { id: '00000000-0000-4000-8000-000000000001', email: 'reader-a@example.test' };
const userB = { id: '00000000-0000-4000-8000-000000000002', email: 'reader-b@example.test' };
const response = (user, error = null) => ({ data: { user }, error });
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const settle = async () => {
  // Drain Promise continuations without wall-clock sleeps or real auth timers.
  for (let index = 0; index < 8; index += 1) await Promise.resolve();
};

function fixture(t) {
  const states = [];
  const clears = [];
  const calls = [];
  const verifications = [];
  const logouts = [];
  const scheduled = [];
  let callback;
  let inAuthCallback = false;
  let unsubscribeCount = 0;
  const auth = {
    getUser() {
      assert.equal(inAuthCallback, false, 'getUser must not execute inside the auth callback');
      const pending = deferred();
      verifications.push(pending);
      calls.push({ type: 'get-user' });
      return pending.promise;
    },
    onAuthStateChange(handler) {
      callback = handler;
      calls.push({ type: 'subscribe' });
      return { data: { subscription: { unsubscribe() { unsubscribeCount += 1; } } } };
    },
    signOut(options) {
      const pending = deferred();
      logouts.push(pending);
      calls.push({ type: 'sign-out', options });
      return pending.promise;
    },
  };
  const controller = createReaderSessionController({
    auth,
    onChange(snapshot) {
      assert.ok(['checking', 'ready', 'signed-out', 'signing-out', 'error'].includes(snapshot.status));
      assert.ok(Number.isInteger(snapshot.epoch) && snapshot.epoch >= 0);
      assert.ok(snapshot.user === null || (typeof snapshot.user.id === 'string' && snapshot.user.id.length > 0));
      const state = { ...snapshot, user: snapshot.user ? { ...snapshot.user } : null };
      states.push(state);
      calls.push({ type: 'state', state });
    },
    clearPrivateState() {
      clears.push(calls.length);
      calls.push({ type: 'clear' });
    },
    schedule(task) {
      scheduled.push(task);
      return scheduled.length;
    },
  });
  t.after(() => controller.dispose());
  return {
    controller, states, clears, calls, verifications, logouts, scheduled,
    get state() { return states.at(-1); },
    get unsubscribeCount() { return unsubscribeCount; },
    emit(event, user = null) {
      assert.equal(typeof callback, 'function', 'start must subscribe to auth changes');
      const before = verifications.length;
      inAuthCallback = true;
      try { callback(event, user ? { user } : null); } finally { inAuthCallback = false; }
      assert.equal(verifications.length, before, 'auth callback must defer verification');
    },
    runScheduled() {
      const tasks = scheduled.splice(0);
      for (const task of tasks) task();
    },
  };
}

async function ready(t, user = userA) {
  const f = fixture(t);
  f.controller.start();
  await settle();
  assert.equal(f.verifications.length, 1);
  f.verifications[0].resolve(response(user));
  await settle();
  assert.equal(f.state.status, 'ready');
  assert.deepEqual(f.state.user, user);
  return f;
}

test('start masks the reader until getUser verifies the identity and subscribes to changes', async (t) => {
  const f = fixture(t);
  f.controller.start();
  await settle();
  assert.equal(f.state.status, 'checking');
  assert.equal(f.state.user, null);
  assert.equal(f.calls.filter((call) => call.type === 'subscribe').length, 1);
  assert.equal(f.verifications.length, 1);
  f.verifications[0].resolve(response(userA));
  await settle();
  assert.equal(f.state.status, 'ready');
  assert.deepEqual(f.state.user, userA);
  assert.ok(f.clears.length > 0, 'first verified identity must clear any old private state');
});

test('a missing user remains signed out', async (t) => {
  const f = fixture(t);
  f.controller.start();
  f.verifications[0].resolve(response(null));
  await settle();
  assert.equal(f.state.status, 'signed-out');
  assert.equal(f.state.user, null);
  assert.equal(f.states.some((state) => state.status === 'ready'), false);
});

test('Supabase anonymous users cannot open the reader even when they have an id and email', async (t) => {
  const f = fixture(t);
  f.controller.start();
  f.verifications[0].resolve(response({ ...userA, is_anonymous: true }));
  await settle();
  assert.ok(['signed-out', 'error'].includes(f.state.status));
  assert.equal(f.state.user, null);
  assert.equal(f.states.some((state) => state.status === 'ready'), false);
});

test('verification errors fail closed even if the response also contains a user', async (t) => {
  const f = await ready(t);
  const previousEpoch = f.state.epoch;
  const clearCount = f.clears.length;
  f.controller.verify();
  f.verifications.at(-1).resolve(response(userA, new Error('synthetic verification error')));
  await settle();
  assert.equal(f.state.status, 'error');
  assert.equal(f.state.user, null);
  assert.ok(f.clears.length > clearCount);
  assert.ok(f.state.epoch > previousEpoch);
});

test('a rejected getUser promise fails closed without an unhandled rejection', async (t) => {
  const f = fixture(t);
  f.controller.start();
  f.verifications[0].reject(new Error('synthetic transport failure'));
  await settle();
  assert.equal(f.state.status, 'error');
  assert.equal(f.state.user, null);
});

test('every same-user TOKEN_REFRESHED keeps the editor ready without clearing or advancing its epoch', async (t) => {
  const f = await ready(t);
  const epoch = f.state.epoch;
  const clearCount = f.clears.length;
  const stateOffset = f.states.length;
  for (let refresh = 0; refresh < 3; refresh += 1) {
    const previousRequests = f.verifications.length;
    f.emit('TOKEN_REFRESHED', { ...userA });
    assert.equal(f.state.status, 'ready');
    f.runScheduled();
    assert.equal(f.state.status, 'ready');
    // A controller may reuse the verified identity or recheck it in the
    // background; neither strategy may unmount this account's open editor.
    for (const request of f.verifications.slice(previousRequests)) request.resolve(response({ ...userA }));
    await settle();
    assert.equal(f.state.epoch, epoch);
    assert.equal(f.clears.length, clearCount);
  }
  assert.equal(f.state.status, 'ready');
  assert.equal(f.state.epoch, epoch);
  assert.equal(f.clears.length, clearCount);
  assert.ok(f.states.slice(stateOffset).every((state) => state.status === 'ready' && state.user?.id === userA.id));
});

test('a missing-session error cannot authenticate a cached user returned alongside it', async (t) => {
  const f = fixture(t);
  f.controller.start();
  const error = new Error('synthetic missing session');
  error.name = 'AuthSessionMissingError';
  f.verifications[0].resolve(response(userA, error));
  await settle();
  assert.ok(['signed-out', 'error'].includes(f.state.status));
  assert.equal(f.state.user, null);
  assert.equal(f.states.some((state) => state.status === 'ready'), false);
});

test('a different account masks and clears private state before deferred verification', async (t) => {
  const f = await ready(t);
  const epoch = f.state.epoch;
  const clearCount = f.clears.length;
  const callOffset = f.calls.length;
  f.emit('SIGNED_IN', userB);
  assert.notEqual(f.state.status, 'ready');
  assert.equal(f.state.user, null);
  assert.ok(f.state.epoch > epoch);
  assert.ok(f.clears.length > clearCount);
  f.runScheduled();
  f.verifications.at(-1).resolve(response(userB));
  await settle();
  assert.equal(f.state.status, 'ready');
  assert.deepEqual(f.state.user, userB);
  const calls = f.calls.slice(callOffset);
  assert.ok(calls.findIndex((call) => call.type === 'clear') < calls.findIndex((call) => call.type === 'state' && call.state.status === 'ready'));
});

test('a pending initial getUser cannot expose the previous account after a new-account event', async (t) => {
  const f = fixture(t);
  f.controller.start();
  f.emit('SIGNED_IN', userB);
  f.verifications[0].resolve(response(userA));
  await settle();
  assert.equal(f.states.some((state) => state.status === 'ready' && state.user?.id === userA.id), false);
  f.runScheduled();
  f.verifications.at(-1).resolve(response(userB));
  await settle();
  assert.equal(f.state.status, 'ready');
  assert.deepEqual(f.state.user, userB);
});

test('getUser must match the new account hint before that account can open the reader', async (t) => {
  const f = await ready(t);
  f.emit('SIGNED_IN', userB);
  f.runScheduled();
  f.verifications.at(-1).resolve(response(userA));
  await settle();
  assert.equal(f.state.status, 'error');
  assert.equal(f.state.user, null);
});

test('the latest verification wins when overlapping getUser calls resolve out of order', async (t) => {
  const f = fixture(t);
  f.controller.start();
  f.controller.verify();
  assert.equal(f.verifications.length, 2);
  f.verifications[1].resolve(response(userB));
  await settle();
  const snapshot = { ...f.state, user: { ...f.state.user } };
  const clearCount = f.clears.length;
  f.verifications[0].resolve(response(userA));
  await settle();
  assert.equal(f.state.status, 'ready');
  assert.deepEqual(f.state, snapshot);
  assert.deepEqual(f.state.user, userB);
  assert.equal(f.clears.length, clearCount);
});

test('SIGNED_OUT clears immediately and invalidates a pending verification', async (t) => {
  const f = await ready(t);
  const epoch = f.state.epoch;
  const clearCount = f.clears.length;
  f.controller.verify();
  const pending = f.verifications.at(-1);
  f.emit('SIGNED_OUT');
  assert.equal(f.state.status, 'signed-out');
  assert.equal(f.state.user, null);
  assert.ok(f.state.epoch > epoch);
  assert.ok(f.clears.length > clearCount);
  const stateOffset = f.states.length;
  pending.resolve(response(userA));
  await settle();
  f.runScheduled();
  await settle();
  assert.equal(f.state.status, 'signed-out');
  assert.equal(f.states.slice(stateOffset).some((state) => state.status === 'ready'), false);
});

test('an account change discovered by getUser also clears the previous account state', async (t) => {
  const f = await ready(t);
  const epoch = f.state.epoch;
  const clearCount = f.clears.length;
  f.controller.verify();
  f.verifications.at(-1).resolve(response(userB));
  await settle();
  assert.deepEqual(f.state.user, userB);
  assert.equal(f.state.status, 'ready');
  assert.ok(f.state.epoch > epoch);
  assert.ok(f.clears.length > clearCount);
});

test('signOut masks and clears synchronously before awaiting a local-scope logout', async (t) => {
  const f = await ready(t);
  const epoch = f.state.epoch;
  const clearCount = f.clears.length;
  const callOffset = f.calls.length;
  const result = f.controller.signOut();
  assert.equal(f.state.status, 'signing-out');
  assert.equal(f.state.user, null);
  assert.ok(f.state.epoch > epoch);
  assert.ok(f.clears.length > clearCount);
  assert.equal(f.logouts.length, 1);
  const calls = f.calls.slice(callOffset);
  const logoutIndex = calls.findIndex((call) => call.type === 'sign-out');
  assert.ok(calls.findIndex((call) => call.type === 'clear') < logoutIndex);
  assert.ok(calls.findIndex((call) => call.type === 'state' && call.state.status === 'signing-out') < logoutIndex);
  assert.deepEqual(calls[logoutIndex].options, { scope: 'local' });
  f.logouts[0].resolve({ error: null });
  assert.equal(await result, true);
  assert.equal(f.state.status, 'signed-out');
  assert.equal(f.state.user, null);
});

test('concurrent signOut attempts return false and send only one auth request', async (t) => {
  const f = await ready(t);
  const first = f.controller.signOut();
  assert.equal(await f.controller.signOut(), false);
  assert.equal(f.logouts.length, 1);
  assert.equal(f.state.status, 'signing-out');
  assert.equal(f.state.user, null);
  f.logouts[0].resolve({ error: null });
  assert.equal(await first, true);
});

test('a logout error never restores ready state or the former user', async (t) => {
  const f = await ready(t);
  const result = f.controller.signOut();
  f.logouts[0].resolve({ error: new Error('synthetic logout refusal') });
  assert.equal(await result, false);
  assert.equal(f.state.status, 'error');
  assert.equal(f.state.user, null);
});

test('a rejected logout promise fails closed and returns false', async (t) => {
  const f = await ready(t);
  const result = f.controller.signOut();
  f.logouts[0].reject(new Error('synthetic logout transport failure'));
  assert.equal(await result, false);
  assert.equal(f.state.status, 'error');
  assert.equal(f.state.user, null);
});

test('a failed logout can be retried without showing cached private state', async (t) => {
  const f = await ready(t);
  const first = f.controller.signOut();
  f.logouts[0].resolve({ error: new Error('synthetic failure') });
  assert.equal(await first, false);
  const retry = f.controller.signOut();
  assert.equal(f.state.status, 'signing-out');
  assert.equal(f.state.user, null);
  assert.equal(f.logouts.length, 2);
  f.logouts[1].resolve({ error: null });
  assert.equal(await retry, true);
  assert.equal(f.state.status, 'signed-out');
});

test('a getUser response arriving after logout began cannot reopen the reader', async (t) => {
  const f = await ready(t);
  f.controller.verify();
  const verification = f.verifications.at(-1);
  const result = f.controller.signOut();
  const offset = f.states.length;
  verification.resolve(response(userA));
  await settle();
  assert.equal(f.state.status, 'signing-out');
  assert.equal(f.state.user, null);
  assert.equal(f.states.slice(offset).some((state) => state.status === 'ready'), false);
  f.logouts[0].resolve({ error: null });
  assert.equal(await result, true);
  assert.equal(f.state.status, 'signed-out');
});

test('deferred account verification queued before logout cannot run after logout completes', async (t) => {
  const f = await ready(t);
  f.emit('SIGNED_IN', userB);
  const requestsBeforeLogout = f.verifications.length;
  const result = f.controller.signOut();
  f.logouts[0].resolve({ error: null });
  assert.equal(await result, true);
  f.runScheduled();
  await settle();
  assert.equal(f.verifications.length, requestsBeforeLogout);
  assert.equal(f.state.status, 'signed-out');
  assert.equal(f.state.user, null);
});

test('dispose unsubscribes and suppresses late verification and auth-event updates', async (t) => {
  const f = fixture(t);
  f.controller.start();
  f.controller.dispose();
  const stateCount = f.states.length;
  const clearCount = f.clears.length;
  assert.equal(f.unsubscribeCount, 1);
  f.verifications[0].resolve(response(userA));
  f.emit('SIGNED_IN', userB);
  f.runScheduled();
  await settle();
  assert.equal(f.states.length, stateCount);
  assert.equal(f.clears.length, clearCount);
  assert.equal(f.verifications.length, 1);
  assert.equal(await f.controller.signOut(), false);
  assert.equal(f.logouts.length, 0);
});

test('dispose makes an in-flight logout return false without publishing its completion', async (t) => {
  const f = await ready(t);
  const result = f.controller.signOut();
  f.controller.dispose();
  const stateCount = f.states.length;
  f.logouts[0].resolve({ error: null });
  assert.equal(await result, false);
  assert.equal(f.states.length, stateCount);
  assert.equal(f.unsubscribeCount, 1);
});
