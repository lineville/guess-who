"use client";
import "@fontsource/fredoka";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "Fredoka, Arial, sans-serif",
    body: "Fredoka, Arial, sans-serif",
  },
  // styles: {
  //   global: {
  //     'body': {
  //       background: "linear-gradient(300deg,deepskyblue,darkviolet,blue)",
  //       "background-size": "100% 100%",
  //     },
  //   },
  // },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  );
}
