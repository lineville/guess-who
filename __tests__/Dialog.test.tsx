import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Dialogue from "@/components/Dialogue";

describe("Dialogue", () => {
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
});
