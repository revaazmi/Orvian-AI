"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/"
    }
  }, [status])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (status === "authenticated") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email atau password salah")
      setLoading(false)
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-6">
          <h1 className="mb-1 text-center text-xl font-semibold text-white">
            ORVIAN AI
          </h1>
          <p className="mb-6 text-center text-sm text-gray-400">
            Masuk ke akun Anda
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-900/30 border border-red-800 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="******"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
