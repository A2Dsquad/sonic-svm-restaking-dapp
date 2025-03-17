import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

interface RewardResponse {
  id: number;
  earner: string;
  rewardToken: string;
  totalClaimed: string;
  pendingClaimed: string;
}

export function useGetRewardAmount() {
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ["get-reward-amount", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey?.toBase58()) return 0;
      try {
        const rewardResponse = await fetch(
          `https://test.lotusfarm.online/api/rewards/${publicKey?.toBase58()}`
        );
        const data = (await rewardResponse.json()) as RewardResponse;
        return Number(data.pendingClaimed);
      } catch (error) {
        console.error("Error fetching reward amount", error);
        return 0;
      }
    },
    enabled: !!publicKey,
  });
}
