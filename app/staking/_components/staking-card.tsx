"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TxFailedDialog } from "@/components/ui/tx-failed-dialog";
import { TxSuccessDialog } from "@/components/ui/tx-success-dialog";
import { useBalance } from "@/hooks/use-balance";
import { useSolBalance } from "@/hooks/use-sol-balance";
import { useStake } from "@/hooks/use-stake";
import { useUnstake } from "@/hooks/use-unstake";
import { POOL_MINT } from "@/lib/constants";
import { fromDecimals, toCurrency, toDecimals } from "@/lib/number";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";
import BigNumber from "bignumber.js";
import { Terminal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val);
      return !Number.isNaN(num) && num > 0;
    },
    {
      message: "Please enter a valid positive number",
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const assetName = "senSOL";
const assetIcon = "/assets/logo.png";
const tokenAddress = POOL_MINT;

export function StakingCard() {
  const { publicKey } = useWallet();

  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [error, setError] = useState<Error | undefined>();
  const { data: balance = "0" } = useBalance(tokenAddress);
  const { data: solBalance = "0" } = useSolBalance();

  const stakeMutation = useStake();
  const unstakeMutation = useUnstake();

  const unstakeTimes =
    typeof window !== "undefined"
      ? localStorage.getItem("unstake-time")?.split(",")
      : null;

  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const unstakeWithdrawalTimes = unstakeTimes
    ? unstakeTimes.map(
        (unstakeTime) =>
          new Date(Number.parseInt(unstakeTime)).getTime() + sevenDays
      )
    : null;
  const now = new Date().getTime();

  const solBalanceFormatted = fromDecimals(solBalance ?? 0);
  const balanceFormatted = fromDecimals(balance ?? 0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const inputAmount = form.watch("amount");

  const handlePercentageClick = (percentage: number) => {
    let maxAmount = 0;
    if (mode === "withdraw") {
      maxAmount = Number.parseFloat(solBalanceFormatted.replace(/,/g, ""));
    } else {
      maxAmount = Number.parseFloat(balance.replace(/,/g, ""));
    }

    const newAmount = BigNumber(maxAmount)
      .multipliedBy(percentage)
      .dividedBy(100)
      .toString();
    form.setValue("amount", newAmount.toString());
  };

  const onSubmit = async (data: FormValues) => {
    const amountInDecimal = toDecimals(data.amount);
    try {
      if (mode === "deposit") {
        await stakeMutation.mutateAsync(amountInDecimal);
      } else {
        await unstakeMutation.mutateAsync(data.amount);
      }
    } catch (err) {
      setError(err as Error);
    }
  };

  const isDisabled =
    mode === "withdraw"
      ? solBalance === "0" || !inputAmount
      : !balance || !inputAmount;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="-ml-2 flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <img src={assetIcon} alt={assetName} />
            </Avatar>
            <CardTitle className="text-lg font-medium">{assetName}</CardTitle>
          </div>
          <Badge variant="outline">1.1%APY</Badge>
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <Button
            variant={mode === "deposit" ? "default" : "ghost"}
            onClick={() => setMode("deposit")}
            size="sm"
            className="w-full md:w-auto"
          >
            Restake
          </Button>
          <Button
            variant={mode === "withdraw" ? "default" : "ghost"}
            onClick={() => setMode("withdraw")}
            size="sm"
            className="w-full md:w-auto"
          >
            Unstake
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">
                You are {mode === "deposit" ? "restaking" : "unstaking"}
              </p>

              <div className="flex flex-row w-full justify-between">
                <div />
                <p className="text-sm font-light mb-3">
                  {"You restaked "}
                  <span className="font-semibold">
                    {toCurrency(balanceFormatted, {
                      suffix: ` ${assetName}`,
                    })}{" "}
                  </span>
                </p>
              </div>
              <div className="bg-secondary p-4 rounded-md">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NumericInput
                          {...field}
                          className="text-4xl font-bold bg-transparent border-none p-0 focus-visible:ring-0"
                          placeholder="000.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    {mode === "deposit"
                      ? `${solBalanceFormatted} SOL`
                      : `${balanceFormatted} ${assetName}`}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(25)}
                    >
                      25%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(50)}
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(100)}
                    >
                      Max
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold mb-3">Exchange rate:</p>
              <p className="text-sm mb-3">1 senSOL = 1.000001 SOL</p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isDirty || isDisabled || !publicKey}
              loading={stakeMutation.isPending || unstakeMutation.isPending}
            >
              {mode === "deposit" ? "Restake" : "Unstake"}
            </Button>
          </form>
        </Form>
        {mode === "withdraw" &&
          publicKey &&
          unstakeTimes &&
          unstakeWithdrawalTimes && (
            <Alert className="mt-10">
              <AlertTitle className="flex items-center">
                <Terminal className="h-6 w-6 mr-2" />
                Unstake in queue
              </AlertTitle>
              <AlertDescription>
                <p className="mb-2 mt-2">
                  Your unstake requests (withdrawable after 7 days):
                </p>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request time</TableHead>
                      <TableHead>Claim time</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unstakeTimes.map((unstakeTime, index) => (
                      <TableRow key={index.toString()}>
                        <TableCell>
                          {new Date(+unstakeTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            +unstakeWithdrawalTimes[index]
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <Button
                            disabled
                            className="ml-auto"
                            onClick={() => {
                              toast.info("Coming soon");
                            }}
                          >
                            {unstakeWithdrawalTimes[index] > now
                              ? "Pending"
                              : "Ready"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AlertDescription>
            </Alert>
          )}
        <TxSuccessDialog
          open={!!stakeMutation.data || !!unstakeMutation.data}
          txLink={`https://explorer.sonic.game/tx/${
            stakeMutation.data || unstakeMutation.data
          }/metadata?cluster=testnet.v1`}
          onOpenChange={() => {
            stakeMutation.reset();
            unstakeMutation.reset();
          }}
        />
        <TxFailedDialog
          open={error !== undefined}
          error={error as any}
          onOpenChange={() => {
            setError(undefined);
            stakeMutation.reset();
            unstakeMutation.reset();
          }}
        />
      </CardContent>
    </Card>
  );
}
