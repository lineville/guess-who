import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import GuessCharacterModal from "@/components/GuessCharacterModal";

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
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onGuess={function (): void {
          throw new Error("Function not implemented.");
        }}
        remainingCharacters={characters}
      />
    );

    const modal = screen.getByText("Guess the character!");
    expect(modal).toBeInTheDocument();
  });
});
