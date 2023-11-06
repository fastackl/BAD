import React from 'react';
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  walletConnect,
  localWallet,
  Web3Button,
  useAddress,
  useContractRead,
  useContract
} from "@thirdweb-dev/react";

export default function Navbar({ address }: { address: string }) {
  const { contract } = useContract("0x9D1260420c895D682d9BE7298d15D0E6343ce440");
  const { data: rawFee, isLoading } = useContractRead(contract, "getFee", [5, "0x0000000000000000000000000000000000000000"])
  const ethers = require('ethers');
  let fee;
  if (rawFee !== undefined) {
    fee = ethers.utils.formatUnits(rawFee, 'wei');
  }

  return (
    <nav className="fixed z-30 flex items-center justify-between w-full p-6">
      <h1 className="text-xl"><span className='' role="img" aria-label="emoji">🛡️</span> Guardian Demo</h1>
      <ThirdwebProvider
        activeChain="goerli"
        clientId="cec150b891bf0e6fc160d0f1664d51ac"
        supportedWallets={[
          metamaskWallet(),
          walletConnect(),
          localWallet(),
        ]}
      >
        <div className='flex flex-row gap-4'>
        <Web3Button
  contractAddress="0x5Bc93bF040Deed78b63214f4F37FA82A3c30e1cA"
  action={(contract) => {
    contract.call(
        "mint", [["0x129f33143e97e28E19CD2fBAAF7869DE40d3Bb7f", "0x129f33143e97e28E19CD2fBAAF7869DE40d3Bb7f", "0x129f33143e97e28E19CD2fBAAF7869DE40d3Bb7f", "0x129f33143e97e28E19CD2fBAAF7869DE40d3Bb7f", "0x129f33143e97e28E19CD2fBAAF7869DE40d3Bb7f"], ["0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8", "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8", "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8", "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8", "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8"]
        , [0, 0, 0, 0, 0], "0x0000000000000000000000000000000000000000", ["123", "123", "123", "123", "123"], address],
        {
          value: fee
        }
      )
  }}
>
  Bulk up
</Web3Button>
        <ConnectWallet
          theme={"dark"}
          modalSize={"compact"}
        />
        </div>

      </ThirdwebProvider>
    </nav>
  );
}
