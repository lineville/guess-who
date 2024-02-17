import { Providers } from "./providers";
import { Container, Spacer } from "@chakra-ui/react";
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
      <body style={{ WebkitOverflowScrolling: "touch" }}>
        <Providers>
          <Container maxW="100vw">
            <Header title={metadata.title as string} />
            <Spacer />
            {children}
            <Analytics />
            <SpeedInsights />
          </Container>
        </Providers>
      </body>
    </html>
  );
}
