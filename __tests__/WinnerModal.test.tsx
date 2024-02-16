import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import WinnerModal from "@/components/WinnerModal";

const clientId = "123e4567-e89b-12d3-a456-426614174000";
const opponentClientId = "123e4567-e89b-12d3-a456-426614174001";
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: "",
    asPath: "/",
    push: mockPush,
  }),
}));

describe("WinnerModal", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => clientId),
      },
      writable: true,
    });
  });

  it("retrieves the clientId from localStorage", () => {
    render(
      <WinnerModal
        winner={""}
        isOpen={false}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleReady={function (): void {
          throw new Error("Function not implemented.");
        }}
        opponentReady={false}
      />
    );

    expect(window.localStorage.getItem).toHaveBeenCalledWith("clientId");
  });

  it("renders the WinnerModal component for the winner", () => {
    render(
      <WinnerModal
        winner={clientId}
        isOpen={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleReady={function (): void {
          throw new Error("Function not implemented.");
        }}
        opponentReady={false}
      />
    );

    expect(
      screen.getByText("🎉 You nailed it! Nice guess, you won this round!")
    ).toBeInTheDocument();
  });

  it("renders the WinnerModal component for the loser", () => {
    render(
      <WinnerModal
        winner={opponentClientId}
        isOpen={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleReady={function (): void {
          throw new Error("Function not implemented.");
        }}
        opponentReady={false}
      />
    );

    expect(
      screen.getByText(
        "😭 Your opponent guessed you... You'll get the next one!"
      )
    ).toBeInTheDocument();
  });

  it("renders the waiting text when the opponent is ready", () => {
    render(
      <WinnerModal
        winner={opponentClientId}
        isOpen={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleReady={function (): void {
          throw new Error("Function not implemented.");
        }}
        opponentReady={true}
      />
    );

    expect(
      screen.getByText("Opponent is waiting on you to ready up...")
    ).toBeInTheDocument();
  });

  it("renders the play again button when the player is ready", () => {
    render(
      <WinnerModal
        winner={clientId}
        isOpen={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleReady={function (): void {
          throw new Error("Function not implemented.");
        }}
        opponentReady={false}
      />
    );

    expect(
      screen.getByRole("button", { name: /Play Again/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Back to Lobby/i })
    ).toBeInTheDocument();
  });

  it("calls the handleReady function when the play again button is clicked", async () => {
    const handleReady = jest.fn();
    render(
      <WinnerModal
        winner={clientId}
        isOpen={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleReady={handleReady}
        opponentReady={false}
      />
    );

    const playAgainButton = screen.getByRole("button", { name: /Play Again/i });
    await act(async () => {
      fireEvent.click(playAgainButton);
    });

    expect(handleReady).toHaveBeenCalled();
  });

  it("redirects to the lobby when the back to lobby button is clicked", async () => {
    const onClose = jest.fn();
    render(
      <WinnerModal
        winner={clientId}
        isOpen={true}
        onClose={onClose}
        handleReady={function (): void {
          throw new Error("Function not implemented.");
        }}
        opponentReady={false}
      />
    );

    const backToLobbyButton = screen.getByRole("button", {
      name: /Back to Lobby/i,
    });

    await act(async () => {
      fireEvent.click(backToLobbyButton);
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
