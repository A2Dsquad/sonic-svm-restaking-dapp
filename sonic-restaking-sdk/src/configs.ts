import dotenv from 'dotenv'
dotenv.config();
import { Connection, Keypair } from '@solana/web3.js'

const privateKey = Buffer.from(new Uint8Array(JSON.parse(process.env.PRIVATE_KEY as string)))
const rpc = 'https://api.testnet.sonic.game';
export const connection = new Connection(rpc);
export const signer: Keypair = Keypair.fromSecretKey(privateKey)
