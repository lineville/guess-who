"use client";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Heading, IconButton, useColorMode } from "@chakra-ui/react";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <IconButton
        onClick={toggleColorMode}
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        aria-label={"dark-mode-toggle"}
        isRound={true}
        variant="solid"
        position="fixed"
        top="1em"
        left="1em"
      />
      <Heading mt={4} mb={4} textAlign="center" size="2xl">
        {title}
      </Heading>
    </>
  );
}
