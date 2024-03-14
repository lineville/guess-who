import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import GuessCharacterModal from "@/components/GuessCharacterModal";
import { act } from "react-dom/test-utils";
import { GameType } from "@/lib/gameType";

const mockOnGuess = jest.fn();
const mockOnClose = jest.fn();

describe("GuessCharacterModal", () => {
  it("renders the GuessCharacterModal component", () => {
    const characters = [
      {
        name: "Marcus",
        alive: true,
      },
      {
        name: "Jing",
        alive: false,
      },
    ];

    render(
      <GuessCharacterModal
        isOpen={true}
        onClose={mockOnClose}
        onGuess={mockOnGuess}
        remainingCharacters={characters}
        gameType={GameType.Pixar}
      />
    );

    const modal = screen.getByText("Guess the character!");
    expect(modal).toBeInTheDocument();
  });

  it("handles the guess character button", async () => {
    const characters = [
      {
        name: "Marcus",
        alive: true,
      },
      {
        name: "Jing",
        alive: false,
      },
    ];

    render(
      <GuessCharacterModal
        isOpen={true}
        onClose={mockOnClose}
        onGuess={mockOnGuess}
        remainingCharacters={characters}
        gameType={GameType.Pixar}
      />
    );

    const selectCharacterButton = screen.getByRole("button", {
      name: "Select Character",
    });
    expect(selectCharacterButton).toBeInTheDocument();

    act(() => {
      selectCharacterButton.click();
      const firstCharacter = screen.getByText("Marcus");
      expect(firstCharacter).toBeInTheDocument();
      firstCharacter.click();
    });

    const guessButton = screen.getByRole("button", { name: "Guess" });
    expect(guessButton).toBeInTheDocument();

    await act(async () => {
      await guessButton.click();
    });

    expect(mockOnGuess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
