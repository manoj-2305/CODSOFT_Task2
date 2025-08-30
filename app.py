from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

class TicTacToe:
    def __init__(self):
        self.board = np.zeros((3, 3), dtype=int)
        self.current_player = 1  # 1 for X, -1 for O
        self.game_over = False
        self.winner = None

    def reset(self):
        self.board = np.zeros((3, 3), dtype=int)
        self.current_player = 1
        self.game_over = False
        self.winner = None

    def make_move(self, row, col):
        if self.game_over or self.board[row][col] != 0:
            return False
        
        self.board[row][col] = self.current_player
        
        # Check for win
        if self.check_winner():
            self.game_over = True
            self.winner = self.current_player
        # Check for draw
        elif np.all(self.board != 0):
            self.game_over = True
            self.winner = 0
        else:
            self.current_player *= -1
        
        return True

    def check_winner(self):
        # Check rows
        for row in range(3):
            if abs(sum(self.board[row])) == 3:
                return True
        
        # Check columns
        for col in range(3):
            if abs(sum(self.board[:, col])) == 3:
                return True
        
        # Check diagonals
        if abs(sum(np.diag(self.board))) == 3:
            return True
        if abs(sum(np.diag(np.fliplr(self.board)))) == 3:
            return True
        
        return False

    def get_empty_cells(self):
        return [(i, j) for i in range(3) for j in range(3) if self.board[i][j] == 0]

    def minimax(self, depth, is_maximizing, alpha=-float('inf'), beta=float('inf')):
        if self.check_winner():
            return -10 if is_maximizing else 10
        elif np.all(self.board != 0):
            return 0
        
        if is_maximizing:
            max_eval = -float('inf')
            for row, col in self.get_empty_cells():
                self.board[row][col] = -1
                eval = self.minimax(depth + 1, False, alpha, beta)
                self.board[row][col] = 0
                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
            return max_eval
        else:
            min_eval = float('inf')
            for row, col in self.get_empty_cells():
                self.board[row][col] = 1
                eval = self.minimax(depth + 1, True, alpha, beta)
                self.board[row][col] = 0
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha:
                    break
            return min_eval

    def get_ai_move(self):
        best_score = -float('inf')
        best_move = None
        
        for row, col in self.get_empty_cells():
            self.board[row][col] = -1  # AI is -1
            score = self.minimax(0, False)
            self.board[row][col] = 0
            
            if score > best_score:
                best_score = score
                best_move = (row, col)
        
        return best_move

# Global game instance
game = TicTacToe()

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/reset', methods=['POST'])
def reset_game():
    game.reset()
    return jsonify({'status': 'success'})

@app.route('/move', methods=['POST'])
def make_move():
    data = request.json
    row = data.get('row')
    col = data.get('col')
    
    if game.make_move(row, col):
        # AI's turn
        if not game.game_over:
            ai_row, ai_col = game.get_ai_move()
            game.make_move(ai_row, ai_col)
        
        # Convert board to list for JSON serialization
        board_list = game.board.tolist()
        return jsonify({
            'status': 'success',
            'board': board_list,
            'game_over': game.game_over,
            'winner': game.winner,
            'current_player': game.current_player
        })
    
    return jsonify({'status': 'error', 'message': 'Invalid move'})

@app.route('/state', methods=['GET'])
def get_state():
    return jsonify({
        'board': game.board.tolist(),
        'game_over': game.game_over,
        'winner': game.winner,
        'current_player': game.current_player
    })

if __name__ == '__main__':
    app.run(debug=True)
