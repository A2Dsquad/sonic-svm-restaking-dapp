import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Buffer } from "buffer";
import {
  METADATA_PROGRAM_ID,
  EPHEMERAL_STAKE_SEED_PREFIX,
  TRANSIENT_STAKE_SEED_PREFIX,
} from "./restaking/constants";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

/**
 * Generates the withdraw authority program address for the stake pool
 */
export function findWithdrawAuthorityProgramAddress(
  programId: PublicKey,
  stakePoolAddress: PublicKey
) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [stakePoolAddress.toBuffer(), Buffer.from("withdraw")],
    programId
  );
  return publicKey;
}

/**
 * Generates the stake program address for a validator's vote account
 */
export function findStakeProgramAddress(
  programId: PublicKey,
  voteAccountAddress: PublicKey,
  stakePoolAddress: PublicKey,
  seed?: number
) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [
      voteAccountAddress.toBuffer(),
      stakePoolAddress.toBuffer(),
      seed ? new BN(seed).toArrayLike(Buffer, "le", 4) : Buffer.alloc(0),
    ],
    programId
  );
  return publicKey;
}

/**
 * Generates the stake program address for a validator's vote account
 */
export function findTransientStakeProgramAddress(
  programId: PublicKey,
  voteAccountAddress: PublicKey,
  stakePoolAddress: PublicKey,
  seed: BN
) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [
      TRANSIENT_STAKE_SEED_PREFIX,
      voteAccountAddress.toBuffer(),
      stakePoolAddress.toBuffer(),
      seed.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
  return publicKey;
}

export function parseTokenResponseToAccountInfo(
  res: any
): Array<{ pubkey: PublicKey; account: any }> {
  return res.value.map((data: any) => ({
    pubkey: data.pubkey,
    account: data.account,
  }));
}

export async function findOrCreateAssociatedTokenAccountByMint(
  connection: Connection,
  tokenPubkey: PublicKey,
  userPubkey: PublicKey,
  payer?: PublicKey
) {
  const mint = tokenPubkey;

  let parsedAccounts: {
    pubkey: PublicKey;
    account: any;
  }[] = [];
  try {
    const accounts = await connection.getParsedTokenAccountsByOwner(
      userPubkey,
      {
        mint,
        programId: TOKEN_PROGRAM_ID,
      }
    );

    parsedAccounts = parseTokenResponseToAccountInfo(accounts);
  } catch (err) {}

  if (parsedAccounts && parsedAccounts.length > 0) {
    return {
      tokenAccountAddress: parsedAccounts[0].pubkey,
    };
  } else {
    const newAtaTokenAccount = getAssociatedTokenAddressSync(
      mint,
      userPubkey,
      false
    );
    const newAtaAccountInstruction = createAssociatedTokenAccountInstruction(
      payer ?? userPubkey,
      newAtaTokenAccount,
      userPubkey,
      mint
    );

    return {
      tokenAccountAddress: newAtaTokenAccount,
      accountCreationInstruction: newAtaAccountInstruction,
    };
  }
}

/**
 * Generates the ephemeral program address for stake pool redelegation
 */
export function findEphemeralStakeProgramAddress(
  programId: PublicKey,
  stakePoolAddress: PublicKey,
  seed: BN
) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [
      EPHEMERAL_STAKE_SEED_PREFIX,
      stakePoolAddress.toBuffer(),
      seed.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
  return publicKey;
}

/**
 * Generates the metadata program address for the stake pool
 */
export function findMetadataAddress(stakePoolMintAddress: PublicKey) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      stakePoolMintAddress.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );
  return publicKey;
}
