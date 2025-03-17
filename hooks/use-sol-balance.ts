import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

export function useSolBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  return useQuery({
    queryKey: ["sol-balance", publicKey],
    queryFn: async () => {
      try {
        if (!publicKey) {
          return "0";
        }
        const balance = await connection.getBalance(publicKey);
        return balance.toString();
      } catch (error) {
        console.error("Error fetching pool shares", error);
        return "0";
      }
    },
    enabled: !!publicKey,
  });
}
