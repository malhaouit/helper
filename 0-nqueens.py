#!/usr/bin/python3
"""
N Queens Problem Solver

This script solves the N Queens problem using a backtracking algorithm.
Usage:
    ./0-nqueens.py N
Where N is the number of queens (and the size of the board), must be at least 4.
"""

import sys

def is_safe(board, row, col):
    """
    Check if it's safe to place a queen at board[row][col].
    """
    for i in range(col):
        if board[row][i] == 1:
            return False

    for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False

    for i, j in zip(range(row, len(board), 1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False

    return True

def solve_nqueens(board, col, solutions):
    """
    Use backtracking to solve the N Queens problem.
    """
    if col >= len(board):
        solution = [[i, board[i].index(1)] for i in range(len(board))]
        solutions.append(solution)
        return

    for i in range(len(board)):
        if is_safe(board, i, col):
            board[i][col] = 1
            solve_nqueens(board, col + 1, solutions)
            board[i][col] = 0

def nqueens(N):
    """
    Initialize the board and find all solutions.
    """
    board = [[0] * N for _ in range(N)]
    solutions = []
    solve_nqueens(board, 0, solutions)
    for solution in solutions:
        print(solution)

def main():
    """
    Handle command-line arguments and start the solver.
    """
    if len(sys.argv) != 2:
        print("Usage: nqueens N")
        sys.exit(1)

    try:
        N = int(sys.argv[1])
    except ValueError:
        print("N must be a number")
        sys.exit(1)

    if N < 4:
        print("N must be at least 4")
        sys.exit(1)

    nqueens(N)

if __name__ == "__main__":
    main()
