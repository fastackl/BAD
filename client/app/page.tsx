"use client"

import Navbar from '@/components/navbar'
import Arena from '@/components/arena'
import { useContract, useAddress } from '@thirdweb-dev/react'
import { useGuardianAddresses, useGuardianScores, useOwnScore } from './useGuardianData'

export default function Home() {
  const { contract } = useContract("0x1e3ae9a1ceDE4Cd9F5331afF434ADCBEa4189019");
  const address = useAddress();
  const { guardianAddresses, isLoading: isLoadingAddresses } = useGuardianAddresses(contract);
  const { guardianScores, isLoadingScores } = useGuardianScores(contract, guardianAddresses);

  let guardianData = guardianAddresses.map((address, index) => {
    let score = guardianScores[index] || 0; // Default to 0 when null
    return {
      name: address ? address : 'default',
      group: 1,
      points: score,
      width: score,
      height: score,
      index: index
    };
  });

  const { ownScore, isLoadingOwnScore } = useOwnScore(contract, address);

  guardianData.push({
    name: address || 'default',
    group: 2,
    points: ownScore || 0,
    width: ownScore || 0,
    height: ownScore || 0,
    index: 4
  });

  console.log(guardianData);

  return (
    <main className="flex min-h-screen max-h-screen flex-col items-center justify-between">
      <Navbar address={address || 'default'}/>
      {!isLoadingAddresses && !isLoadingScores && <Arena data={guardianData} />}
    </main>
  )
}