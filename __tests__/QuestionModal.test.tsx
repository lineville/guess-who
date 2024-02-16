import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import QuestionModal from "@/components/QuestionModal";

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

describe("QuestionModal", () => {
  it("renders the QuestionModal component", () => {
    render(
      <QuestionModal
        isOpen={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onAsk={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const heading = screen.getByText("Your turn to ask a question!");
    expect(heading).toBeInTheDocument();
  });
});
