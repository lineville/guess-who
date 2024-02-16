import { Heading } from "@chakra-ui/react";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps): JSX.Element {
  return (
    <Heading mt={4} mb={4} textAlign="center">
      {title}
    </Heading>
  );
}
