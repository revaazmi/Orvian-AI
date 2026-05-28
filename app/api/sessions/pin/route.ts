import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { pinSession } from "@/lib/sessions"

export async function POST(request: NextRequest) {
  try {
    const user = await auth()
    if (!user?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, isPinned } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const success = await pinSession(id, user.user.id, isPinned)
    if (success) return NextResponse.json({ success: true })
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
