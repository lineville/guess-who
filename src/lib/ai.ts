/**
 * AI logic for single player mode in Guess Who game.
 */

export default class AI {
  constructor(private characters: string[], private yourCharacter: string) {}

  /**
   * Generates a random question from a predefined list.
   */
  askQuestion(): string {
    const questions = [
      "Do you wear glasses?",
      "Do you have blue eyes?",
      "Are you wearing a hat?",
      "Do you have facial hair?",
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  /**
   * Randomly answers yes or no to a question.
   */
  answerQuestion(): string {
    return Math.random() < 0.5 ? "Yes" : "No";
  }

  /**
   * Makes a guess at the player's character.
   */
  guessCharacter(): string {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }
}
