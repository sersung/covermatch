import { createServerClient } from "@supabase/ssr"
import { auth } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import { type Database } from "@/lib/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder_key"

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const { getToken } = await auth()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await getToken({ template: "supabase" })
          const headers = new Headers(options?.headers)
          if (clerkToken) {
            headers.set("Authorization", `Bearer ${clerkToken}`)
          }
          return fetch(url, { ...options, headers })
        },
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — ignorar
          }
        },
      },
    }
  )
}

export async function createAnonSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
