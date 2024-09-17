import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";
import Header from "@/components/Header";
import { Providers } from "@/app/providers";
import { formatMenuItem } from "@/lib/menuHelpers";

const mockPush = jest.fn();
const mockGameId = "123e4567-e89b-12d3-a456-426614174000";

jest.mock("uuid", () => ({ v4: jest.fn(() => mockGameId) }));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: "",
    asPath: "/",
    push: mockPush,
  }),
}));

jest.mock("@chakra-ui/react", () => {
  const chakra = jest.requireActual("@chakra-ui/react");

  return {
    ...chakra,
    useBreakpointValue: jest.fn(() => true),
  };
});

describe("Header", () => {
  it("renders a header with the correct text", () => {
    render(<Header title="Guess Who?" />);

    const heading = screen.getByText("Guess Who?");
    expect(heading).toBeInTheDocument();
  });
});

describe("Home", () => {
  it("renders a new game button", () => {
    render(
      <Providers>
        <Home />
      </Providers>
    );

    const heading = screen.getByText("Play");
    expect(heading).toBeInTheDocument();
  });

  it("has a clickable button", () => {
    render(
      <Providers>
        <Home />
      </Providers>
    );

    const button = screen.getByText("Play");
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/game/multi-player/pixar/${mockGameId}`);
  });
});

describe("formatMenuItem", () => {
  it("formats a string correctly", () => {
    const formatted = formatMenuItem("Pixar");
    expect(formatted).toEqual("Pixar");
  });

  it("formats a string correctly", () => {
    const formatted = formatMenuItem("single-player");
    expect(formatted).toEqual("Single Player");
  });
});
