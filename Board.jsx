import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cell from './Cell';
import PlayersPanel from './PlayersPanel';
import '../App.css';

const Board = ({ player1Id, player2Id }) => {
  const [gameId, setGameId] = useState(null);
  const [cells, setCells] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    console.log("Player 1 ID:", player1Id);
    console.log("Player 2 ID:", player2Id);

    if (player1Id && player2Id) {
      // Create a new game when the component mounts with real player IDs
      axios.post('http://localhost:5000/games', {
        first_player_id: player1Id,
        second_player_id: player2Id
      })
      .then(response => {
        console.log("Game created successfully:", response.data);
        setGameId(response.data.id);
        setCells(response.data.board);
      })
      .catch(error => console.error('Error creating game:', error));
    } else {
      console.error('Player IDs are invalid:', player1Id, player2Id);
    }
  }, [player1Id, player2Id]);

  const handleCellClick = (index) => {
    if (cells[index] === '' && !gameOver) {
      axios.put(`http://localhost:5000/games/${gameId}/move`, {
        index: index,
        player: currentPlayer
      })
      .then(response => {
        setCells(response.data.board);
        if (response.data.winner) {
          setGameOver(true);
          alert(`Player ${response.data.winner} wins!`);
        } else {
          setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
      })
      .catch(error => console.error('Error making move:', error));
    }
  };

  const resetBoard = () => {
    setCells(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameOver(false);
    // Optionally, reset or start a new game on the server
  };

  return (
    <div className="app">
      <PlayersPanel player1="Player 1" player2="Player 2" />
      <div className="board">
        {cells.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </div>
      <button className="reset-button" onClick={resetBoard}>
        Play Again
      </button>
    </div>
  );
};

export default Board;
