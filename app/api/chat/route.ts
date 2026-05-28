import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSessionById, addMessageToSession, formatHistoryForAI } from "@/lib/sessions"
import { generateChatResponse, analyzeImage, cleanMarkdown } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const user = await auth()
    if (!user?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, message, imageBase64, model } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const session = await getSessionById(sessionId, user.user.id)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    let userMessage = message || ""
    let aiResponse = ""

    if (imageBase64) {
      const prompt = message || "Deskripsikan gambar ini dalam bahasa Indonesia."
      aiResponse = await analyzeImage(imageBase64, prompt)
      userMessage = message ? `[Gambar] ${message}` : "[Gambar] Deskripsikan gambar ini"
    } else if (message && message.trim()) {
      const history = formatHistoryForAI(session.messages as any)
      aiResponse = await generateChatResponse(message, history, model)
      userMessage = message
    } else {
      return NextResponse.json({ error: "Message or image required" }, { status: 400 })
    }

    aiResponse = cleanMarkdown(aiResponse)

    await addMessageToSession(sessionId, user.user.id, { role: "user", content: userMessage, imageData: imageBase64 })
    await addMessageToSession(sessionId, user.user.id, { role: "assistant", content: aiResponse })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
