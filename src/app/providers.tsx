"use client";
import "@fontsource/monaspace-neon/300.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "Monaspace Neon",
    body: "Monaspace Neon",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  );
}
