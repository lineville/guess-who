import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Dialogue from "@/components/Dialogue";

describe("Dialogue", () => {
  beforeEach(() => {
    Object.defineProperty(global.navigator, "clipboard", {
      value: {
        writeText: jest.fn(),
      },
      writable: true,
    });
  });

  it("renders the Dialog component", () => {
    render(
      <Dialogue
        playerCount={0}
        yourCharacter={""}
        isMyTurn={false}
        isAsking={false}
        winner={""}
        userId={""}
        yourRemainingCharacters={0}
        opponentRemainingCharacters={0}
        dialogues={[]}
        handleOpenQuestionModal={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleOpenAnswerModal={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleGuessCharacter={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  });

  it("has a clickable copy invite button", async () => {
    render(
      <Dialogue
        playerCount={1}
        yourCharacter={""}
        isMyTurn={false}
        isAsking={false}
        winner={""}
        userId={""}
        yourRemainingCharacters={0}
        opponentRemainingCharacters={0}
        dialogues={[]}
        handleOpenQuestionModal={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleOpenAnswerModal={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleGuessCharacter={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const copyInviteButton = screen.getByLabelText("copy invite link");
    expect(copyInviteButton).toBeInTheDocument();
    expect(copyInviteButton).toBeEnabled();

    expect(screen.getByTestId("copy")).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(copyInviteButton);
    });

    expect(screen.getByTestId("check")).toBeInTheDocument();
  });

  it("renders the correct number of secret characters", () => {
    render(
      <Dialogue
        playerCount={2}
        yourCharacter={""}
        isMyTurn={false}
        isAsking={false}
        winner={""}
        userId={""}
        yourRemainingCharacters={24}
        opponentRemainingCharacters={20}
        dialogues={[]}
        handleOpenQuestionModal={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleOpenAnswerModal={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleGuessCharacter={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const secretCharacters = screen.getAllByRole("img");
    expect(secretCharacters).toHaveLength(2);
  });

  it("renders the correct buttons in the footer", () => {
    render(
      <Dialogue
        playerCount={2}
        yourCharacter={""}
        isMyTurn={true}
        isAsking={true}
        winner={""}
        userId={""}
        yourRemainingCharacters={24}
        opponentRemainingCharacters={20}
        dialogues={[]}
        handleOpenQuestionModal={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleOpenAnswerModal={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleGuessCharacter={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
});
