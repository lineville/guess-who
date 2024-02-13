import type { Metadata } from "next";
import { Providers } from "./providers";
import { Container, Heading, Spacer } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
            <Heading mt={4} mb={4} textAlign="center">
              {metadata.title as string}
            </Heading>
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
