"use client"

import Image from 'next/image'
import Navbar from '@/components/navbar'
import Arena from '@/components/arena'

export default function Home() {
  return (
    <main className="flex min-h-screen max-h-screen flex-col items-center justify-between">
      <Navbar />
      <Arena />
    </main>
  )
}
