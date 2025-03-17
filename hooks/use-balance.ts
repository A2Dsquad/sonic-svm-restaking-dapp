import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

export function useBalance(tokenAddress: PublicKey) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  return useQuery({
    queryKey: ["balance", tokenAddress, publicKey],
    queryFn: async () => {
      try {
        if (!publicKey) {
          return "0";
        }

        const tokenAccount = getAssociatedTokenAddressSync(
          tokenAddress,
          publicKey
        );
        const accountInfo = await getAccount(connection, tokenAccount);
        return accountInfo.amount.toString();
      } catch (error) {
        console.error("Error fetching balance", error);
        return "0";
      }
    },
    enabled: !!publicKey && !!tokenAddress,
  });
}
