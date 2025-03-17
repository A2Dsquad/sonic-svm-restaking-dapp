import { PublicKey } from "@solana/web3.js"
import { connection, signer } from "./configs"
import { depositSol, getStakePoolAccount, updateStakePool, withdrawSol } from "./restaking"
import { sendTransaction } from "./transactions";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { createZkBridgeToken, mintZkBridgeToken } from "./zkbridge";
import { ZKBRIDE_MINT } from "./zkbridge/constants";

const stakePoolAddress = new PublicKey("8DPF9cZzpSoXuvTT92AXJL5wy4Cz4Y8Y4YsRFv7idn3t");
const poolMint = new PublicKey("DRku5U6mhLwSUecTwLa8byvkP1jAb3tX1mY92i4XBJRa");
async function getTokenBalance(account: PublicKey, mint: PublicKey): Promise<void> {
    try {
        // Get the Associated Token Account (ATA)
        const tokenAccount = getAssociatedTokenAddressSync(mint, account);

        // Fetch the token account balance
        const accountInfo = await getAccount(connection, tokenAccount);

        console.log(`Token Balance: ${Number(accountInfo.amount)}`);
    } catch (error) {
        console.error("Error fetching token balance:", error);
    }
}

async function withdraw() {
    const stakePoolAccount = await getStakePoolAccount(connection, stakePoolAddress);

    const {
        updateListInstructions,
        finalInstructions
    } = await updateStakePool(connection, stakePoolAccount);
    const { instructions, signers } = await withdrawSol(
        connection,
        stakePoolAddress,
        signer.publicKey,
        signer.publicKey,
        0.001
    );

    const txId = await sendTransaction([...updateListInstructions, ...finalInstructions, ...instructions], signers, signer);
    console.log(txId)
}
async function deposit() {
    const stakePoolAccount = await getStakePoolAccount(connection, stakePoolAddress);

    const {
        updateListInstructions,
        finalInstructions
    } = await updateStakePool(connection, stakePoolAccount);
    const { instructions, signers } = await depositSol(
        connection,
        stakePoolAddress,
        signer.publicKey,
        1_000_000
    );

    const txId = await sendTransaction([...updateListInstructions, ...finalInstructions, ...instructions], signers, signer);
    console.log(txId)
}

async function createZkBMint() {
    const {instructions} = await createZkBridgeToken("senETH", "sentra ETH", "URI");
    const txId = await sendTransaction(instructions, [], signer);
    console.log(txId)
}

async function mintZKToken() {
    const {instructions} = await mintZkBridgeToken(connection, signer.publicKey, 1_000_000_000, signer.publicKey);
    const txId = await sendTransaction(instructions, [], signer);
    console.log(txId)
}

// mintZKToken().then();
getTokenBalance(signer.publicKey, ZKBRIDE_MINT).then()