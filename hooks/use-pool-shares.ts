import { useQuery } from "@tanstack/react-query";

export function usePoolShares() {
  // const stakingPoolClient = surfClient.useABI();

  return useQuery({
    queryKey: ["pool-shares"],
    queryFn: async () => {
      try {
        // const poolTotalShares = await Promise.all(
        //   Object.entries(mapTokenToPool).map(
        //     async ([tokenAddress, poolAddress]) => {
        //       const [totalShares] = (await stakingPoolClient.view.total_shares({
        //         functionArguments: [poolAddress],
        //         typeArguments: [],
        //       })) as any;

        //       return {
        //         totalShares,
        //         tokenAddress,
        //       };
        //     }
        //   )
        // );

        return await [];
      } catch (error) {
        console.error("Error fetching pool shares", error);
        return null;
      }
    },
    enabled: true,
  });
}
