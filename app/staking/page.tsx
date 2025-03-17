"use client";

import { StakingCard } from "@/app/staking/_components/staking-card";

export default function StakingPage() {
  return (
    <main
      className="container mx-auto p-4 overflow-y-auto"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <StakingCard />
    </main>
  );
}
