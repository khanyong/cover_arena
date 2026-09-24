import { createClient } from '@supabase/supabase-js'

type AuthUser = { id: string; is_anonymous?: boolean }
type AuthResponse = { data: { user: AuthUser | null }; error: unknown }
type AuthConfig = { url: string; key: string }
type AuthEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
}

export type EquityReportAuthorization =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 503 }

type AuthDependencies = {
  env?: AuthEnvironment
  verifyUser?: (token: string, config: AuthConfig) => Promise<AuthResponse>
}

function publicKey(key: string) {
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) return true
  // Only use the legacy anon role. Never fall back to a service-role key.
  try {
    const parts = key.split('.')
    return parts.length === 3 && JSON.parse(Buffer.from(parts[1], 'base64url').toString()).role === 'anon'
  } catch {
    return false
  }
}

function authConfig(env: AuthEnvironment): AuthConfig | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim()
  if (!url || !key || !publicKey(key)) return null
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) return null
    return { url, key }
  } catch {
    return null
  }
}

async function verifyUser(token: string, config: AuthConfig): Promise<AuthResponse> {
  // A new client per request prevents one caller's session leaking to another.
  const client = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: async (input, init) => {
        try {
          return await fetch(input, { ...init, signal: AbortSignal.timeout(10_000) })
        } catch {
          // The SDK logs thrown fetch errors. Return a generic failure instead,
          // so request objects, headers, and tokens cannot enter error logs.
          return new Response('{"message":"Authentication unavailable"}', {
            status: 503, headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  })
  return client.auth.getUser(token)
}

function failureStatus(error: unknown): 401 | 503 {
  if (!error || typeof error !== 'object') return 503
  const value = error as { status?: number; name?: string; code?: string; message?: string }
  if (value.code === 'invalid_api_key' || /invalid api key/i.test(value.message || '')) return 503
  if (value.name === 'AuthRetryableFetchError') return 503
  return [400, 401, 403, 404, 422].includes(value.status || 0) ? 401 : 503
}

/** The injectable verifier is for isolated tests; HTTP callers cannot supply it. */
export async function authorizeEquityReport(
  authorization: string | string[] | undefined,
  dependencies: AuthDependencies = {},
): Promise<EquityReportAuthorization> {
  if (typeof authorization !== 'string' || authorization.length > 16_384) return { ok: false, status: 401 }
  const match = /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i.exec(authorization)
  if (!match) return { ok: false, status: 401 }
  const config = authConfig(dependencies.env || {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })
  if (!config) return { ok: false, status: 503 }

  try {
    const result = await (dependencies.verifyUser || verifyUser)(match[1], config)
    if (result.error) return { ok: false, status: failureStatus(result.error) }
    const user = result.data?.user
    if (!user || typeof user.id !== 'string' || !user.id.trim() || user.is_anonymous === true) {
      return { ok: false, status: 401 }
    }
    return { ok: true, userId: user.id }
  } catch {
    return { ok: false, status: 503 }
  }
}
