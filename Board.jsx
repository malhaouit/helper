import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Cell from './Cell';
import PlayersPanel from './PlayersPanel';
import '../App.css';

const socket = io('http://localhost:5000');

const Board = ({ player1Id, player2Id }) => {
    const [gameId, setGameId] = useState(null);
    const [cells, setCells] = useState(Array(9).fill(''));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        // Create a new game when the component mounts with real player IDs
        axios.post('http://localhost:5000/games', {
            first_player_id: player1Id,
            second_player_id: player2Id
        })
        .then(response => {
            setGameId(response.data.id);
            setCells(response.data.board);

            // Join the game room via Socket.IO
            socket.emit('join_game', { game_id: response.data.id });
        })
        .catch(error => console.error('Error creating game:', error));
    }, [player1Id, player2Id]);

    useEffect(() => {
        // Listen for board updates from the server
        socket.on('game_update', (data) => {
            setCells(data.board);
            if (data.winner) {
                setGameOver(true);
                alert(`Player ${data.winner} wins!`);
            }
        });

        return () => {
            socket.off('game_update');
        };
    }, []);

    const handleCellClick = (index) => {
        if (!gameOver && cells[index] === '') {
            socket.emit('make_move', {
                game_id: gameId,
                index: index,
                player: currentPlayer
            });

            // Update current player
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
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
            <button className="reset-button" onClick={() => window.location.reload()}>
                Play Again
            </button>
        </div>
    );
};

export default Board;
