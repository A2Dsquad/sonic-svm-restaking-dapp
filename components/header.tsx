"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "./connect-wallet-button";

export function Header() {
  const pathname = usePathname();
  const isActive = (path: string) =>
    path === "/" ? path === pathname : pathname.startsWith(path);

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
        <nav className="hidden md:flex space-x-4">
          <Link href="/">
            <Button
              variant={
                isActive("/staking") || isActive("/") ? "default" : "ghost"
              }
              className="font-semibold"
            >
              Restake
            </Button>
          </Link>
          <Link href="/operator">
            <Button
              variant={isActive("/operator") ? "default" : "ghost"}
              className="font-semibold"
            >
              Operator
            </Button>
          </Link>
          <Link href="/avs">
            <Button
              variant={isActive("/avs") ? "default" : "ghost"}
              className="font-semibold"
            >
              AVS
            </Button>
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <ConnectWalletButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href="/">
                <DropdownMenuItem>Restake</DropdownMenuItem>
              </Link>
              <Link href="/operator">
                <DropdownMenuItem>Operator</DropdownMenuItem>
              </Link>
              <Link href="/avs">
                <DropdownMenuItem>AVS</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
