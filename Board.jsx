import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cell from './Cell';
import PlayersPanel from './PlayersPanel';
import '../App.css';

const Board = ({ player1Id, player2Id, player1Name, player2Name }) => {
  const [gameId, setGameId] = useState(null);
  const [cells, setCells] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const gameCreated = useRef(false); // Use a ref to track if the game has been created

  useEffect(() => {
    if (!gameCreated.current && player1Id && player2Id) {
      console.log("Creating a new game...");
      // Create a new game only once
      axios.post('http://localhost:5000/games', {
        first_player_id: player1Id,
        second_player_id: player2Id
      })
      .then(response => {
        console.log("Game created successfully:", response.data);
        setGameId(response.data.id);
        setCells(response.data.board);
        gameCreated.current = true; // Mark the game as created
      })
      .catch(error => {
        console.error('Error creating game:', error);
        alert("Error creating game. Please check the backend logs.");
      });
    }
  }, [player1Id, player2Id]);

  const handleCellClick = (index) => {
    if (cells[index] === '' && !gameOver && gameId) {
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
      .catch(error => {
        console.error('Error making move:', error);
        alert("Error making move. Please check the backend logs.");
      });
    } else if (!gameId) {
      console.error('Game ID is null, cannot make a move');
      alert("Game ID is null. Cannot make a move. Please refresh and start a new game.");
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
      <PlayersPanel player1={player1Name} player2={player2Name} />
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

