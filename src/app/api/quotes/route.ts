import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const quotes = await prisma.savedQuote.findMany({
    where: { userId: session.user.id },
    include: { segment: { select: { name: true, slug: true, icon: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(quotes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { segmentId, inputData, resultSnapshot, label } = await req.json()
  if (!segmentId || !inputData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const quote = await prisma.savedQuote.create({
    data: {
      userId: session.user.id,
      segmentId,
      inputData,
      resultSnapshot: resultSnapshot ?? null,
      label: label ?? null,
    },
  })

  return NextResponse.json(quote, { status: 201 })
}
