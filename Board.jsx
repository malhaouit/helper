import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cell from './Cell';
import PlayersPanel from './PlayersPanel';
import '../App.css';

const Board = ({ player1, player2 }) => {
  const [gameId, setGameId] = useState(null);
  const [cells, setCells] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Create a new game when the component mounts with real player names
    axios.post('http://localhost:5000/games', {
      first_player: player1,
      second_player: player2
    })
    .then(response => {
      setGameId(response.data.id);
      setCells(response.data.board);
    })
    .catch(error => console.error('Error creating game:', error));
  }, [player1, player2]);

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
      <PlayersPanel player1={player1} player2={player2} />
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
