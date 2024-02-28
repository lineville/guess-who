import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Instructions from "@/components/Instructions";
import { useBreakpointValue } from "@chakra-ui/react";

jest.mock("@chakra-ui/react", () => {
  return {
    ...jest.requireActual("@chakra-ui/react"),
    useBreakpointValue: jest.fn(() => false),
  };
});

describe("Instructions", () => {
  it("renders the Instructions component", () => {
    render(<Instructions />);
    const instructions = screen.getByText("How it works");
    expect(instructions).toBeInTheDocument();
  });

  it("renders the Instructions component on mobile", () => {
    (useBreakpointValue as jest.Mock).mockReturnValue(true);

    render(<Instructions />);
    const instructions = screen.getByText("How it works");
    expect(instructions).toBeInTheDocument();
  });
});
