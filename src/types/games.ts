export interface Answer {
    text: string;
    points: number;
    isRevealed: boolean;
}

export interface Question {
    questionText: string;
    answers: Answer[];
}

export interface GameState {
    team1Score: number;
    team2Score: number;
    currentQuestionIndex: number;
    currentRoundIndex: number;
    questions: Question[];
    strikeCount: number;
    isGameActive: boolean;
    revealedAnswersCount: number;
    activeTeam: 'team1' | 'team2';
    currentBank : number;

}

export type GameAlert =
  | null
  | {
      title: string;
      subtitle?: string;
      variant?: "info" | "success" | "warning";
    };
