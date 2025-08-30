# Tic Tac Toe AI Challenge - Internship Project

An unbeatable Tic Tac Toe AI built with Flask that uses the Minimax algorithm with Alpha-Beta pruning. This project demonstrates advanced AI concepts, web development skills, and provides a beautiful, responsive gaming experience.

## 🎯 Features

### 🧠 Advanced AI
- **Unbeatable AI Opponent**: Powered by Minimax algorithm with Alpha-Beta pruning
- **Optimal Gameplay**: Always makes the best possible move
- **Real-time Responses**: Instant AI moves with smooth animations

### 🎨 Beautiful Interface
- **Modern Design**: Clean, professional UI with gradient themes
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Confetti effects, hover animations, and transitions
- **Dark/Light Theme**: Professional color scheme with excellent contrast

### 📊 Game Statistics
- **Comprehensive Stats**: Track wins, losses, draws, and win percentage
- **Streak Tracking**: Current and best win streaks
- **Game History**: Persistent storage of past games
- **Motivational Messages**: Dynamic encouragement based on performance

### 🎮 Gaming Experience
- **Multiple Sections**: Home, Game, History, and About pages
- **Local Storage**: Game data persists across browser sessions
- **Confetti Celebration**: Visual feedback for victories
- **Thinking Indicators**: Shows when AI is calculating moves

## 🛠️ Technology Stack

### Backend
- **Python 3.x**: Core programming language
- **Flask**: Lightweight web framework
- **NumPy**: Efficient array operations for game board
- **Minimax Algorithm**: Optimal decision-making
- **Alpha-Beta Pruning**: Performance optimization

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Dynamic functionality and API interactions
- **Font Awesome Icons**: Professional UI elements

### Key Algorithms
- **Minimax**: Recursive search for optimal moves
- **Alpha-Beta Pruning**: Reduces search space for efficiency
- **Game State Evaluation**: Board analysis and scoring

## 📁 Project Structure

```
tic_tac_toe_ai/
├── app.py                 # Main Flask application with AI logic
├── static/
│   ├── css/
│   │   └── style.css      # Comprehensive styling and animations
│   └── js/
│       └── script.js      # Frontend functionality and game logic
├── templates/
│   └── home.html         # Main HTML template with multiple sections
└── README.md             # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip package manager
- Modern web browser

### Quick Start

1. **Navigate to the project directory**
   ```bash
   cd tic_tac_toe_ai
   ```

2. **Install required dependencies**
   ```bash
   pip install flask numpy
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser and visit**
   ```
   http://localhost:5000
   ```

5. **Start playing against the AI!**

## 📋 API Endpoints

### GET `/`
- **Description**: Renders the main application interface
- **Response**: HTML page with navigation and game sections

### POST `/move`
- **Description**: Processes player moves and returns AI response
- **Request Body**: `{"row": 0, "col": 0}`
- **Response**: JSON with updated game state

### POST `/reset`
- **Description**: Resets the game to initial state
- **Response**: `{"status": "success"}`

### GET `/state`
- **Description**: Returns current game state
- **Response**: JSON with board, game status, and player info

## 🎮 How to Play

1. **Start a Game**: Click "Start New Game" on the home page
2. **Make Your Move**: Click any empty cell (you play as X)
3. **Watch AI Response**: The AI (O) will instantly make its optimal move
4. **Win Condition**: Get three X's in a row, column, or diagonal
5. **Game Over**: Celebrate wins or learn from losses!

### Game Rules
- You play as **X**, AI plays as **O**
- Take turns placing your symbol on the 3x3 grid
- First to get three in a row wins
- Game ends in a draw if all cells are filled

## 🧠 AI Implementation

### Minimax Algorithm
The AI uses the Minimax algorithm to evaluate all possible moves and choose the optimal one. This ensures the AI never loses (it either wins or draws).

### Alpha-Beta Pruning
To optimize performance, Alpha-Beta pruning is implemented, which reduces the number of nodes evaluated in the search tree without affecting the final result.

### Key Features
- **Depth-first search** through game states
- **Evaluation function** scores board positions
- **Recursive backtracking** for optimal decision making
- **Early termination** for efficiency

## 🎨 UI/UX Features

### Design Elements
- **Gradient Color Scheme**: Professional purple/blue theme
- **Responsive Grid Layout**: Adapts to all screen sizes
- **Smooth Animations**: Hover effects, transitions, and confetti
- **Intuitive Navigation**: Clear section switching

### User Experience
- **Real-time Updates**: Instant feedback for all actions
- **Visual Feedback**: Color-coded cells and status messages
- **Progress Tracking**: Comprehensive statistics and history
- **Motivational System**: Encouraging messages based on performance

## 🔧 Development Features

### Code Organization
- **Modular Structure**: Separate concerns for backend and frontend
- **Clean Code**: Well-commented and organized
- **Error Handling**: Robust error management
- **Performance Optimized**: Efficient algorithms and data structures

### Technical Highlights
- **RESTful API Design**: Clean endpoint structure
- **Local Storage**: Client-side data persistence
- **Modern JavaScript**: ES6+ features and async/await
- **CSS Grid/Flexbox**: Modern layout techniques

## 🤝 Contributing

Contributions are welcome! This project demonstrates:

- **AI/ML Concepts**: Game theory and search algorithms
- **Web Development**: Full-stack Flask application
- **UI/UX Design**: Modern, responsive interfaces
- **Software Engineering**: Clean architecture and best practices

## 📄 License

This project is licensed under the MIT License.

---

**Challenge yourself against an unbeatable AI and improve your strategic thinking!** 🧠⚡
