import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThirdwebProvider } from "@/components/ThirdwebProvider"
import { Goerli } from '@thirdweb-dev/chains'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EET Guardian Demo',
  description: "A demo of the EET Guardian system built by Kanon & friends for the ETH Lisbon Hackathon 2023",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ThirdwebProvider activeChain={Goerli}>
        <body className={inter.className}>{children}</body>
      </ThirdwebProvider>
    </html>
  )
}
