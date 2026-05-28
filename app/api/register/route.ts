import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, dan nama wajib diisi" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
