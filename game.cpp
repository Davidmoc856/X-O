#include <iostream>
#include <vector>
#include <ctime>   // For time()
#include <cstdlib> // For rand() and srand()

using namespace std;

char board[9] = {'0', '1', '2', '3', '4', '5', '6', '7', '8'};

void drawBoard()
{
    cout << "\n";
    for (int i = 0; i < 9; i += 3)
    {
        cout << " | " << board[i] << " | " << board[i + 1] << " | " << board[i + 2] << " | \n";
    }
}

bool checkWin()
{
    int wins[8][3] = {{0, 1, 2}, {3, 4, 5}, {6, 7, 8}, {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, {0, 4, 8}, {2, 4, 6}};
    for (int i = 0; i < 8; i++)
    {
        if (board[wins[i][0]] == board[wins[i][1]] && board[wins[i][1]] == board[wins[i][2]])
            return true;
    }
    return false;
}

int main()
{
    int mode, choice;
    char player = 'X';

    cout << "--- C++ Tic Tac Toe ---\n";
    cout << "Select Mode: (1) PvP | (2) vs Computer: ";
    cin >> mode;

    for (int i = 0; i < 9; i++)
    {
        drawBoard();

        if (mode == 2 && player == 'O')
        {
            cout << "Computer is thinking...\n";
            srand(time(0)); // Seed the random number generator
            do
            {
                choice = rand() % 9; // Generate random number 0-8
            } while (board[choice] == 'X' || board[choice] == 'O');
        }
        else
        {
            cout << "Player " << player << ", enter cell: ";
            cin >> choice;
            if (board[choice] == 'X' || board[choice] == 'O')
            {
                cout << "Spot taken! Try again.\n";
                i--;
                continue;
            }
        }

        board[choice] = player;
        if (checkWin())
        {
            drawBoard();
            cout << "🎉 Player " << player << " wins!\n";
            return 0;
        }
        player = (player == 'X') ? 'O' : 'X';
    }

    drawBoard();
    cout << "🤝 It's a draw!\n";
    return 0;
}