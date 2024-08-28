import React, { useState } from 'react';
import Board from './components/Board';
import PlayersPanel from './components/PlayersPanel';
import axios from 'axios';

const App = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Id, setPlayer1Id] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    // Fetch or create player 1
    axios.post('http://localhost:5000/players', { name: player1Name })
      .then(response => {
        setPlayer1Id(response.data.id);
        return axios.post('http://localhost:5000/players', { name: player2Name });
      })
      .then(response => {
        setPlayer2Id(response.data.id);
        setGameStarted(true);
      })
      .catch(error => {
        console.error('Error creating players:', error);
        alert("Error creating players. Please check the console for more details.");
      });
  };

  return (
    <div className="app">
      {!gameStarted ? (
        <div>
          <h1>Tic-Tac-Toe</h1>
          <input 
            type="text" 
            placeholder="Enter Player 1 Name"
            value={player1Name}
            onChange={e => setPlayer1Name(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Enter Player 2 Name"
            value={player2Name}
            onChange={e => setPlayer2Name(e.target.value)}
          />
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      ) : (
        <Board player1Id={player1Id} player2Id={player2Id} />
      )}
    </div>
  );
};

export default App;
