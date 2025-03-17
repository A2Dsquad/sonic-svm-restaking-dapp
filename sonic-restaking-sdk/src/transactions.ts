import { ComputeBudgetProgram, Keypair, PublicKey, Signer, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js"
import { connection } from "./configs"

export async function sendTransaction(instructions: TransactionInstruction[], signers: Signer[], payer: Keypair){
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 200_000,
      })
    
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 200000,
      })
    const { blockhash } = await connection.getLatestBlockhash('finalized')
    const msg = new TransactionMessage({
      payerKey: payer.publicKey,
      instructions: [modifyComputeUnits, addPriorityFee, ...instructions],
      recentBlockhash: blockhash,
    }).compileToV0Message()
    const tx = new VersionedTransaction(msg)
    
    signers.push(payer)
    tx.sign(signers)

    const txId = await connection.sendTransaction(tx)
    return txId;
}