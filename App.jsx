// App.jsx

import React, { useState } from 'react';
import StartGame from './components/StartGame';
import GameBoard from './components/GameBoard';

const App = () => {
  const [gameId, setGameId] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const handleStartGame = (newGameId, player1, player2) => {
    setGameId(newGameId);
    setPlayer1(player1);
    setPlayer2(player2);
  };

  return (
    <div>
      {gameId ? (
        <GameBoard gameId={gameId} player1={player1} player2={player2} />
      ) : (
        <StartGame onStart={handleStartGame} />
      )}
    </div>
  );
};

export default App;
