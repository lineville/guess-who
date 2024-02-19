import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Instructions from "@/components/Instructions";

jest.mock("@chakra-ui/react", () => {
  return {
    ...jest.requireActual("@chakra-ui/react"),
    useBreakpointValue: jest.fn(() => true),
    useColorMode: jest.fn(() => ({ colorMode: "light" })),
  };
});

describe("Instructions", () => {
  it("renders the Instructions component", () => {
    render(<Instructions />);
    const instructions = screen.getByText("How it works");
    expect(instructions).toBeInTheDocument();
  });
});
