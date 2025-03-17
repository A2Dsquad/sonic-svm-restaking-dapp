import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

export function usePoolStakedAmount(tokenAddress: PublicKey) {
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ["pool-staked-amount", publicKey?.toBase58()],
    queryFn: () => {
      try {
        return "";
      } catch (error) {
        console.error("Error fetching pool shares", error);
        return null;
      }
    },
    enabled: !!publicKey,
  });
}
