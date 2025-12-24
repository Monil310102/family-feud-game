import { useState , useEffect } from 'react'
import { mockRounds } from './Mockdata/mockData'
import type { Answer } from './types/games';
import type { GameAlert } from './types/games';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(mockRounds[currentRoundIndex].answers);

  const [strikeCount, setStrikeCount] = useState(0);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [activeTeam, setActiveTeam] = useState<'team1' | 'team2'>('team1');
  const [currentBank, setCurrentBank] = useState<number>(0);
  const [gameAlert, setGameAlert] = useState<GameAlert | null>(null);
  const [postRoundAction, setPostRoundAction] = useState<"reveal" | "nextRound" | null>(null);
  type RoundEndReason = "cleanSweep" | "stealSuccess" | "stealFail" | null;

  const [roundEndReason, setRoundEndReason] =useState<RoundEndReason>(null);
  const [roundPoints, setRoundPoints] = useState<number>(0);

const showAlert = (
  title: string,
  subtitle?: string,
  variant: "info" | "success" | "warning" = "info",
  postAction: "reveal" | "nextRound" | null = null
) => {
  setGameAlert({ title, subtitle, variant });
  setPostRoundAction(postAction);

  if (!postAction) {
    // auto-dismiss only if no post-round action is needed
    setTimeout(() => setGameAlert(null), 2500);
  }
};


const alerts = {
  cleanSweep: () =>
    showAlert("CLEAN SWEEP!", "All answers revealed", "success", "nextRound"),

  stealOpportunity: (team: "TEAM 1" | "TEAM 2") =>
    showAlert("STEAL!", `${team} can steal`, "warning"),

  stealSuccess: (team: "TEAM 1" | "TEAM 2", points: number) =>
    showAlert(
      "SUCCESSFUL STEAL!",
      `${team} steals ${points} points`,
      "success",
      "reveal"  // host clicks to reveal remaining answers
    ),

  stealFail: (team: "TEAM 1" | "TEAM 2", points: number) =>
    showAlert(
      "STEAL FAILED",
      `${team} banks ${points} points`,
      "warning",
      "reveal" // host clicks to reveal remaining answers
    ),

  roundWin: (team: "TEAM 1" | "TEAM 2", points: number) =>
    showAlert(
      `${team} WINS THE ROUND`,
      `They take ${points} points`,
      "success",
      "nextRound"
    ),

  newRound: (round: number, question: string) =>
    showAlert(
      `ROUND ${round} / 5`,
      question,
      "info"
    ),
};

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

  // Logic 3: Handle "X" for Strike (Incorrect Guess)
  if (key.toLowerCase() === "x") {
    addStrike();
    playSoundEffect("strike.mp3");
  }

  // Logic 4: Handle "T" for Toggle Team (Manually swap Team 1/Team 2)
  if (key.toLowerCase() === "t") {
    switchActiveTeam();
  }

  // Logic 5: Handle "R" for Reveal All Answers (End of round reveal)
  if (key.toLowerCase() === "r") {
    revealAllAnswers();
  }

  // Logic 6: Handle "E" for EMERGENCY RESET (Clear Bank & Strikes)
  // Use this to "undo" a mistake without changing the round or answers
  if (key.toLowerCase() === "e") {
    if (strikeCount >= 3) {
    switchActiveTeam(); 
    console.log("Steal interrupted: Reverting to original team.");
  }
    setCurrentBank(0);
    resetStrikes(); 
    console.log("Emergency Reset triggered: Bank and Strikes cleared.");
  }

  // Logic 7: Handle "H" for Hide All (Cover all answers back up)
  if (key.toLowerCase() === "h") {
    setAnswers(prev => prev.map(a => ({ ...a, isRevealed: false })));
    setCurrentBank(0);
    console.log("Emergency Hide triggered: All answers covered.");
  }

  // Logic 8: Handle "N" for Move to Next Round
  if (key.toLowerCase() === "n") {
    nextRound();
  }
 
  // Logic: Handle "L" for END ROUND (host controlled)
  if (key.toLowerCase() === "l") {
    console.log("Host ended the round.");
    endRound();
    console.log("Host ended the round2.");
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
      alerts.stealOpportunity(activeTeam === 'team1' ? 'TEAM 2' : 'TEAM 1');
      switchActiveTeam(); 
      // playSoundEffect("steal-opportunity.mp3"); // Optional: unique sound
    }, 500);

    return () => clearTimeout(timer); // Cleanup if the component re-renders
  }

  // 2. THE STEAL FAIL: Happens if the stealing team misses (Strike 4)
  if (strikeCount === 4) {
    const timer = setTimeout(() => {
      alert("Steal failed! Awarding bank to original team.");
      setRoundPoints(currentBank);
      alerts.stealFail(
        activeTeam === 'team1' ? 'TEAM 2' : 'TEAM 1',
        currentBank
      );
      const originalTeam = activeTeam === 'team1' ? 'team2' : 'team1';
      
      BankPoints(originalTeam); 
      setRoundEndReason("stealFail");

      alert(`Steal Failed! Points awarded to ${originalTeam === 'team1' ? 'Team 1' : 'Team 2'}`);
    }, 500);

    return () => clearTimeout(timer);
  }
}, [strikeCount]);

