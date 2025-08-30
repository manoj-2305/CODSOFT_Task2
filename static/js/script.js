// Game state and navigation
let currentPlayer = 1; // 1 for X (human), -1 for O (AI)
let gameHistory = [];
let currentStreak = 0;
let bestStreak = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Load game history from localStorage
    loadGameHistory();
    updateStats();
    setupNavigation();
    setupGameListeners();
    
    // Get initial state if on game page
    if (document.getElementById('board')) {
        try {
            const response = await fetch('/state');
            const data = await response.json();
            updateBoard(data.board);
            updateGameInfo(data);
        } catch (error) {
            console.error('Error getting initial state:', error);
        }
    }
});

// Navigation functions
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            
            // Update active navigation
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
            
            // If going to history, update it
            if (targetSection === 'history-section') {
                updateHistoryDisplay();
            }
        });
    });
    
    // Game launcher
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            showGamePopup();
        });
    }
    
    // Close game button
    const closeGameBtn = document.getElementById('closeGameBtn');
    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', () => {
            hideGamePopup();
        });
    }
    
    // Clear history button
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            clearGameHistory();
        });
    }
}

function showGamePopup() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById('game-section').classList.add('active');
    
    // Reset game when showing popup
    resetGame();
}

function hideGamePopup() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById('home-section').classList.add('active');
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector('[data-section="home-section"]').classList.add('active');
}

// Game functions
function updateBoard(board) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const value = board[row][col];
        
        cell.textContent = value === 1 ? 'X' : value === -1 ? 'O' : '';
        cell.className = 'cell';
        if (value === 1) cell.classList.add('x');
        if (value === -1) cell.classList.add('o');
    });
}

function updateGameInfo(gameState) {
    const gameInfo = document.getElementById('gameInfo');
    const message = document.getElementById('message');
    
    message.style.display = 'none';
    
    if (gameState.game_over) {
        if (gameState.winner === 1) {
            message.textContent = getWinMessage();
            message.className = 'message win';
            createConfetti();
            updateStreak(true);
        } else if (gameState.winner === -1) {
            message.textContent = '🤖 AI wins! Better luck next time!';
            message.className = 'message win';
            updateStreak(false);
        } else {
            message.textContent = '🤝 It\'s a draw! Good game!';
            message.className = 'message draw';
            updateStreak(false);
        }
        message.style.display = 'block';
        gameInfo.textContent = 'Game Over';
        
        // Save game to history
        saveGameToHistory(gameState);
    } else {
        gameInfo.textContent = gameState.current_player === 1 ? 
            'Your turn! You are X' : '🤖 AI is thinking...';
        
        if (gameState.current_player === -1) {
            gameInfo.classList.add('thinking');
        } else {
            gameInfo.classList.remove('thinking');
        }
    }
}

async function makeMove(row, col) {
    try {
        const response = await fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ row, col })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            updateBoard(data.board);
            updateGameInfo(data);
        }
    } catch (error) {
        console.error('Error making move:', error);
    }
}

async function resetGame() {
    try {
        const response = await fetch('/reset', {
            method: 'POST'
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            // Get current state
            const stateResponse = await fetch('/state');
            const stateData = await stateResponse.json();
            
            updateBoard(stateData.board);
            updateGameInfo(stateData);
        }
    } catch (error) {
        console.error('Error resetting game:', error);
    }
}

// Setup game event listeners
function setupGameListeners() {
    const cells = document.querySelectorAll('.cell');
    const resetBtn = document.querySelector('.reset-btn');
    
    if (cells.length > 0) {
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const row = parseInt(cell.getAttribute('data-row'));
                const col = parseInt(cell.getAttribute('data-col'));
                makeMove(row, col);
            });
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
}

// Local Storage and History functions
function loadGameHistory() {
    const savedHistory = localStorage.getItem('ticTacToeHistory');
    const savedStats = localStorage.getItem('ticTacToeStats');
    
    if (savedHistory) {
        gameHistory = JSON.parse(savedHistory);
    }
    
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        currentStreak = stats.currentStreak || 0;
        bestStreak = stats.bestStreak || 0;
    }
}

function saveGameToHistory(gameState) {
    const gameRecord = {
        date: new Date().toLocaleString(),
        result: gameState.winner === 1 ? 'win' : gameState.winner === -1 ? 'loss' : 'draw',
        moves: JSON.stringify(gameState.board),
        timestamp: Date.now()
    };
    
    gameHistory.unshift(gameRecord);
    
    // Keep only last 50 games
    if (gameHistory.length > 50) {
        gameHistory = gameHistory.slice(0, 50);
    }
    
    localStorage.setItem('ticTacToeHistory', JSON.stringify(gameHistory));
    updateStats();
    updateHistoryDisplay();
}

