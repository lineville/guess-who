import { GameType } from "./gameType";

export const formatMenuItem = (str: string): string => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const menuItemImage = (gameType: GameType): string => {
  switch (gameType) {
    case GameType.Pixar:
      return "/pixar/Tonto.png";
    case GameType.SuperHeroes:
      return "/super-heroes/Hulk.png";
  }
  return "/pixar/Tonto.png";
};