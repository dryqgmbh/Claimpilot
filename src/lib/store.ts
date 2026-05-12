import "server-only";
import { CLAIMS as SEED } from "./mock-data";
import type { Claim } from "@/types";

/**
 * In-process store. Survives only for the lifetime of the dev server / node
 * worker. Swap for Postgres/Supabase in v1 backend phase — keep the same
 * read/write API so callers don't change.
 */

type Status =
  | "queued"
  | "parsing"
  | "matching"
  | "scoring"
  | "verifying"
  | "done"
  | "error";

interface AuditJob {
  claim_id: string;
  status: Status;
  step: string;
  progress_pct: number;
  started_at: string;
  finished_at?: string;
  error?: string;
}

const claims = new Map<string, Claim>(SEED.map((c) => [c.id, c]));
const jobs = new Map<string, AuditJob>();

export function listClaims(): Claim[] {
  return Array.from(claims.values()).sort((a, b) =>
    a.updated_at < b.updated_at ? 1 : -1,
  );
}

export function getClaimById(id: string): Claim | undefined {
  return claims.get(id);
}

export function upsertClaim(claim: Claim) {
  claim.updated_at = new Date().toISOString();
  claims.set(claim.id, claim);
}

export function setJob(job: AuditJob) {
  jobs.set(job.claim_id, job);
}

export function getJob(claim_id: string): AuditJob | undefined {
  return jobs.get(claim_id);
}

export function listJobs(): AuditJob[] {
  return Array.from(jobs.values());
}

export type { AuditJob };
