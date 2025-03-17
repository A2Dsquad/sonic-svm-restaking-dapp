"use client";

import { OperatorTable } from "@/app/operator/_components/operator-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fakeOperators } from "@/lib/constants";

export default function OperatorPage() {
  const operators = fakeOperators;

  return (
    <main
      className="container mx-auto p-4 pt-16"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Operators</CardTitle>
        </CardHeader>
        <CardContent>
          <OperatorTable operators={operators} />
        </CardContent>
      </Card>
    </main>
  );
}
