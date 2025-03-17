import { AnchorProvider } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const useAnchorProvider = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const provider = new AnchorProvider(
    connection,
    {
      publicKey,
      signTransaction,
    } as any,
    {
      commitment: "confirmed",
    }
  );

  return provider;
};
