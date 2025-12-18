import type { Question } from "../types/games";

export const mockRounds: Question[] = [
  {
    questionText: "Name something people bring to a picnic",
    answers: [
      { text: "Basket", points: 35, isRevealed: false },
      { text: "Blanket", points: 25, isRevealed: false },
      { text: "Sandwiches", points: 15, isRevealed: false },
      { text: "Wine/Drinks", points: 12, isRevealed: false },
      { text: "Frisbee", points: 8, isRevealed: false },
      { text: "Ants", points: 5, isRevealed: false },
    ]
  }
];