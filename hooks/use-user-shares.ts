import { useWallet } from "@solana/wallet-adapter-react";
// import { useWallet } from "@aptos-labs/wallet-adapter-react"
// import StakerManagerABI from '@sdk/abis/staker-manager.json'
import { useQuery } from "@tanstack/react-query";

export function useUserShares() {
  const { publicKey } = useWallet();
  // const stakerClient = surfClient.useABI(StakerManagerABI as any)

  return useQuery({
    queryKey: ["user-shares", publicKey?.toBase58()],
    queryFn: async () => {
      try {
        // const [tokens, nonnormalizedShares] = await stakerClient.view.staker_nonnormalized_shares({
        //    functionArguments: [account?.address ?? ''],
        //   typeArguments: [],
        // }) as any

        // const userShareInPools = tokens.map((token: { inner: string }, index: number) => ({
        //   token: token.inner,
        //   userStaked: nonnormalizedShares[index],
        // }))

        return await [];
      } catch (error) {
        console.error("Error fetching pool shares", error);
        return null;
      }
    },
    enabled: !!publicKey,
  });
}
