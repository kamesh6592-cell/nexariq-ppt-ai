import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexariq - AI-Powered Presentation Platform',
  description: 'Create stunning presentations with advanced AI technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
