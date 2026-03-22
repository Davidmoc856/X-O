import random

def print_board(board):
    for i in range(0, 9, 3):
        print(f"| {board[i]} | {board[i+1]} | {board[i+2]} |")

def check_winner(board):
    wins = [(0,1,2), (3,4,5), (6,7,8), (0,3,6), (1,4,7), (2,5,8), (0,4,8), (2,4,6)]
    for w in wins:
        # Check if the three spots are the same and NOT empty
        if board[w[0]] == board[w[1]] == board[w[2]] != " ":
            return True
    return False

# --- GAME SETUP ---
board = [" " for _ in range(9)]
print("--- Welcome to Tic Tac Toe ---")
mode = input("Select Mode: (1) PvP | (2) vs Computer: ")
turn = "X"

for i in range(9):
    print_board(board)
    
    # If it's Computer's turn in mode 2
    if mode == "2" and turn == "O":
        print("Computer is thinking...")
        move = random.choice([idx for idx, val in enumerate(board) if val == " "])
    else:
        try:
            move = int(input(f"Player {turn}, enter position (0-8): "))
            if board[move] != " ":
                print("Spot taken! Try again.")
                continue
        except (ValueError, IndexError):
            print("Invalid input! Use numbers 0-8.")
            continue

    board[move] = turn
    
    if check_winner(board):
        print_board(board)
        print(f"🎉 Player {turn} wins!")
        break
    
    turn = "O" if turn == "X" else "X"
else:
    print_board(board)
    print("🤝 It's a draw!")