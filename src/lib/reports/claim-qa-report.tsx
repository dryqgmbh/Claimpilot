import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { colors, styles } from "./styles";
import { bandLabel, scoreBand } from "@/lib/scoring";
import type { Claim } from "@/types";

export function ClaimQAReportPDF({ claim }: { claim: Claim }) {
  const band = scoreBand(claim.score);
  const bandColor =
    band === "submission-ready" || band === "strong"
      ? colors.success
      : band === "needs-review"
        ? colors.warning
        : colors.risk;

  const top = [...claim.findings]
    .sort((a, b) => sev(b.severity) - sev(a.severity))
    .slice(0, 10);

  const open = claim.missing.filter((m) => m.status === "open");

  return (
    <Document
      title={`Claim QA Report ${claim.number}`}
      author="ScopePilot.ai"
      subject="Internal claim quality audit"
    >
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              ScopePilot
              <Text style={styles.brandDot}>.ai</Text>
            </Text>
            <Text style={styles.small}>Claim QA Report</Text>
          </View>
          <View style={styles.metaRight}>
            <Text>{claim.number}</Text>
            <Text>{claim.address}</Text>
            <Text>
              {claim.carrier}
              {claim.claim_number_carrier ? ` · ${claim.claim_number_carrier}` : ""}
            </Text>
            <Text>Generated {fmt(new Date().toISOString())}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{claim.policyholder}</Text>
        <Text style={styles.subtitle}>
          {claim.type.toUpperCase()}
          {claim.cat ? ` · Cat ${claim.cat}` : ""} · Loss {fmt(claim.loss_date)}{" "}
          · {claim.cause_of_loss}
        </Text>

        {/* Score block */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 16,
              minWidth: 140,
            }}
          >
            <Text style={styles.small}>Claim Quality Score</Text>
            <Text style={{ ...styles.scoreBig, color: bandColor, marginTop: 4 }}>
              {Math.round(claim.score)}
            </Text>
            <View
              style={{
                ...styles.badge,
                ...(band === "submission-ready" || band === "strong"
                  ? styles.badgeSuccess
                  : band === "needs-review"
                    ? styles.badgeWarning
                    : styles.badgeRisk),
                alignSelf: "flex-start",
                marginTop: 6,
              }}
            >
              <Text>{bandLabel(band)}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <Text style={styles.sectionTitle}>Executive summary</Text>
            <Text style={styles.body}>
              This {claim.type} claim currently scores{" "}
              {Math.round(claim.score)} / 100. {open.length} documentation
              items remain open across photos, logs and narrative.{" "}
              {claim.findings.filter((f) =>
                ["critical", "high"].includes(f.severity),
              ).length}{" "}
              high-severity findings were detected. Findings are
              evidence-bound and exclude pricing and coverage opinions. The
              contractor remains responsible for the final submission to{" "}
              {claim.carrier}.
            </Text>
          </View>
        </View>

        {/* Sub-scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sub-score breakdown</Text>
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text style={{ ...styles.th, flex: 4 }}>Component</Text>
              <Text style={{ ...styles.th, flex: 1, textAlign: "right" }}>
                Weight
              </Text>
              <Text style={{ ...styles.th, flex: 1, textAlign: "right" }}>
                Score
              </Text>
            </View>
            {claim.sub_scores.map((s, i) => (
              <View
                key={s.key}
                style={[
                  styles.tableRow,
                  i === claim.sub_scores.length - 1
                    ? { borderBottomWidth: 0 }
                    : {},
                ]}
              >
                <Text style={{ ...styles.td, flex: 4 }}>{s.label}</Text>
                <Text style={{ ...styles.td, flex: 1, textAlign: "right" }}>
                  {(s.weight * 100).toFixed(0)}%
                </Text>
                <Text
                  style={{
                    ...styles.td,
                    flex: 1,
                    textAlign: "right",
                    color:
                      s.value >= 80
                        ? colors.success
                        : s.value >= 60
                          ? colors.warning
                          : colors.risk,
                    fontFamily: "Helvetica-Bold",
                  }}
                >
                  {Math.round(s.value)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top findings */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Top findings</Text>
          {top.map((f) => (
            <View key={f.id} style={styles.card} wrap={false}>
              <View style={styles.row}>
                <Text style={styles.bodyBold}>{f.message}</Text>
                <View
                  style={[
                    styles.badge,
                    f.severity === "critical" || f.severity === "high"
                      ? styles.badgeRisk
                      : f.severity === "medium"
                        ? styles.badgeWarning
                        : styles.badgeSuccess,
                  ]}
                >
                  <Text>
                    {f.severity} · {f.confidence}%
                  </Text>
                </View>
              </View>
              <Text style={styles.small}>
                Suggested: {f.suggested_action}
              </Text>
            </View>
          ))}
        </View>

        {/* Missing docs */}
        {open.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>
              Open documentation items ({open.length})
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHead}>
                <Text style={{ ...styles.th, flex: 6 }}>Item</Text>
                <Text style={{ ...styles.th, flex: 2 }}>Category</Text>
                <Text style={{ ...styles.th, flex: 1, textAlign: "right" }}>
                  Severity
                </Text>
              </View>
              {open.map((m, i) => (
                <View
                  key={m.id}
                  style={[
                    styles.tableRow,
                    i === open.length - 1 ? { borderBottomWidth: 0 } : {},
                  ]}
                >
                  <Text style={{ ...styles.td, flex: 6 }}>{m.label}</Text>
                  <Text style={{ ...styles.td, flex: 2 }}>{m.category}</Text>
                  <Text
                    style={{
                      ...styles.td,
                      flex: 1,
                      textAlign: "right",
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
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Adjuster forecast */}
        {claim.questions.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Adjuster question forecast</Text>
            {claim.questions.slice(0, 8).map((q) => (
              <View key={q.id} style={styles.card} wrap={false}>
                <Text style={styles.bodyBold}>“{q.question}”</Text>
                <Text style={[styles.small, { marginTop: 4 }]}>
                  Why: {q.rationale}
                </Text>
                <Text style={[styles.small, { marginTop: 2 }]}>
                  Suggested pre-answer: {q.pre_answer_hint}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer footer */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `ScopePilot.ai · Documentation QA tool · Not a public adjuster · Findings based solely on uploaded materials · Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

function sev(s: string) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[s] ?? 0;
}

function fmt(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
