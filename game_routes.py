#!/usr/bin/env python3
"""
Game routes for the Tic-Tac-Toe API.

Handles the creation, retrieval, and updating of game-related data
through various API endpoints.
"""
from flask import Blueprint, request, jsonify
from database import get_db
import uuid
import logging

# Initialize the game_routes blueprint
bp = Blueprint('game_routes', __name__)

# Setup logging
logging.basicConfig(level=logging.INFO)


def generate_uuid():
    """
    Generates a unique UUID string.
    """
    return str(uuid.uuid4())


@bp.route('/games', methods=['POST'], strict_slashes=False)
def create_game():
    """
    Creates a new game and inserts it into the database.
    """
    data = request.json

    if not data.get("first_player"):
        return jsonify({"error": "First player ID is required"}), 400

    if not isinstance(data.get("first_player"), str):
        return jsonify({"error": "First player ID must be a string"}), 400

    if not data.get("second_player"):
        return jsonify({"error": "Second player ID is required"}), 400

    if not isinstance(data.get("second_player"), str):
        return jsonify({"error": "Second player ID must be a string"}), 400

    # Create game document with default values
    game = {
        "id": generate_uuid(),
        "first_player": data["first_player"],
        "second_player": data["second_player"],
        "decision": 0,  # Default to draw
        "difficulty": 1,  # Default to easy
        "board": [''] * 9,  # Initialize an empty board
        "completed": False  # Mark game as not completed
    }

    # Insert the new game into the 'games' collection
    games_collection = get_db()['games']
    result = games_collection.insert_one(game)
    game["_id"] = str(result.inserted_id)

    logging.info(f"Game {game['id']} created with players {game['first_player']} and {game['second_player']}")

    # Return the newly created game data as JSON
    return jsonify(game), 201


@bp.route('/games/<id>/result', methods=['PUT'], strict_slashes=False)
def update_game_result(id):
    """
    Updates the result of a game by setting the decision value.
    """
    data = request.json

    if not data.get("decision"):
        return jsonify({"error": "Decision value is required"}), 400

    if not isinstance(data["decision"], int):
        return jsonify({"error": "Decision value must be an integer"}), 400

    # Update the game result in the database
    result = get_db()['games'].update_one(
        {"id": id}, {"$set": {"decision": data["decision"], "completed": True}})

    if result.matched_count > 0:
        logging.info(f"Game {id} result updated to {data['decision']}")
        return jsonify({"message": "Game result updated"}), 200

    # If the game is not found, return a 404 error
    return jsonify({"error": "Game not found"}), 404


@bp.route('/games/<id>', methods=['GET'])
def get_game(id):
    """
    Retrieves a game's details by its unique ID.
    """
    # Fetch the game document from the database
    game = get_db()['games'].find_one({"id": id})

    if game:
        # Convert ObjectId to a string for JSON serialization
        if '_id' in game:
            game['_id'] = str(game['_id'])
        return jsonify(game), 200

    # If the game is not found, return a 404 error
    return jsonify({"error": "Game not found"}), 404


@bp.route('/games/<id>/move', methods=['PUT'], strict_slashes=False)
def make_move(id):
    """
    Handles making a move in the Tic-Tac-Toe game.
    Updates the game state and checks for a winner.
    """
    data = request.json
    index = data.get('index')
    player = data.get('player')

    if index is None or player not in ['X', 'O']:
        return jsonify({"error": "Invalid move data."}), 400

    game = get_db()['games'].find_one({"id": id})

    if not game:
        return jsonify({"error": "Game not found."}), 404

    # Prevent moves after the game is completed
    if game.get('completed'):
        return jsonify({"error": "The game is already over."}), 400

    # Update the board
    board = game.get('board', [''] * 9)
    if board[index] != '':
        return jsonify({"error": "Cell already occupied."}), 400

    board[index] = player
    get_db()['games'].update_one({"id": id}, {"$set": {"board": board}})

    # Check for winner
    winner = check_winner(board)
    if winner:
        get_db()['games'].update_one({"id": id}, {"$set": {"decision": winner, "completed": True}})
        logging.info(f"Game {id} won by {winner}")
        return jsonify({"winner": winner, "board": board}), 200

    return jsonify({"board": board}), 200


def check_winner(board):
    """
    Checks if there is a winner on the board.
    """
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
        [0, 4, 8], [2, 4, 6]              # Diagonals
    ]

    for combination in winning_combinations:
        if board[combination[0]] and board[combination[0]] == board[combination[1]] == board[combination[2]]:
            return board[combination[0]]
    return None
