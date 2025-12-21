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
  const [currentBank, setCurrentBank] = useState<number>(0);

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

useEffect(() => {
  if (strikeCount >= 3) {
    console.log("Three strikes! Switching active team.");
    switchActiveTeam();
    resetStrikes();
  }
}, [strikeCount]);


  const revealAnswer = (index: number) => {
  console.log("Revealing answer at index:", index);
if (!answers[index] || answers[index].isRevealed) {
    console.log("Answer already revealed or index out of bounds");
    return;
  }

    const newAnswers = [...answers];
    newAnswers[index].isRevealed = true;
    setAnswers(newAnswers);
    addToCurrentBank(newAnswers[index].points);
    console.log("Answer revealed:", newAnswers[index]);
    addPointsToActiveTeam(newAnswers[index].points);
    console.log("Updated answers:", newAnswers);
    console.log("Current team scores - Team 1:", team1Score, "Team 2:", team2Score);
    console.log("points added to", activeTeam, ":", newAnswers[index].points);
  }

const revealAllAnswers = () => {
  const revealedAnswers = answers.map((answer) => {
    return {
      ...answer,       
      isRevealed: true 
    };
  });

  setAnswers(revealedAnswers);
  
  console.log("All answers revealed for the audience.");
};

  const addStrike = () => {
    setStrikeCount((prev) => prev + 1);
    console.log("Strike added. Total strikes now:", strikeCount + 1);
  }

  const resetStrikes = () => {
    setStrikeCount(0);
  }

  const switchActiveTeam = () => {
    const newActiveTeam = activeTeam === 'team1' ? 'team2' : 'team1';
    setActiveTeam(newActiveTeam);
    console.log("Active team switched to:", newActiveTeam);
  }
  const addToCurrentBank = (points: number) => {
    const bank = currentBank + points;
    setCurrentBank(bank);
    console.log("Current bank updated to:", bank);
  }

  const addPointsToActiveTeam = (points: number) => {
    console.log("Adding points:", points, "to", activeTeam);
    if (activeTeam === 'team1') {
      setTeam1Score((prev) => prev + points);
      console.log("Team 1 score updated to:", team1Score + points);
    }
    else {
      setTeam2Score((prev) => prev + points);
      console.log("Team 2 score updated to:", team2Score + points);
    }
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
      <div>
        <br></br>
      </div>
      {/* Status Area */}
      <div className="status">
        <div className="strikes">STRIKES: {strikeCount}</div>
      </div>
      <div>
        <br></br>
      </div>
      {/* Footer: Scores */}
      <div className="scores">
        <div className={activeTeam === 1 ? 'active' : ''}>
          Team 1: {team1Score}
        </div>
        <div className={activeTeam === 2 ? 'active' : ''}>
          Team 2: {team2Score}
        </div>
        <div>
          <div className="bank">Bank: {currentBank}</div>
        </div>
      </div>
            <div>
        <br></br>
      </div>
      <div>
          <div className="CurrentTeam">Current Team: {activeTeam}</div>
        </div>
      <div>
        <br></br>
      </div>
      <div className='Function testing'>
        <button onClick={resetStrikes}>Reset Strikes</button>
        <button onClick={switchActiveTeam}>Switch Active Team</button>
        <button onClick={resetGame}>Reset Game</button>
        <button onClick={nextRound}>Next Round</button>
        <button onClick={resetRound}>Reset Round</button>
        <button onClick={clearBank}>Clear Bank</button>
        <button onClick={stealBank}>Steal Bank</button>
        <button onClick={() => revealAllAnswers()}>Reveal All Answers</button>
        <button onClick={() => addPointsToActiveTeam(100)}>Add 100 Points to Active Team</button>
        <button onClick={() => console.log(activeTeam)}>current TEam</button> 
      </div>
    </div>
  )
}

export default App