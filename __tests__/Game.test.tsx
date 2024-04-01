import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Game from "@/components/Game";
import React from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import { socket } from "@/lib/socket";
import * as hooks from "@/hooks/useSocket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

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
  usePathname: jest.fn(() => `/game/pixar/${mockGameId}`),
}));

jest.mock("@/hooks/useSocket");
let defaultMockImplementation: {
  socketConnection: Socket<DefaultEventsMap, DefaultEventsMap>;
  yourCharacter: string;
  board: never[];
  isMyTurn: boolean;
  dialogues: never[];
  winner: null;
  isAsking: boolean;
  opponentRemainingCharacters: number;
  yourRemainingCharacters: number;
  playerCount: number;
  opponentReady: boolean;
  errorMessage: string;
  setIsAsking: jest.Mock<any, any, any>;
  setDialogues: jest.Mock<any, any, any>;
  setWinner: jest.Mock<any, any, any>;
  setIsMyTurn: jest.Mock<any, any, any>;
  router: { push: jest.Mock<any, any, any> };
};

describe("Game", () => {
  beforeEach(() => {
    defaultMockImplementation = {
      socketConnection: socket(mockGameId, mockClientId),
      yourCharacter: "",
      board: [],
      isMyTurn: false,
      dialogues: [],
      winner: null,
      isAsking: false,
      opponentRemainingCharacters: 24,
      yourRemainingCharacters: 24,
      playerCount: 1,
      opponentReady: false,
      errorMessage: "",
      setIsAsking: jest.fn(),
      setDialogues: jest.fn(),
      setWinner: jest.fn(),
      setIsMyTurn: jest.fn(),
      router: {
        push: jest.fn(),
      },
    };

    (hooks.useSocket as jest.Mock).mockImplementation(
      () => defaultMockImplementation
    );

    (useBreakpointValue as jest.Mock).mockReturnValue(false);
  });

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

    const chatButton = screen.getByLabelText("Open drawer");
    expect(chatButton).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    const errorMessage =
      "🚧 Uh oh! Looks like the game you tried to join is already full...";

    (hooks.useSocket as jest.Mock).mockImplementation(() => ({
      ...defaultMockImplementation,
      errorMessage: errorMessage,
    }));

    render(<Game clientId={mockClientId} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders different content based on player count", () => {

    const { rerender } = render(<Game clientId={mockClientId} />);
    expect(screen.getByText("Invite a Friend!")).toBeInTheDocument();

    (hooks.useSocket as jest.Mock).mockImplementation(() => ({
      ...defaultMockImplementation,
      playerCount: 1,
    }));

    rerender(<Game clientId={mockClientId} />);
    expect(
      screen.getByText("Waiting on opponent to join...")
    ).toBeInTheDocument();
  });
});
