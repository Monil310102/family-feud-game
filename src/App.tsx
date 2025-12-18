import { useState } from 'react'
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


  const revealAnswer = (index: number) => {
  console.log("Revealing answer at index:", index);
  }

  const addStrike = () => {
    setStrikeCount((prev) => prev + 1);
  }

  const resetStrikes = () => {
    setStrikeCount(0);
  }

  const switchActiveTeam = () => {
  }

  const addPointsToActiveTeam = (points: number) => {
  }
  const resetGame = () => {

  }
  const nextRound = () => {
  }
  const resetRound = () => {
  }
  const addPointToBank = (points: number) => {
  }
  const clearBank = () => {
  }
  const stealBank = () => {
  }
   


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