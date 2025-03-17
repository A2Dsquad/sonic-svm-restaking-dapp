"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        <nav className="hidden">
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
      </div>
    </header>
  );
}