// EFFECT B: The Clean Sweep Referee
useEffect(() => {
  if (roundEndReason !== null) return;
  const allRevealed = answers.length > 0 && answers.every(a => a.isRevealed);

  // Award points if board is cleared AND it's not a steal (strikes < 3)
  if (allRevealed && currentBank > 0 && strikeCount < 3) {
    const timer = setTimeout(() => {
      setRoundPoints(currentBank);
      BankPoints(); // Awards to activeTeam
      //alert(`Clean Sweep! Points for2 ${activeTeam === 'team1' ? 'Team 1' : 'Team 2'}!`);
      alerts.cleanSweep();
      setRoundEndReason("cleanSweep");
    }, 600);
    return () => clearTimeout(timer);
  }
}, [answers, currentBank, activeTeam, strikeCount,roundEndReason]);

// EFFECT C: The Round Loader
useEffect(() => {
  const nextRoundData = mockRounds[currentRoundIndex];
  if (nextRoundData) {
    setAnswers(nextRoundData.answers.slice(0, 8));
  }
}, [currentRoundIndex]);

useEffect(() => {
  if (!roundEndReason) return;

  // Wait so reveal animations can finish
  const timer = setTimeout(() => {
    const winningTeam =
      roundEndReason === "stealFail"
        ? activeTeam === "team1"
          ? "TEAM 2"
          : "TEAM 1"
        : activeTeam === "team1"
        ? "TEAM 1"
        : "TEAM 2";

    const pointsWon =
      roundEndReason === "cleanSweep" ||
      roundEndReason === "stealSuccess"
        ? currentBank
        : currentBank;

  }, 800);

  return () => clearTimeout(timer);
}, [roundEndReason]);


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
      setRoundPoints(newBankTotal);

      alerts.stealSuccess(
        activeTeam === 'team1' ? 'TEAM 1' : 'TEAM 2',
        newBankTotal
      );
      setRoundEndReason("stealSuccess");
    }, 500);
  }
};

const allAnswersRevealed =
  answers.length > 0 && answers.every(a => a.isRevealed);

const endRound = () => {
  // Host pressed L too early → ignore
  if (!allAnswersRevealed) return;

  const winningTeam =
    activeTeam === "team1" ? "TEAM 1" : "TEAM 2";

  alerts.roundWin(winningTeam, roundPoints);
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
      setRoundEndReason(null);

      console.log("Moving to next round...");
      alerts.newRound(
        currentRoundIndex + 2,
        mockRounds[currentRoundIndex + 1]?.questionText || ""
      );
    } else {
      alert("Game Over! All 5 rounds complete.");
      showAlert(
  "GAME OVER",
  `Final Score — Team 1: ${team1Score} | Team 2: ${team2Score}`,
  "info"
);
    }
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

{gameAlert && (
  <div className="alert-overlay">
    <div className={`alert-box ${gameAlert.variant || "info"}`}>
      <h2>{gameAlert.title}</h2>
      {gameAlert.subtitle && <p>{gameAlert.subtitle}</p>}

      {postRoundAction === "reveal" && (
        <button onClick={() => {
          revealAllAnswers();
          setGameAlert(null);
          setPostRoundAction("nextRound"); // next action will be round win
        }}>Reveal Remaining Answers</button>
      )}

      {postRoundAction === "nextRound" && (
        <button onClick={() => {
          setGameAlert(null);
          setPostRoundAction(null);
          nextRound();
        }}>Next Round</button>
      )}

      {!postRoundAction && (
        <button onClick={() => setGameAlert(null)}>CONTINUE</button>
      )}
    </div>
  </div>
)}




    {/* Header */}
    <div className="header">
      <h1 className="title">FAMILY FEUD</h1>
    </div>

    {/* Question */}
    <div className="question-card">
      <p className="question-text">
        {mockRounds[currentRoundIndex].questionText}
      </p>
    </div>

    {/* Answer Board */}
    <div className="answer-board">
      {answers.slice(0, 8).map((item, index) => (
        <div
          key={index}
          className={`answer-tile ${
            item.isRevealed ? "revealed" : "unrevealed"
          }`}
        >
          {item.isRevealed ? (
            <div className="answer-content">
              <span className="answer-text">{item.text}</span>
              <span className="points-badge">{item.points}</span>
            </div>
          ) : (
            <span className="answer-number">{index + 1}</span>
          )}
        </div>
      ))}
    </div>

    {/* Bank */}
    <div className="bank-area">BANK: {currentBank}</div>

    {/* Teams */}
    <div className="footer">
      <div className={`team-panel team1 ${activeTeam === 'team1' ? "active" : ""}`}>
        <div className="team-name">TEAM 1</div>
        <div className="team-score">{team1Score}</div>

        <div className="strikes-container">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`strike ${strikeCount >= num ? "active" : ""}`}
            >
              X
            </div>
          ))}
        </div>
      </div>

      <div className={`team-panel team2 ${activeTeam === 'team2' ? "active" : ""}`}>
        <div className="team-name">TEAM 2</div>
        <div className="team-score">{team2Score}</div>
        <div className="strikes-container">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`strike ${strikeCount >= num ? "active" : ""}`}
            >
              X
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Controls */}
    <div className="controls">
      <button className="control-btn" onClick={revealAllAnswers}>
        Reveal Answers
      </button>
      <button className="control-btn" onClick={switchActiveTeam}>
        Switch Team
      </button>
      <button className="control-btn" onClick={nextRound}>
        Next Round
      </button>
      <button className="control-btn warning" onClick={resetGame}>
        Reset Game
      </button>
      <button className="control-btn success" onClick={BankPoints}>
        Bank Points
      </button>
    </div>
  </div>
);

}

export default App