function updateStreak(isWin) {
    if (isWin) {
        currentStreak++;
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
        }
    } else {
        currentStreak = 0;
    }
    
    localStorage.setItem('ticTacToeStats', JSON.stringify({
        currentStreak,
        bestStreak
    }));
    
    updateStats();
}

function updateStats() {
    const wins = gameHistory.filter(game => game.result === 'win').length;
    const losses = gameHistory.filter(game => game.result === 'loss').length;
    const draws = gameHistory.filter(game => game.result === 'draw').length;
    const totalGames = gameHistory.length;
    const winPercentage = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    
    // Update home page stats
    const winsElement = document.getElementById('wins');
    const aiWinsElement = document.getElementById('aiWins');
    const drawsElement = document.getElementById('draws');
    const currentStreakElement = document.getElementById('currentStreak');
    const motivationText = document.getElementById('motivationText');
    
    if (winsElement) winsElement.textContent = wins;
    if (aiWinsElement) aiWinsElement.textContent = losses;
    if (drawsElement) drawsElement.textContent = draws;
    if (currentStreakElement) currentStreakElement.textContent = currentStreak;
    
    // Update motivation text
    if (motivationText) {
        motivationText.textContent = getMotivationMessage(currentStreak, wins, totalGames);
    }
    
    // Update history page stats
    const totalGamesElement = document.getElementById('totalGames');
    const winPercentageElement = document.getElementById('winPercentage');
    const bestStreakElement = document.getElementById('bestStreak');
    
    if (totalGamesElement) totalGamesElement.textContent = totalGames;
    if (winPercentageElement) winPercentageElement.textContent = `${winPercentage}%`;
    if (bestStreakElement) bestStreakElement.textContent = bestStreak;
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (gameHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No games played yet. Start playing to see your history!</p>';
        return;
    }
    
    historyList.innerHTML = gameHistory.map((game, index) => `
        <div class="history-item ${game.result}">
            <div class="history-date">${game.date}</div>
            <div class="history-result">
                ${game.result === 'win' ? '🎉 You won!' : 
                  game.result === 'loss' ? '🤖 AI won' : '🤝 Draw'}
            </div>
            <div class="history-moves">Game ${index + 1}</div>
        </div>
    `).join('');
}

function clearGameHistory() {
    if (confirm('Are you sure you want to clear all game history?')) {
        gameHistory = [];
        currentStreak = 0;
        bestStreak = 0;
        localStorage.removeItem('ticTacToeHistory');
        localStorage.removeItem('ticTacToeStats');
        updateStats();
        updateHistoryDisplay();
    }
}

// Motivation and messages
function getWinMessage() {
    const messages = [
        '🎉 Amazing victory! You outsmarted the AI!',
        '🏆 Champion! You beat the unbeatable!',
        '🔥 Incredible! The AI didn\'t see that coming!',
        '🌟 Brilliant move! You\'re a Tic-Tac-Toe master!',
        '💫 Victory! Your strategy was perfect!',
        '🚀 You did it! The AI is no match for you!',
        '🎯 Perfect game! Flawless victory!',
        '⭐ Outstanding! You cracked the AI\'s code!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function getMotivationMessage(streak, wins, totalGames) {
    if (totalGames === 0) {
        return 'Ready to challenge the AI? Let\'s go!';
    }
    
    if (streak > 0) {
        const streakMessages = [
            `🔥 ${streak} win streak! Keep the momentum going!`,
            `🚀 ${streak} in a row! You're on fire!`,
            `🌟 ${streak} consecutive wins! Amazing!`,
            `💫 ${streak} wins straight! Unstoppable!`
        ];
        return streakMessages[Math.floor(Math.random() * streakMessages.length)];
    }
    
    if (wins === 0) {
        return 'First win is around the corner! Keep trying!';
    }
    
    const generalMessages = [
        'Every game makes you better! Keep playing!',
        'The AI is tough, but you\'re tougher!',
        'Practice makes perfect! You\'re getting better!',
        'Next game could be your big win!',
        'You\'re learning the AI\'s patterns!',
        'Strategy is key! Think ahead!',
        'The more you play, the smarter you get!',
        'Challenge yourself! Beat your high score!'
    ];
    return generalMessages[Math.floor(Math.random() * generalMessages.length)];
}

// Confetti animation
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#667eea', '#764ba2'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (5 + Math.random() * 10) + 'px';
        confetti.style.height = (5 + Math.random() * 10) + 'px';
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}

// Export functions for global access
window.makeMove = makeMove;
window.resetGame = resetGame;
