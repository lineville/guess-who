import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import QuestionModal from "@/components/QuestionModal";
import userEvent from "@testing-library/user-event";

const mockPush = jest.fn();
const mockOnClose = jest.fn();
const mockOnAsk = jest.fn();

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
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("renders the QuestionModal component", () => {
    render(
      <QuestionModal isOpen={true} onClose={mockOnClose} onAsk={mockOnAsk} />
    );

    const heading = screen.getByText("Your turn to ask a question!");
    expect(heading).toBeInTheDocument();
  });

  it("handles the ask question button", async () => {
    render(
      <QuestionModal isOpen={true} onClose={mockOnClose} onAsk={mockOnAsk} />
    );

    const firstQuestion = screen.getByTestId("question-0");
    expect(firstQuestion).toBeInTheDocument();

    const askButton = screen.getByRole("button", { name: "Ask" });
    expect(askButton).toBeInTheDocument();
    expect(askButton).toBeDisabled();

    fireEvent.click(firstQuestion);
    await waitFor(() => expect(askButton).not.toBeDisabled());

    await act(async () => {
      await fireEvent.click(askButton);
    });

    expect(mockOnAsk).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles the Ask AI ✨ button", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          questions: [
            "Question 1",
            "Question 2",
            "Question 3",
            "Question 4",
            "Question 5",
          ],
        }),
    });

    render(
      <QuestionModal isOpen={true} onClose={mockOnClose} onAsk={mockOnAsk} />
    );

    const askAIButton = screen.getByRole("button", { name: "Ask AI ✨" });
    expect(askAIButton).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(askAIButton);
    });

    const questions = await screen.findAllByTestId(/question-\d/);
    await waitFor(() => expect(questions).toHaveLength(8));
  });

  it("throws an error when fetching AI questions fails", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("OpenAI Exception"));

    console.error = jest.fn();

    render(
      <QuestionModal isOpen={true} onClose={mockOnClose} onAsk={mockOnAsk} />
    );

    const askAIButton = screen.getByRole("button", { name: "Ask AI ✨" });
    expect(askAIButton).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(askAIButton);
    });

    expect(console.error).toHaveBeenCalledWith(
      "Failed to fetch AI questions:",
      new Error("OpenAI Exception")
    );
  });
});
