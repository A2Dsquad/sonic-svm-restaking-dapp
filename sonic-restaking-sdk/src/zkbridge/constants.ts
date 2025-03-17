import { PublicKey } from "@solana/web3.js";

// Public key that identifies the Zkbridge program.
export const ZKBRIDGE_PROGRAM_ID = new PublicKey('88QHaEWCaccAzrgzsDESBCAYEuyC4hKeUJRKbTi3fQHx');


const [tokenMint] = PublicKey.findProgramAddressSync(
    [Buffer.from("zkbridge")],
    ZKBRIDGE_PROGRAM_ID
)

export const ZKBRIDE_MINT = tokenMint