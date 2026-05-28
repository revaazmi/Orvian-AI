import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ORVIAN AI",
  description: "Asisten AI cerdas Anda",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
