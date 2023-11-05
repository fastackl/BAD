"use client"

import Arena from '@/components/arena'
import { ConnectWallet, useContract, useContractRead } from "@thirdweb-dev/react"
import { CONTRACT_ADDRESS } from './constants/addresses';

export default function Home() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: guardians, isLoading: isGuardianLoading} = useContractRead(contract, "_guardians", [1] );


  return (
    <main className="flex min-h-screen max-h-screen flex-col items-center justify-between">
      <nav className="fixed z-30 flex items-center justify-between w-full p-6">
      <h1 className="text-xl"><span className='' role="img" aria-label="emoji">🛡️</span> Guardian Demo</h1>
      <ConnectWallet
        theme={"dark"}
        modalSize={"compact"}
      />
    </nav>
{isGuardianLoading ? <p>loading</p> : <p>{guardians}</p>}
<Arena />
    </main>
  )
}
