// Step 1: Set Up the Board and Players
const theBoard = ["", "", "", "", "", "", "", "", ""];
const playerX = "X";
const computerO = "O";
let currentPlayer = playerX;
let gameActive = true;

const squares = document.querySelectorAll(".cells");
const gameStatus = document.getElementById("gameStatus");
const playAgainButton = document.getElementById("playAgainButton");
const playerScoreElement = document.getElementById("playerScore");
const tieScoreElement = document.getElementById("tieScore");
const computerScoreElement = document.getElementById("computerScore");
const resetScores = document.getElementById("resetScores");
const restartGameButton = document.getElementById("restartGameButton");

let playerWins = 0;
let computerWins = 0;
let ties = 0;

//--------Winning Conditions---------
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// ---------------- Turn Indicator ----------------
const updateTurnMessage = () => {
    if (!gameActive) return;
    gameStatus.textContent =
        currentPlayer === playerX ? "Player X (X)" : "PlayerO (O)";
};

// ---------------- Player Turn ----------------
squares.forEach((square, index) => {
    square.addEventListener("click", () => {
        if (!gameActive || theBoard[index] !== "") return;

        if (theBoard[index] === "" && currentPlayer === playerX) {
            theBoard[index] = playerX;
            square.textContent = playerX;

            const isGameOver = checkResult(playerX);
            if (!isGameOver) {
                currentPlayer = computerO;
                updateTurnMessage();
                setTimeout(handleComputerTurn, 500); // small delay feels natural
            }
        }
    });
});

// ---------------- Computer Turn (AI algorithm impremented) ----------------
const handleComputerTurn = () => {
    if (currentPlayer !== computerO) return;

    let moveIndex;
    //1) Check for a winning move (Highest priority
    moveIndex = findWinningMove(computerO);
    if (moveIndex !== null) {
        takeMove(moveIndex);
        return;
    }
    //2) Check for a blocking move on the playerX
    moveIndex = findWinningMove(playerX);
    if (moveIndex !== null) {
        takeMove(moveIndex);
        return;
    }
    //3) Take center square
    if (theBoard[4] === "") {
        takeMove(4);
        return;
    }

    // 4 Take the corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => theBoard[i] === "");
    if (availableCorners.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCorners.length);
        takeMove(availableCorners[randomIndex]);
        return;
    }

    // 4 Take the sides
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(i => theBoard[i] === "");
    if (availableSides.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSides.length);
        takeMove(availableSides[randomIndex]);
        return;
    }
};

// ---------------- Helper functions----------------
//-------Take move helper function------------
const takeMove = moveIndex => {
    theBoard[moveIndex] = computerO;
    squares[moveIndex].textContent = computerO;
    const isGameOver = checkResult(computerO);
    if (!isGameOver) {
        currentPlayer = playerX;
        updateTurnMessage();
    }
};

//----------------Find winning combo function------------
const findWinningMove = player => {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;

        if (theBoard[a] && theBoard[b] === player && theBoard[c] === "") {
            return c;
        }
        if (theBoard[a] && theBoard[c] === player && theBoard[b] === "") {
            return b;
        }
        if (theBoard[b] && theBoard[c] === player && theBoard[a] === "") {
            return a;
        }
        return null;
    }
};

// ---------------- Check for a win or a tie ----------------
const checkResult = winningPlayer => {
    const isAWin = winningConditions.some(condition => {
        const [a, b, c] = condition;
        return (
            theBoard[a] !== "" &&
            theBoard[a] === theBoard[b] &&
            theBoard[b] === theBoard[c]
        );
    });

    if (isAWin) {
        const winningCombo = winningConditions.find(
            ([a, b, c]) =>
                theBoard[a] !== "" &&
                theBoard[a] === theBoard[b] &&
                theBoard[b] === theBoard[c]
        );

        if (winningCombo) {
            winningCombo.forEach(i => squares[i].classList.add("winner"));
        }

        if (currentPlayer === playerX) {
            playerWins++;
            animateScoreUpdate(playerScoreElement, playerWins);
        } else {
            computerWins++;
            animateScoreUpdate(computerScoreElement, computerWins);
        }

        gameStatus.textContent = `${
            winningPlayer === playerX ? "Player X" : "Computer O"
        } has won!`;
        gameActive = false;
        playAgainButton.style.display = "block";
        updateScoreBoard();
        return true;
    }

    if (!theBoard.includes("")) {
        gameStatus.textContent = "It's a tie!";
        gameActive = false;
        playAgainButton.style.display = "block";
        updateScoreBoard();
        return true;
    }

    return false;
};

// ---------------- Reset Functions ----------------
const resetBoard = () => {
    gameActive = true;
    currentPlayer = playerX;
    for (let i = 0; i < theBoard.length; i++) theBoard[i] = "";

    squares.forEach(square => {
        square.textContent = "";
        square.classList.remove("winner");
    });

    gameStatus.textContent = "";
    playAgainButton.style.display = "none";
    updateTurnMessage();
};

const restartGame = () => {
    resetBoard();
    playerWins = 0;
    computerWins = 0;
    playerScoreElement.textContent = playerWins;
    computerScoreElement.textContent = computerWins;
    updateScoreBoard();
};

playAgainButton.addEventListener("click", resetBoard);
restartGameButton.addEventListener("click", restartGame);

const resetScoreBoard = () => {
    playerWins = 0;
    computerWins = 0;
    playerScoreElement.textContent = playerWins;
    computerScoreElement.textContent = computerWins;
    updateScoreBoard();
};
resetScores.addEventListener("click", resetScoreBoard);

// ---------------- Scoreboard Logic ----------------
const animateScoreUpdate = (element, newValue) => {
    element.classList.add("score-bump");
    setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove("score-bump");
    }, 300);
};

const updateScoreBoard = () => {
    playerScoreElement.classList.remove("leading", "tailing");
    computerScoreElement.classList.remove("leading", "tailing");

    if (playerWins > computerWins) {
        playerScoreElement.classList.add("leading");
        computerScoreElement.classList.add("tailing");
    } else if (computerWins > playerWins) {
        playerScoreElement.classList.add("tailing");
        computerScoreElement.classList.add("leading");
    }
};

updateTurnMessage();
updateScoreBoard();
