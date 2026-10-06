// UI session boundary only. Database/RPC authorization remains authoritative.
// Auth callbacks never await another auth call (the SDK holds its session lock).
export function createReaderSessionController({ auth, onChange, clearPrivateState, schedule = (fn) => setTimeout(fn, 0) }) {
  let epoch = 0
  let disposed = false
  let signingOut = false
  let started = false
  let subscription
  let state = { status: 'checking', user: null, epoch }

  const publish = (status, user = null) => {
    if (disposed) return
    state = { status, user, epoch }
    onChange(state)
  }
  const mask = (status) => {
    epoch += 1
    publish(status)
    clearPrivateState()
    return epoch
  }
  const verifyAt = async (requestEpoch, expectedId) => {
    try {
      const { data, error } = await auth.getUser()
      if (disposed || signingOut || requestEpoch !== epoch) return
      if (error) {
        publish(error.name === 'AuthSessionMissingError' ? 'signed-out' : 'error')
        return
      }
      const user = data?.user
      if (!user?.id || user.is_anonymous) {
        publish('signed-out')
      } else if (expectedId && user.id !== expectedId) {
        // Never use a late response for a different account's Reader.
        publish('error')
      } else {
        publish('ready', { id: user.id, email: user.email || '' })
      }
    } catch {
      if (!disposed && !signingOut && requestEpoch === epoch) publish('error')
    }
  }
  const verify = () => {
    if (disposed || signingOut) return Promise.resolve()
    return verifyAt(mask('checking'))
  }
  const onAuthChange = (event, session) => {
    if (disposed || signingOut) return
    const user = session?.user
    if (event === 'SIGNED_OUT' || !user?.id || user.is_anonymous) {
      mask('signed-out')
      return
    }
    // Token refresh / tab focus must not discard this account's open edits.
    if (state.status === 'ready' && state.user?.id === user.id) return
    const requestEpoch = mask('checking')
    schedule(() => {
      if (!disposed && !signingOut && requestEpoch === epoch) void verifyAt(requestEpoch, user.id)
    })
  }
  return {
    start() {
      if (started || disposed) return
      started = true
      subscription = auth.onAuthStateChange(onAuthChange).data.subscription
      void verify()
    },
    verify,
    async signOut() {
      if (disposed || signingOut) return false
      signingOut = true
      mask('signing-out') // Unmount the manuscript/editor before the network await.
      try {
        const { error } = await auth.signOut({ scope: 'local' })
        if (disposed) return false
        signingOut = false
        if (error) {
          publish('error') // No success redirect, stale manuscript, or raw error/token.
          return false
        }
        mask('signed-out')
        return true
      } catch {
        if (!disposed) {
          signingOut = false
          publish('error')
        }
        return false
      }
    },
    dispose() {
      disposed = true
      epoch += 1
      subscription?.unsubscribe()
    },
  }
}
