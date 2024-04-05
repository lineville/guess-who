import { renderHook, act } from "@testing-library/react-hooks";
import { useSocket } from "@/hooks/useSocket";
import * as SocketLib from "@/lib/socket";
import { GameType } from "@/lib/gameType";
import { GameMode } from "@/lib/gameMode";

const mockGameId = "123e4567-e89b-12d3-a456-426614174000";
const mockClientId = "123e4567-e89b-12d3-a456-426614174001";
const mockRouterPush = jest.fn();

const mockSocket = {
  on: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock("@/lib/socket", () => ({
  socket: jest.fn(() => mockSocket),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: "",
    asPath: "/",
    push: mockRouterPush,
  }),
  usePathname: jest.fn(() => `/game/${mockGameId}`),
}));

describe("useSocket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation((msg: string) => {
      if (
        msg.includes(
          "Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17."
        )
      ) {
        return;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a socket connection on mount", () => {
    renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    expect(SocketLib.socket).toHaveBeenCalledWith(
      mockGameId,
      mockClientId,
      GameType.Pixar,
      GameMode.MultiPlayer
    );
  });

  it("should disconnect the socket connection on unmount", () => {
    const { unmount } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    unmount();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it("should set the socket connection", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    expect(result.current.socketConnection).toBe(mockSocket);
  });

  it("should set the your character", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    act(() => {
      mockSocket.on.mock.calls[0][1]({
        yourCharacter: "character",
        characters: [],
      });
    });
    expect(result.current.yourCharacter).toBe("character");
  });

  it("should set the board", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    act(() => {
      mockSocket.on.mock.calls[0][1]({
        characters: ["character"],
      });
    });
    expect(result.current.board).toEqual([
      { name: "character", image: "/character.png", alive: true },
    ]);
  });

  it("should set the turn", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    act(() => {
      mockSocket.on.mock.calls[0][1]({
        turn: mockClientId,
      });
    });
    expect(result.current.isMyTurn).toBe(true);
  });

  it("should set the dialogues", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    act(() => {
      mockSocket.on.mock.calls[0][1]({
        dialogues: ["dialogue"],
      });
    });
    expect(result.current.dialogues).toEqual(["dialogue"]);
  });

  it("should set the winner", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    act(() => {
      mockSocket.on.mock.calls[0][1]({
        winner: "winner",
      });
    });
    expect(result.current.winner).toBe("winner");
  });

  it("should set isAsking", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    act(() => {
      mockSocket.on.mock.calls[0][1]({
        isAsking: true,
      });
    });
    expect(result.current.isAsking).toBe(true);
  });

  it("should set the player count", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );
    act(() => {
      mockSocket.on.mock.calls[0][1]({
        playerCount: 1,
      });
    });
    expect(result.current.playerCount).toBe(1);
  });

  it("should handle the turn event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const turnCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "turn"
    )[1];

    act(() => {
      turnCallback(mockClientId);
    });

    expect(result.current.isMyTurn).toBe(true);
  });

  it("should handle the eliminate event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const initCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "init"
    )[1];

    const eliminateCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "eliminate"
    )[1];

    act(() => {
      initCallback({
        yourCharacter: "character",
        characters: ["Miles", "Jing"],
        eliminatedCharacters: [],
      });
      eliminateCallback(new Set([0]));
    });

    expect(result.current.board[0].alive).toBeFalsy();
  });

  it("should handle the revive event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const initCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "init"
    )[1];

    const eliminateCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "eliminate"
    )[1];

    const reviveCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "revive"
    )[1];

    act(() => {
      initCallback({
        yourCharacter: "character",
        characters: ["Miles", "Jing"],
        eliminatedCharacters: [0],
      });
    });

    act(() => {
      eliminateCallback(new Set([0]));
    });

    expect(result.current.board[0].alive).toBeFalsy();

    act(() => {
      reviveCallback(new Set([1]));
    });

    expect(result.current.board[0].alive).toBeTruthy();
  });

  it("should handle the eliminated-count event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const initCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "init"
    )[1];

    const eliminatedCountCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "eliminated-count"
    )[1];

    act(() => {
      initCallback({});
      eliminatedCountCallback(1);
    });

    expect(result.current.opponentRemainingCharacters).toBe(23);
  });

  it("should handle the playerCount event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const playerCountCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "playerCount"
    )[1];

    act(() => {
      playerCountCallback(1);
    });

    expect(result.current.playerCount).toBe(1);
  });

  it("should handle the ask event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const askCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "ask"
    )[1];

    act(() => {
      askCallback("Are you a fun person to be around?");
    });

    expect(result.current.isMyTurn).toBeTruthy();
    expect(result.current.isAsking).toBeFalsy();
    expect(result.current.dialogues[0].content).toBe(
      "Are you a fun person to be around?"
    );
  });

  it("should handle the answer event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const answerCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "answer"
    )[1];

    act(() => {
      answerCallback("Yes");
    });

    expect(result.current.isMyTurn).toBeFalsy();
    expect(result.current.dialogues[0].content).toBe("Yes");
  });

  it("should handle the winner event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const winnerCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "winner"
    )[1];

    act(() => {
      winnerCallback("Miles");
    });

    expect(result.current.winner).toBe("Miles");
  });

  it("should handle the bad-guess event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const badGuessCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "bad-guess"
    )[1];

    act(() => {
      badGuessCallback("Miles");
    });

    expect(result.current.dialogues[0].content).toBe(
      "Your opponent incorrectly guessed that you were Miles"
    );
  });

  it("should handle the ready event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const newGameCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "ready"
    )[1];

    act(() => {
      newGameCallback();
    });

    expect(result.current.opponentReady).toBeTruthy();
  });

  it("should handle the new-game event", () => {
    renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const newGameCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "new-game"
    )[1];

    act(() => {
      newGameCallback(mockGameId);
    });

    expect(mockRouterPush).toHaveBeenCalledWith(`/game/${mockGameId}`);
  });

  it("should handle the error event", () => {
    const { result } = renderHook(() =>
      useSocket(mockGameId, mockClientId, GameType.Pixar, GameMode.MultiPlayer)
    );

    const errorCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === "error"
    )[1];

    act(() => {
      errorCallback("error");
    });

    expect(result.current.errorMessage).toBe("error");
  });
});
