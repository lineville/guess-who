import { Providers } from "./providers";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Guess Who?",
  description: "Guess Who?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        style={{
          WebkitOverflowScrolling: "touch",
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Providers>
          <Header title="Guess Who" />
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
