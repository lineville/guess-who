import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AnswerModal from "@/components/AnswerModal";

describe("AnswerModal", () => {
  it("renders the AnswerModal component", () => {
    const question = "Is this a test?";
    render(
      <AnswerModal
        isOpen={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onAnswer={function (): void {
          throw new Error("Function not implemented.");
        }}
        question={question}
      />
    );

    const modal = screen.getByText(question);
    expect(modal).toBeInTheDocument();
  });
});
