import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cell from './Cell';

const GameBoard = ({ gameId, player1Id, player2Id, onGameOver }) => {
  const [cells, setCells] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/games/${gameId}`);
        setCells(response.data.board);
      } catch (error) {
        console.error('Error fetching game:', error);
      }
    };

    fetchGame();
  }, [gameId]);

  const handleCellClick = async (index) => {
    if (cells[index] === '' && !gameOver) {
      try {
        const response = await axios.put(`http://localhost:5000/games/${gameId}/move`, {
          index,
          player: currentPlayer,
        });

        setCells(response.data.board);
        if (response.data.winner) {
          setGameOver(true);
          onGameOver(response.data.winner);
        } else {
          setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
      } catch (error) {
        console.error('Error making move:', error);
        alert('Error making move. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Current Player: {currentPlayer}</h2>
      <div className="board">
        {cells.map((cell, index) => (
          <Cell key={index} value={cell} onClick={() => handleCellClick(index)} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
