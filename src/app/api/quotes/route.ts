import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("saved_quotes")
    .select("*, insurance_segments(name, slug, icon)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { segmentId, inputData, resultSnapshot, label } = body

  if (!segmentId || !inputData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("saved_quotes")
    .insert({
      user_id: userId as string,
      segment_id: segmentId as string,
      input_data: inputData as import("@/lib/types/database").Json,
      result_snapshot: (resultSnapshot ?? null) as import("@/lib/types/database").Json | null,
      label: (label ?? null) as string | null,
      is_paid: false,
      stripe_session_id: null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
