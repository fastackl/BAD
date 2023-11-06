import { useEffect, useState } from 'react';
import { useContract, useContractRead } from '@thirdweb-dev/react';
import { BigNumber } from 'bignumber.js';

export const useGuardianAddresses = (contract: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [guardianAddresses, setGuardianAddresses] = useState([null, null, null]);

  const { data: firstGuardian, isLoading: isLoadingFirst } = useContractRead(contract, "_guardians", [0]);
  const { data: secondGuardian, isLoading: isLoadingSecond } = useContractRead(contract, "_guardians", [1]);
  const { data: thirdGuardian, isLoading: isLoadingThird } = useContractRead(contract, "_guardians", [2]);

  useEffect(() => {
    if (!isLoadingFirst && !isLoadingSecond && !isLoadingThird) {
      setGuardianAddresses([firstGuardian, secondGuardian, thirdGuardian]);
      setIsLoading(false);
    }
  }, [isLoadingFirst, isLoadingSecond, isLoadingThird]);

  console.log("Loading Addresses: ", isLoading);
console.log("Guardian Addresses: ", guardianAddresses);
return { guardianAddresses, isLoading };
};

export const useGuardianScores = (contract: any, guardianAddresses: any) => {
    const [guardianScores, setGuardianScores] = useState([null, null, null]);
    const [isLoadingScores, setIsLoadingScores] = useState(true);
  
    const { data: firstGuardianScore, isLoading: isLoadingFourth } = useContractRead(contract, "_scores", [guardianAddresses[0]]);
    const { data: secondGuardianScore, isLoading: isLoadingFifth } = useContractRead(contract, "_scores", [guardianAddresses[1]]);
    const { data: thirdGuardianScore, isLoading: isLoadingSixth } = useContractRead(contract, "_scores", [guardianAddresses[2]]);
  
    useEffect(() => {
      if (!isLoadingFourth && !isLoadingFifth && !isLoadingSixth) {
        setGuardianScores([
          firstGuardianScore?.toString(),
          secondGuardianScore?.toString(),
          thirdGuardianScore?.toString()
        ]);
        setIsLoadingScores(false);
      }
    }, [isLoadingFourth, isLoadingFifth, isLoadingSixth]);
  
    console.log("Loading Scores: ", isLoadingScores);
    console.log("Guardian Scores: ", guardianScores);
    return { guardianScores, isLoadingScores };
  };

  export const useOwnScore = (contract: any, address: any) => {
      const [ownScore, setOwnScore] = useState(null);
      const [isLoadingOwnScore, setIsLoadingOwnScore] = useState(true);
  
      const { data: score, isLoading: isLoadingScore } = useContractRead(contract, "_scores", [address]);
  
      useEffect(() => {
        if (!isLoadingScore) {
          setOwnScore(score?.toString());
          setIsLoadingOwnScore(false);
        }
      }, [isLoadingScore]);
  
      console.log("Loading Own Score: ", isLoadingOwnScore);
      console.log("Own Score: ", ownScore);
      return { ownScore, isLoadingOwnScore };
    };
