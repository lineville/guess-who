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
          <Container
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgSize={"cover"}
            top={0}
            bottom={0}
            overflow={'auto'}
            pos={"fixed"}
            bgPos={"center"}
            centerContent
            maxW="100%"
          >
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
