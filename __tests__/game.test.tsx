import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Game from "@/components/Game";
// import { socket } from "@/lib/socket";

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
  useToast: jest.fn(),
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

jest.mock("../src/lib/socket", () => ({
  socket: jest.fn().mockReturnValue({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  }),
}));

describe("Game", () => {
  it("renders the Game component", () => {
    render(<Game clientId={mockClientId} />);

    const gameContainer = screen.getByTestId("game-container");
    expect(gameContainer).toBeInTheDocument();
  });
});
