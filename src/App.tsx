import { useState , useEffect } from 'react'
import { mockRounds } from './Mockdata/mockData'
import type { Answer } from './types/games';


function App() {
  const [count, setCount] = useState(0)
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(mockRounds[currentRoundIndex].answers);

  const [strikeCount, setStrikeCount] = useState(0);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [activeTeam, setActiveTeam] = useState<'team1' | 'team2'>('team1');

  const newAnswers = [...answers];

  useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;

    // Logic 1: Handle Numbers 1-9
    if (key >= "1" && key <= "9") {
      const index = parseInt(key) - 1;
      revealAnswer(index);
    }

    // Logic 2: Handle the "0" for the 10th answer
    if (key === "0") {
      revealAnswer(9);
    }

    // Logic 3: Handle "N" for Strike
    if (key.toLowerCase() === "n") {
      addStrike();
    }
  };

  // Attach the listener
  window.addEventListener("keydown", handleKeyDown);

  // The Cleanup: Remove the listener when the component unmounts
  return () => window.removeEventListener("keydown", handleKeyDown);

}, [answers, strikeCount, team1Score, team2Score, activeTeam]);



  const revealAnswer = (index: number) => {
  console.log("Revealing answer at index:", index);
if (!answers[index] || answers[index].isRevealed) {
    console.log("Answer already revealed or index out of bounds");
    return;
  }

    const newAnswers = [...answers];
    newAnswers[index].isRevealed = true;
    setAnswers(newAnswers);
    console.log("Answer revealed:", newAnswers[index]);
    addPointsToActiveTeam(newAnswers[index].points);
    console.log("Updated answers:", newAnswers);
    console.log("Current team scores - Team 1:", team1Score, "Team 2:", team2Score);
    console.log("points added to", activeTeam, ":", newAnswers[index].points);
  }

  const addStrike = () => {
    setStrikeCount((prev) => prev + 1);
    console.log("Strike added. Total strikes now:", strikeCount + 1);
  }

  const resetStrikes = () => {
    setStrikeCount(0);
  }

  const switchActiveTeam = () => {
  }

  const addPointsToActiveTeam = (points: number) => {
    console.log("Adding points:", points, "to", activeTeam);
  }
  const resetGame = () => {

  }
  const nextRound = () => {
  }
  const resetRound = () => {
  }
  const clearBank = () => {
  }
  const stealBank = () => {
  }
   

  console.log("Rendering App Component");
  console.log(answers)
  return (
    <div className="game-container">
      {/* Header Area */}
      <h1>FAMILY FEUD</h1>
      <h2>{mockRounds[currentRoundIndex].questionText}</h2>

      {/* The Board: You will eventually move this to its own component */}
      <div className="board">
        {answers.map((item, index) => (
          <div key={index} className="answer-slot">
            {/* Logic: If revealed, show text. If not, show number. */}
            {item.isRevealed ? `${item.text} - ${item.points}` : index + 1}
          </div>
        ))}
      </div>

      {/* Status Area */}
      <div className="status">
        <div className="strikes">STRIKES: {strikeCount}</div>
      </div>

      {/* Footer: Scores */}
      <div className="scores">
        <div className={activeTeam === 1 ? 'active' : ''}>
          Team 1: {team1Score}
        </div>
        <div className={activeTeam === 2 ? 'active' : ''}>
          Team 2: {team2Score}
        </div>
      </div>
    </div>
  )
}

export default App