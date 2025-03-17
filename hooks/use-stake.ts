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

export function useStake() {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();

  return useMutation({
    mutationFn: async (amount: string) => {
      if (!publicKey || !signTransaction) return;
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

      const signedTx = await signTransaction(tx);

      const txId = await sendTransaction(signedTx, connection);

      return txId;
    },
  });
}
