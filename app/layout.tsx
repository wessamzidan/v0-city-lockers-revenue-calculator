import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CityLockersProvider } from "@/lib/citylockers-context"
import { Header } from "@/components/citylockers/header"
import { Footer } from "@/components/citylockers/footer"
import { WhatsAppButton } from "@/components/citylockers/whatsapp-button"
import { AIAssistant } from "@/components/citylockers/ai-assistant"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CityLockers Revenue Calculator | B2B Partnership Tool",
  description:
    "Professional B2B revenue modeling tool for CityLockers smart locker partnerships. Zero Capex, Zero Opex business model. Personal project by Wessam Zidan.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <CityLockersProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <AIAssistant />
          </div>
        </CityLockersProvider>
        <Analytics />
      </body>
    </html>
  )
}
