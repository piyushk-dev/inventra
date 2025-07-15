import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Walmart Supply Chain AI - Enterprise Command Center",
  description:
    "AI-powered supply chain optimization and inventory management system for Walmart operations. Real-time analytics, predictive insights, and automated goods movement recommendations.",
  keywords: ["Walmart", "Supply Chain", "AI", "Inventory Management", "Logistics", "Analytics", "Optimization"],
  authors: [{ name: "Walmart Technology Team" }],
  creator: "Walmart Inc.",
  publisher: "Walmart Inc.",
  robots: "noindex, nofollow", // Since this is a demo/hackathon project
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#004c91",
  openGraph: {
    title: "Walmart Supply Chain AI",
    description: "Enterprise-grade AI supply chain management system",
    type: "website",
    siteName: "Walmart Supply Chain AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walmart Supply Chain AI",
    description: "Enterprise-grade AI supply chain management system",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="application-name" content="Walmart Supply Chain AI" />
        <meta name="apple-mobile-web-app-title" content="Walmart Supply Chain AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#004c91" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
