import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { shortenAddress } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Copy, LogOut, RefreshCwIcon, WalletIcon } from "lucide-react";

export const ConnectWalletButton = () => {
  const { setVisible } = useWalletModal();
  const { wallet, connected, disconnect, publicKey } = useWallet();
  const { copyToClipboard } = useCopyToClipboard();

  const handleClick = () => {
    if (!wallet) {
      setVisible(true);
    } else if (!connected) {
      setVisible(true);
    }
  };

  const handleCopyAddress = () => {
    if (publicKey) {
      copyToClipboard(publicKey.toString());
    }
  };

  const handleChangeWallet = () => {
    setVisible(true);
  };

  if (connected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border border-primary rounded-full w-6 h-6 p-0 md:px-5 md:py-4 md:w-auto md:h-[43px]"
          >
            <WalletIcon className="w-5 h-5 text-primary flex-shrink-0 md:hidden" />
            <span className="text-sm font-medium hidden md:block">
              {shortenAddress(publicKey?.toString() ?? "")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-[16px] border-none flex flex-col gap-1"
        >
          <DropdownMenuItem onClick={handleCopyAddress}>
            <Copy className="h-4 w-4" />
            Copy address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleChangeWallet}>
            <RefreshCwIcon className="h-4 w-4" />
            Change wallet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect}>
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="flex items-center justify-center gap-2 border border-primary rounded-full w-6 h-6 p-0 md:px-5 md:py-4 md:w-auto md:h-[43px]"
    >
      <WalletIcon className="w-5 h-5 text-primary flex-shrink-0 md:hidden" />
      <span className="text-sm font-medium hidden md:block">
        Connect Wallet
      </span>
    </Button>
  );
};
