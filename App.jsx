import React, { useState } from 'react';
import Board from './components/Board';
import PlayersPanel from './components/PlayersPanel';
import Header from './components/Header';

const App = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    if (player1 && player2) {
      setGameStarted(true);
    } else {
      alert('Please enter names for both players.');
    }
  };

  return (
    <div className="app">
      <Header/>
      {!gameStarted ? (
        <div className="start-game-form">
          <input 
            type="text" 
            placeholder="Player 1 Name" 
            value={player1} 
            onChange={(e) => setPlayer1(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Player 2 Name" 
            value={player2} 
            onChange={(e) => setPlayer2(e.target.value)} 
          />
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <Board player1={player1} player2={player2} />
      )}
    </div>
  );
};

export default App;
