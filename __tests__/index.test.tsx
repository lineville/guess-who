import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";
import Header from "@/components/Header";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: "",
    asPath: "/",
    push: mockPush,
  }),
}));

describe("Header", () => {
  it("renders a header with the correct text", () => {
    render(<Header title="Guess Who?"/>);

    const heading = screen.getByText("Guess Who?");
    expect(heading).toBeInTheDocument();
  });
});

describe("Home", () => {
  it("renders a new game button", () => {
    render(<Home />);

    const heading = screen.getByText("New Game");
    expect(heading).toBeInTheDocument();
  });

  it("has a clickable button", () => {
    render(<Home />);

    const button = screen.getByRole("button", { name: /New Game/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalled();
  });
});
