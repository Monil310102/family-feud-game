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
      playSoundEffect("strike.mp3")
    }
  };

  // Attach the listener
  window.addEventListener("keydown", handleKeyDown);

  // The Cleanup: Remove the listener when the component unmounts
  return () => window.removeEventListener("keydown", handleKeyDown);

}, [answers, strikeCount, team1Score, team2Score, activeTeam]);

// EFFECT A: The Strike & Steal Referee
useEffect(() => {
  // 1. THE SWITCH: Happens at exactly 3 strikes
  if (strikeCount === 3) {
    // We wait 500ms so the 3rd strike animation/sound can play first
    const timer = setTimeout(() => {
      alert("3 Strikes! Switching to the stealing team.");
      switchActiveTeam(); 
      // playSoundEffect("steal-opportunity.mp3"); // Optional: unique sound
    }, 500);

    return () => clearTimeout(timer); // Cleanup if the component re-renders
  }

  // 2. THE STEAL FAIL: Happens if the stealing team misses (Strike 4)
  if (strikeCount === 4) {
    const timer = setTimeout(() => {
      alert("Steal failed! Awarding bank to original team.");
      const originalTeam = activeTeam === 'team1' ? 'team2' : 'team1';
      
      BankPoints(originalTeam); 
      alert(`Steal Failed! Points awarded to ${originalTeam === 'team1' ? 'Team 1' : 'Team 2'}`);
    }, 500);

    return () => clearTimeout(timer);
  }
}, [strikeCount]);

// EFFECT B: The Clean Sweep Referee
useEffect(() => {
  const allRevealed = answers.length > 0 && answers.every(a => a.isRevealed);

  // Award points if board is cleared AND it's not a steal (strikes < 3)
  if (allRevealed && currentBank > 0 && strikeCount < 3) {
    const timer = setTimeout(() => {
      BankPoints(); // Awards to activeTeam
      alert(`Clean Sweep! Points for2 ${activeTeam === 'team1' ? 'Team 1' : 'Team 2'}!`);
    }, 600);
    return () => clearTimeout(timer);
  }
}, [answers, currentBank, activeTeam, strikeCount]);

// EFFECT C: The Round Loader
useEffect(() => {
  const nextRoundData = mockRounds[currentRoundIndex];
  if (nextRoundData) {
    setAnswers(nextRoundData.answers);
  }
}, [currentRoundIndex]);


const revealAnswer = (index: number) => {
  console.log("Revealing answer at index:", index);
  
  if (!answers[index] || answers[index].isRevealed) return;

  // 1. MANUALLY CALCULATE THE NEW TOTAL
  // This avoids waiting for the slow React state update
  const pointsToAdd = answers[index].points;
  const newBankTotal = currentBank + pointsToAdd; 

  // 2. Update the UI
  const newAnswers = [...answers];
  newAnswers[index].isRevealed = true;
  setAnswers(newAnswers);

  // 3. Update the Bank state (for the screen display)
  addToCurrentBank(pointsToAdd);
  playSoundEffect("correct.mp3");

  // 4. THE STEAL WIN
  if (strikeCount === 3) {
    setTimeout(() => {
      // PASS THE MANUAL TOTAL HERE
      BankPoints(activeTeam, newBankTotal); 
      
      alert(`Successful Steal! Team ${activeTeam === 'team1' ? '1' : '2'} takes all ${newBankTotal} points!`);
    }, 500);
  }
};

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
    if (currentRoundIndex < 4) {
      setCurrentRoundIndex(prev => prev + 1);
      
      resetStrikes();
      clearBank();
      console.log("Moving to next round...");
    } else {
      alert("Game Over! All 5 rounds complete.");
    }
  }
  const resetRound = () => {
  }
  const clearBank = () => {
    setCurrentBank(0);
  }
const BankPoints = (targetTeam = activeTeam, points = currentBank) => {
  if (targetTeam === 'team1') {
    setTeam1Score(prev => prev + points);
  } else {
    setTeam2Score(prev => prev + points);
  }
  setCurrentBank(0);
  resetStrikes(); // Ensure this sets strikeCount to 0
};
  const playSoundEffect = (file: string) => {
    const audio = new Audio(file);
    audio.play().catch(e => console.error("Audio play failed:", e));
  };


  console.log("Answers:", answers);
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
        <div>
          <div className="currentRoundIndex">Round: {currentRoundIndex+1}</div>
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
        <button onClick={BankPoints}> Bank Points</button>
        <button onClick={() => revealAllAnswers()}>Reveal All Answers</button>
        <button onClick={() => addPointsToActiveTeam(100)}>Add 100 Points to Active Team</button>
        <button onClick={() => console.log(activeTeam)}>current TEam</button> 
        <button onClick={() => playSoundEffect("correct.mp3")}> correct sfx </button>
        <button onClick={() => playSoundEffect("strike.mp3")}> incorrect  sfx</button>
      </div>
    </div>
  )
}

export default App