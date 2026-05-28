import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getAllSessions, createNewSession, deleteSession } from "@/lib/sessions"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessions = await getAllSessions(session.user.id)
  return NextResponse.json({ sessions, activeSessionId: sessions[0]?.id || null })
}

export async function POST() {
  const user = await auth()
  if (!user?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const newSession = await createNewSession(user.user.id)
  const sessions = await getAllSessions(user.user.id)
  return NextResponse.json({
    sessions,
    activeSessionId: newSession.id,
  })
}

export async function DELETE(request: NextRequest) {
  const user = await auth()
  if (!user?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get("id")
  if (id) {
    await deleteSession(id, user.user.id)
  }

  const sessions = await getAllSessions(user.user.id)
  return NextResponse.json({
    sessions,
    activeSessionId: sessions[0]?.id || null,
  })
}
