"use client";

import Link from "next/link";
import { ConnectWalletButton } from "./connect-wallet-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between w-full">
        <Link href="/">
          <div className="flex items-center">
            <img
              src="/assets/logo-typo.png"
              className="mr-2 h-10"
              alt="Sentra Layer Logo"
            />
          </div>
        </Link>
        <ConnectWalletButton />
      </div>
    </header>
  );
}
