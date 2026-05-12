import { Document, Page, Text, View } from "@react-pdf/renderer";
import { colors, styles } from "./styles";
import type { Claim } from "@/types";

export function MissingDocsReportPDF({ claim }: { claim: Claim }) {
  const open = claim.missing.filter((m) => m.status === "open");
  const grouped = group(open, (m) => m.assignee ?? "Unassigned");

  return (
    <Document title={`Missing Docs ${claim.number}`} author="ScopePilot.ai">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              ScopePilot
              <Text style={styles.brandDot}>.ai</Text>
            </Text>
            <Text style={styles.small}>Missing Documentation Report</Text>
          </View>
          <View style={styles.metaRight}>
            <Text>{claim.number}</Text>
            <Text>{claim.address}</Text>
            <Text>Generated {fmt(new Date().toISOString())}</Text>
          </View>
        </View>

        <Text style={styles.title}>{claim.policyholder}</Text>
        <Text style={styles.subtitle}>
          {open.length} open documentation items · grouped by assignee
        </Text>

        {Object.entries(grouped).map(([assignee, items]) => (
          <View key={assignee} style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{assignee}</Text>
            <View style={styles.table}>
              <View style={styles.tableHead}>
                <Text style={{ ...styles.th, flex: 6 }}>Item</Text>
                <Text style={{ ...styles.th, flex: 2 }}>Category</Text>
                <Text style={{ ...styles.th, flex: 2 }}>Severity</Text>
                <Text style={{ ...styles.th, flex: 2 }}>Due</Text>
              </View>
              {items.map((m, i) => (
                <View
                  key={m.id}
                  style={[
                    styles.tableRow,
                    i === items.length - 1 ? { borderBottomWidth: 0 } : {},
                  ]}
                >
                  <Text style={{ ...styles.td, flex: 6 }}>{m.label}</Text>
                  <Text style={{ ...styles.td, flex: 2 }}>{m.category}</Text>
                  <Text
                    style={{
                      ...styles.td,
                      flex: 2,
                      color:
                        m.severity === "critical" || m.severity === "high"
                          ? colors.risk
                          : m.severity === "medium"
                            ? colors.warning
                            : colors.muted,
                    }}
                  >
                    {m.severity}
                  </Text>
                  <Text style={{ ...styles.td, flex: 2 }}>
                    {m.due_at ? fmt(m.due_at) : "—"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `ScopePilot.ai · Documentation QA tool · Not a public adjuster · Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

function group<T>(arr: T[], by: (t: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const x of arr) {
    const k = by(x);
    (out[k] ??= []).push(x);
  }
  return out;
}

function fmt(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
