import { SonicSvmZkbridge } from "./sonic_svm_zkbridge"
import { Program } from "@coral-xyz/anchor"
import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js"
import { findMetadataAddress, findOrCreateAssociatedTokenAccountByMint } from "src/restaking/utils"
import idl from './idl.json'
import { ZKBRIDE_MINT } from "./constants"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"
import { BN } from "bn.js"
const program = new Program<SonicSvmZkbridge>(idl)
export async function mintZkBridgeToken(
    connection: Connection,
    user: PublicKey,
    amount: number,
    payer?: PublicKey
) {
    const { tokenAccountAddress: userTokenAccount, accountCreationInstruction } = await findOrCreateAssociatedTokenAccountByMint(
        connection,
        ZKBRIDE_MINT,
        user,
        payer
    )

    const instructions: TransactionInstruction[] = [];
    if (accountCreationInstruction) instructions.push(accountCreationInstruction);
    instructions.push(await program.methods
        .mintOnBridge(new BN(amount))
        .accounts({
            userTokenAccount
        }).instruction() as TransactionInstruction)

    return {
        instructions
    }
}
export async function createZkBridgeToken(
    name: string,
    symbol: string,
    uri: string
) {

    const tokenMetadata = findMetadataAddress(ZKBRIDE_MINT);

    const instruction = await program.methods
        .createMint(uri, name, symbol)
        .accounts({
            metadataAccount: tokenMetadata
        }).instruction() as TransactionInstruction

    return {
        instructions: [instruction]
    }
}



