import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AnswerModal from "@/components/AnswerModal";
import { m } from "framer-motion";
import { act } from "react-dom/test-utils";

const mockOnAnswer = jest.fn();
const mockOnClose = jest.fn();

describe("AnswerModal", () => {
  it("renders the AnswerModal component", () => {
    const question = "Is this a test?";
    render(
      <AnswerModal
        isOpen={true}
        onClose={mockOnClose}
        onAnswer={mockOnAnswer}
        question={question}
      />
    );

    const modal = screen.getByText(question);
    expect(modal).toBeInTheDocument();
  });

  it("handles the answer button", async () => {
    const question = "Is this a test?";
    render(
      <AnswerModal
        isOpen={true}
        onClose={mockOnClose}
        onAnswer={mockOnAnswer}
        question={question}
      />
    );

    const yesOption = screen.getByText("Yes");
    expect(yesOption).toBeInTheDocument();

    const noOption = screen.getByText("No");
    expect(noOption).toBeInTheDocument();

    await act(async () => {
      yesOption.click();
      const answerButton = screen.getByRole("button", { name: "Answer" });
      await answerButton.click();
    });

    expect(mockOnAnswer).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
