import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSessionById } from "@/lib/sessions"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await auth()
  if (!user?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const session = await getSessionById(id, user.user.id)

  if (!session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    activeSessionId: id,
    session,
  })
}
