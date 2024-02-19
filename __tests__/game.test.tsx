import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Game from "@/components/Game";
import React from "react";
import { useBreakpointValue } from "@chakra-ui/react";

const mockGameId = "123e4567-e89b-12d3-a456-426614174000";
const mockClientId = "123e4567-e89b-12d3-a456-426614174001";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(() => false),
  useColorMode: jest.fn(() => ({ colorMode: "light" })),
  useDisclosure: jest.fn(() => ({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  })),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: "",
    asPath: "/",
  }),
  usePathname: jest.fn(() => `/game/${mockGameId}`),
}));

jest.mock("../src/hooks/useSocket", () => ({
  useSocket: () => ({
    isMyTurn: true,
    playerCount: 2,
    errorMessage: "",
    dialogues: [],
    board: [],
  }),
}));

describe("Game", () => {
  it("renders the Game component", () => {
    render(<Game clientId={mockClientId} />);

    const gameContainer = screen.getByTestId("game-container");
    expect(gameContainer).toBeInTheDocument();
  });

  it("renders the Game component on mobile", () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true);

    render(<Game clientId={mockClientId} />);

    const gameContainer = screen.getByTestId("game-container");
    expect(gameContainer).toBeInTheDocument();

    const hamburgerButton = screen.getByLabelText("Open drawer");
    expect(hamburgerButton).toBeInTheDocument();
  });

});
