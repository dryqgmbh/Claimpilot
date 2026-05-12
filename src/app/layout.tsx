import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScopePilot — Pre-audit your restoration claim before the carrier does",
  description:
    "ScopePilot is an AI-powered claim QA layer for US restoration contractors. Find missing photos, weak line items and documentation gaps before submission.",
  metadataBase: new URL("https://scopepilot.ai"),
  openGraph: {
    title: "ScopePilot.ai",
    description:
      "Pre-audit your restoration claim before the carrier does.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
