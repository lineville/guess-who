import "@/styles/globals.css";
import { Container, useColorMode } from "@chakra-ui/react";

export default function GradientBackground({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Container
      bgGradient={
        colorMode === "dark"
          ? "linear-gradient(90deg, hsla(197, 100%, 63%, 1) 0%, hsla(294, 100%, 55%, 1) 100%)"
          : "linear-gradient(90deg, hsla(311, 74%, 87%, 1) 0%, hsla(275, 19%, 88%, 1) 100%)"
      }
      bgSize={"400% 400%"}
      animation={"gradient 5s ease infinite"}
      top={0}
      bottom={0}
      overflow={"auto"}
      pos={"fixed"}
      bgPos={"center"}
      centerContent
      maxW="100%"
    >
      {children}
    </Container>
  );
}
