import { UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const TEAM = [
  { name: "Mike Diaz", email: "mike@premiumrestoration.com", role: "Owner", status: "active", last: "Today" },
  { name: "Carla Roan", email: "carla@premiumrestoration.com", role: "Operations Manager", status: "active", last: "Today" },
  { name: "Dave Mendez", email: "dave@premiumrestoration.com", role: "Estimator", status: "active", last: "Yesterday" },
  { name: "Tony Pierce", email: "tony@premiumrestoration.com", role: "Mitigation Manager", status: "active", last: "Today" },
  { name: "Lauren Cole", email: "lauren@premiumrestoration.com", role: "Admin", status: "active", last: "Today" },
  { name: "Field Tech 1", email: "tech1@premiumrestoration.com", role: "Tech", status: "active", last: "Today" },
  { name: "Field Tech 2", email: "tech2@premiumrestoration.com", role: "Tech", status: "invited", last: "—" },
];

const ROLES = ["Owner", "Admin", "Estimator", "Mitigation Manager", "Tech", "Viewer"];

export default function TeamPage() {
  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team & Roles</h1>
          <p className="text-[13px] text-app-muted">
            Invite teammates and control access by role.
          </p>
        </div>
        <Button className="gap-1.5">
          <UserPlus className="h-4 w-4" /> Invite member
        </Button>
      </div>

      <Card className="mt-6">
        <Table>
          <THead>
            <TR>
              <TH>Member</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH>Last active</TH>
            </TR>
          </THead>
          <TBody>
            {TEAM.map((m) => (
              <TR key={m.email}>
                <TD>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-[11px] text-app-muted">{m.email}</div>
                </TD>
                <TD>{m.role}</TD>
                <TD>
                  <Badge tone={m.status === "active" ? "success" : "warning"}>
                    {m.status}
                  </Badge>
                </TD>
                <TD className="text-app-muted">{m.last}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="text-[15px] font-semibold">Role permissions</h2>
        <p className="text-[12px] text-app-muted">
          Granular controls. Customize per-role on Pro & Enterprise plans.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-app-border text-left text-[11px] uppercase text-app-muted">
                <th className="py-2 pr-4">Capability</th>
                {ROLES.map((r) => (
                  <th key={r} className="py-2 pr-4">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Create claims", true, true, true, true, true, false],
                ["Upload files", true, true, true, true, true, false],
                ["Generate reports", true, true, true, false, false, false],
                ["Manage team", true, true, false, false, false, false],
                ["Billing & plans", true, false, false, false, false, false],
              ].map((row) => (
                <tr key={row[0] as string} className="border-b border-app-border last:border-0">
                  <td className="py-2 pr-4 font-medium">{row[0]}</td>
                  {row.slice(1).map((v, i) => (
                    <td key={i} className="py-2 pr-4">
                      {v ? "✓" : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
