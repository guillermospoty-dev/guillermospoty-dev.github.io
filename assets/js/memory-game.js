document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const boardContainer = document.getElementById('game-board');
    const difficultySelector = document.getElementById('difficulty-selector');
    const movesCount = document.getElementById('moves-count');
    const matchesCount = document.getElementById('matches-count');
    const startGameBtn = document.getElementById('start-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const winMessage = document.getElementById('win-message');
    const finalMovesSpan = document.getElementById('final-moves');

    // --- GAME DATA ---
    const cardIcons = [
        'bi-hammer', 
        'bi-wrench-adjustable', 
        'bi-compass', 
        'bi-rulers', 
        'bi-gear', 
        'bi-thermometer-half',
        'bi-diagram-3',
        'bi-lightning'
    ];
    
    // --- GAME STATE VARIABLES ---
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard = null;
    let secondCard = null;
    let totalMoves = 0;
    let matchedPairs = 0;
    let totalPairs = 0;
    
    // --- CONFIGURATION ---
    const difficultyConfigs = {
        'easy': { totalUniqueCards: 6, gridSizeClass: '4x3', cardClass: 'easy-mode' }, // 12 cards
        'hard': { totalUniqueCards: 8, gridSizeClass: '6x4', cardClass: 'hard-mode' }  // 16 cards
    };

    // --- HELPER FUNCTION: SHUFFLE ARRAY ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // ES6 swap
        }
        return array;
    }

    // --- GAME INITIALIZATION ---
    function initializeGame() {
        // Get current difficulty settings
        const difficulty = difficultySelector.value;
        const config = difficultyConfigs[difficulty];
        const uniqueCards = cardIcons.slice(0, config.totalUniqueCards);
        
        // Create card pairs and shuffle
        cards = [...uniqueCards, ...uniqueCards]; // Duplicate for pairs
        cards = shuffleArray(cards);
        
        totalPairs = config.totalUniqueCards;
        
        // Reset game state
        totalMoves = 0;
        matchedPairs = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        
        updateStats();
        winMessage.style.display = 'none';
        
        // Render the board
        renderBoard(config.cardClass);
        
        // Add event listeners to cards
        document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', flipCard));
        
        // Initial state: Disable cards until 'Start' is pressed
        disableAllCards(true); 
    }
    
   // --- RENDER THE GAME BOARD ---
function renderBoard(cardClass) {
    boardContainer.innerHTML = ''; // Clear board
    
    // Set column styles on the container itself
    const totalCards = cards.length;
    // Determine the number of columns based on total cards (12 -> 4, 16 -> 4)
    // The previous implementation used 4 and 6, but 4 columns is usually better for mobile/tablet.
    const columns = totalCards === 12 ? 4 : (totalCards === 16 ? 4 : 4); 
    
    boardContainer.style.gridTemplateColumns = `repeat(${columns}, auto)`; 
    boardContainer.style.display = 'grid';
    
    cards.forEach((iconOrImage, index) => { // Renamed from 'icon'
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card', cardClass);
        cardElement.setAttribute('data-value', iconOrImage); // Changed to data-value
        cardElement.id = `card-${index}`;
        
        // Use an image tag if the value is a file path (contains '.')
        let frontContent;
        if (iconOrImage.includes('.')) {
            frontContent = `<img src="assets/img/${iconOrImage}" alt="Card Image" class="card-image">`;
        } else {
            // Otherwise, treat it as a Bootstrap icon
            frontContent = `<i class="bi ${iconOrImage}"></i>`;
        }

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${frontContent}</div>
                <div class="card-back">M</div>
            </div>
        `;
        boardContainer.appendChild(cardElement);
    });
    
    // Attach event listeners to newly created cards
    document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', flipCard));
}
    // --- CARD FLIPPING LOGIC ---
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return; // Prevent double clicking the same card
        
        this.classList.add('flip');
        
        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second card flipped
        secondCard = this;
        totalMoves++;
        updateStats();
        
        checkForMatch();
    }
    
    // --- MATCH CHECK LOGIC ---
    function checkForMatch() {
        const isMatch = firstCard.getAttribute('data-icon') === secondCard.getAttribute('data-icon');
        
        isMatch ? disableCards() : unflipCards();
    }
    
    // --- MATCH FOUND ---
    function disableCards() {
        // Cards remain flipped and are marked as 'match'
        firstCard.classList.add('match', 'disabled');
        secondCard.classList.add('match', 'disabled');
        
        // Reset turn state
        resetBoard();
        
        matchedPairs++;
        updateStats();
        
        // Check for win condition
        if (matchedPairs === totalPairs) {
            finalMovesSpan.textContent = totalMoves;
            winMessage.style.display = 'block';
            disableAllCards(true);
        }
    }

   // --- NO MATCH ---
function unflipCards() {
    lockBoard = true; // Lock the board during the delay
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        // Reset turn state and unlock the board
        resetBoard();
    }, 1000); // 1 second delay
}
    
    // --- RESET TURN STATE ---
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // --- DISABLE/ENABLE ALL CARDS (for start/win) ---
    function disableAllCards(isDisabled) {
        document.querySelectorAll('.memory-card').forEach(card => {
            if (isDisabled) {
                card.classList.add('disabled');
            } else {
                // Only remove disabled class if it's not a match
                if (!card.classList.contains('match')) {
                     card.classList.remove('disabled');
                }
            }
        });
    }

    // --- UPDATE STATS PANEL ---
    function updateStats() {
        movesCount.textContent = totalMoves;
        matchesCount.textContent = matchedPairs;
    }

    // --- EVENT LISTENERS ---
    
  // Start Game Button
startGameBtn.addEventListener('click', () => {
    // 1. Initialize and render the new board
    initializeGame(); 
    
    // 2. Lock the board and disable clicks before the preview starts
    lockBoard = true;
    disableAllCards(true); 

    // 3. Show all cards for preview
    document.querySelectorAll('.memory-card').forEach(card => card.classList.add('flip'));
    
    // 4. Hide all cards and enable play after delay
    setTimeout(() => {
        document.querySelectorAll('.memory-card').forEach(card => card.classList.remove('flip'));
        lockBoard = false;
        disableAllCards(false); // Enable only unmatched cards for play
    }, 2000); 

    startGameBtn.style.display = 'none';
    restartGameBtn.textContent = 'Restart Game';
});

    // Restart Game Button
    restartGameBtn.addEventListener('click', () => {
        // Immediate restart: reset state and re-render
        initializeGame();
        
        // Show the cards for a quick preview before play
        document.querySelectorAll('.memory-card').forEach(card => card.classList.add('flip'));
        
        setTimeout(() => {
            document.querySelectorAll('.memory-card').forEach(card => card.classList.remove('flip'));
            disableAllCards(false); // Enable for play
        }, 2000); // 2 second preview time
    });

    // Difficulty Change
    difficultySelector.addEventListener('change', () => {
        initializeGame();
        startGameBtn.style.display = 'inline-block';
        restartGameBtn.textContent = 'Reset Game';
        boardContainer.innerHTML = '<p class="text-center text-muted mt-5">Press \'Start Game\' to begin!</p>';
        boardContainer.style.display = 'block';
    });
    
    // --- Initial setup on load ---
    initializeGame();
});
