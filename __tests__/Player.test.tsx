import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Player from "@/components/Player";

describe("Player", () => {
  it("renders the Player component", () => {
    const character = "Marcus";
    render(
      <Player
        character={character}
        isMyTurn={false}
        remainingCharacters={0}
        secret={false}
      />
    );

    const avatar = screen.getByRole("img", { name: character });
    expect(avatar).toBeInTheDocument();
  });
});
