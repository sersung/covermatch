import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const quotes = await prisma.savedQuote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { segment: { select: { id: true, name: true, slug: true, icon: true } } },
  })

  return NextResponse.json(quotes)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { segmentId, inputData, resultSnapshot, label } = body as {
    segmentId?: string
    inputData?: unknown
    resultSnapshot?: unknown
    label?: string
  }

  if (!segmentId || !inputData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const quote = await prisma.savedQuote.create({
    data: {
      userId: session.user.id,
      segmentId,
      inputData: inputData as object,
      resultSnapshot: resultSnapshot !== undefined ? resultSnapshot as object : undefined,
      label: label ?? null,
    },
  })

  return NextResponse.json(quote, { status: 201 })
}
