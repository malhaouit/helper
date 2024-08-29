// StartGame.jsx (React component)

import React, { useState } from 'react';
import axios from 'axios';

const StartGame = ({ onStart }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStartGame = async () => {
    try {
      // Check or create player 1
      const player1Response = await axios.post('http://localhost:5000/players', {
        name: player1Name,
      });
      const player1 = player1Response.data;

      // Check or create player 2
      const player2Response = await axios.post('http://localhost:5000/players', {
        name: player2Name,
      });
      const player2 = player2Response.data;

      // Start a new game with existing player IDs
      const gameResponse = await axios.post('http://localhost:5000/games', {
        first_player_id: player1.id,
        second_player_id: player2.id,
      });

      const game = gameResponse.data;

      // Pass the game and player data to the parent component
      onStart(game.id, player1, player2);

    } catch (error) {
      console.error('Error creating players or starting the game:', error);
      alert('Error creating players. Please check the console for more details.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={player1Name}
        onChange={(e) => setPlayer1Name(e.target.value)}
        placeholder="Player 1 Name"
      />
      <input
        type="text"
        value={player2Name}
        onChange={(e) => setPlayer2Name(e.target.value)}
        placeholder="Player 2 Name"
      />
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default StartGame;
