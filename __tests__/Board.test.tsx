import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Board from "@/components/Board";

describe("Board", () => {
  it("renders the Board component", () => {
    render(
      <Board
        board={[]}
        handleClickCharacter={function (): void {
          throw new Error("Function not implemented.");
        }}
        columns={6}
      />
    );

    const board = screen.getByTestId("board");
    expect(board).toBeInTheDocument();
  });
});
