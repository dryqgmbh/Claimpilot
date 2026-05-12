import { Document, Page, Text, View } from "@react-pdf/renderer";
import { colors, styles } from "./styles";
import type { Claim } from "@/types";

export function AdjusterRiskReportPDF({ claim }: { claim: Claim }) {
  return (
    <Document title={`Adjuster Risk ${claim.number}`} author="ScopePilot.ai">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              ScopePilot
              <Text style={styles.brandDot}>.ai</Text>
            </Text>
            <Text style={styles.small}>Adjuster Risk Report</Text>
          </View>
          <View style={styles.metaRight}>
            <Text>{claim.number}</Text>
            <Text>
              {claim.carrier}
              {claim.adjuster_name ? ` · ${claim.adjuster_name}` : ""}
            </Text>
            <Text>Generated {fmt(new Date().toISOString())}</Text>
          </View>
        </View>

        <Text style={styles.title}>{claim.policyholder}</Text>
        <Text style={styles.subtitle}>
          {claim.questions.length} forecasted questions, with suggested
          pre-answers drawn from your evidence.
        </Text>

        {claim.questions.map((q, i) => (
          <View key={q.id} style={styles.card} wrap={false}>
            <View style={styles.row}>
              <Text style={styles.bodyBold}>
                Q{i + 1}. “{q.question}”
              </Text>
              <View
                style={[
                  styles.badge,
                  q.severity === "critical" || q.severity === "high"
                    ? styles.badgeRisk
                    : q.severity === "medium"
                      ? styles.badgeWarning
                      : styles.badgeSuccess,
                ]}
              >
                <Text>{q.severity}</Text>
              </View>
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.small}>Why we forecast this:</Text>
              <Text style={styles.body}>{q.rationale}</Text>
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.small}>Suggested pre-answer:</Text>
              <Text style={{ ...styles.body, color: colors.brand }}>
                {q.pre_answer_hint}
              </Text>
            </View>
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `ScopePilot.ai · Internal QA · Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

function fmt(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
