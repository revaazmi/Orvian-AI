import prisma from "@/lib/db"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  imageData?: string | null
}

export async function createNewSession(userId: string) {
  const count = await prisma.chatSession.count({ where: { userId } })
  const session = await prisma.chatSession.create({
    data: {
      title: `Chat Baru ${count + 1}`,
      userId,
    },
    include: { messages: true },
  })
  return session
}

export async function getAllSessions(userId: string) {
  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    orderBy: [
      { isPinned: "desc" },
      { updatedAt: "desc" },
    ],
    include: { messages: true },
  })
  return sessions
}

export async function getSessionById(id: string, userId: string) {
  const session = await prisma.chatSession.findFirst({
    where: { id, userId },
    include: { messages: true },
  })
  return session
}

export async function addMessageToSession(
  sessionId: string,
  userId: string,
  message: { role: string; content: string; imageData?: string }
) {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  })
  if (!session) return null

  const msgCount = await prisma.message.count({
    where: { sessionId },
  })

  const newMessage = await prisma.message.create({
    data: {
      sessionId,
      role: message.role,
      content: message.content,
      imageData: message.imageData,
    },
  })

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  })

  if (msgCount === 0 && message.role === "user") {
    const title =
      message.content.slice(0, 30) +
      (message.content.length > 30 ? "..." : "")
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title },
    })
  }

  return newMessage
}

export async function deleteSession(id: string, userId: string) {
  const result = await prisma.chatSession.deleteMany({
    where: { id, userId },
  })
  return result.count > 0
}

export async function editSessionTitle(id: string, userId: string, newTitle: string) {
  const result = await prisma.chatSession.updateMany({
    where: { id, userId },
    data: { title: newTitle, updatedAt: new Date() },
  })
  return result.count > 0
}

export async function pinSession(id: string, userId: string, isPinned: boolean) {
  const result = await prisma.chatSession.updateMany({
    where: { id, userId },
    data: { isPinned, updatedAt: new Date() },
  })
  return result.count > 0
}

export function formatHistoryForAI(messages: Message[]) {
  return messages.map((m) => ({ role: m.role, content: m.content }))
}
