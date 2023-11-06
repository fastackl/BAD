import React from 'react';
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  walletConnect,
  localWallet,
} from "@thirdweb-dev/react";

export default function Navbar() {
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
      <ConnectWallet
        theme={"dark"}
        modalSize={"compact"}
      />
    </ThirdwebProvider>
    </nav>
  );
}
