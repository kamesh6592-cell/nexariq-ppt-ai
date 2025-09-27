'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the Nexariq component to avoid SSR issues
const NexariqApp = dynamic(() => import('../components/Nexariq'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl">Loading Nexariq...</div>
    </div>
  )
})

export default function Home() {
  return <NexariqApp />
}
