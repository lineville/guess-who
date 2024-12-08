import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Board from "@/components/Board";
import { GameType } from "@/lib/gameType";

describe("Board", () => {
  it("renders the Board component", () => {
    render(
      <Board
        board={[]}
        handleEliminateCharacter={function (): void {
          throw new Error("Function not implemented.");
        }}
        columns={6}
        handleGuessCharacter={function (index: number): void {
          throw new Error("Function not implemented.");
        }}
        handleReviveCharacter={function (index: number): void {
          throw new Error("Function not implemented.");
        }}
        gameType={GameType.Pixar}
      />
    );

    const board = screen.getByTestId("board");
    expect(board).toBeInTheDocument();
  });
});
