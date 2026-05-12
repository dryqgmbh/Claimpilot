"use client";

import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReanalyzeButton({ claimId }: { claimId: string }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => router.push(`/app/audit/${claimId}`)}
    >
      <RotateCw className="h-3.5 w-3.5" /> Re-analyze
    </Button>
  );
}
