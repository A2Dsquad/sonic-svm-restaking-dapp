import { STAKE_POOL_MINT } from "@/lib/constants";
import {
  depositSol,
  getStakePoolAccount,
  updateStakePool,
} from "@sdk/restaking";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  ComputeBudgetProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { useAnchorProvider } from "./use-anchor-provider";

export function useStake() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const provider = useAnchorProvider();

  return useMutation({
    mutationFn: async (amount: string) => {
      if (!publicKey) return;
      const stakePoolAccount = await getStakePoolAccount(
        connection,
        STAKE_POOL_MINT
      );

      const { updateListInstructions, finalInstructions } =
        await updateStakePool(connection, stakePoolAccount);
      const { instructions, signers } = await depositSol(
        connection,
        STAKE_POOL_MINT,
        publicKey,
        Number(amount)
      );

      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 200_000,
      });

      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 200000,
      });
      const { blockhash } = await connection.getLatestBlockhash("finalized");

      const msg = new TransactionMessage({
        payerKey: publicKey,
        instructions: [
          modifyComputeUnits,
          addPriorityFee,
          ...updateListInstructions,
          ...finalInstructions,
          ...instructions,
        ],
        recentBlockhash: blockhash,
      }).compileToV0Message();
      const tx = new VersionedTransaction(msg);
      const signature = await provider.sendAndConfirm(tx, signers, {
        commitment: "confirmed",
      });

      return signature;
    },
  });
}
