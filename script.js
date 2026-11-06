// Super Piškvorky - win male boxy
const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let currentBoard = 0;
let currentPlayer = 'X';
let scores = { X: 0, O: 0 };
let isGameOver = false;

const info = document.getElementById('info');
const boards = document.querySelectorAll('.boards-container .board');
const mainCells = document.querySelectorAll('.main-board .cell');

// První deska je aktivní
if (mainCells[0]) {
    mainCells[0].classList.add('active-target');
}

function updateInfo() {
    const tag = currentPlayer.toLowerCase();
    info.innerHTML = `Na tahu: <span class="player-tag tag-${tag}">${currentPlayer}</span> (Deska ${currentBoard + 1}/9 | Body: X: ${scores.X}, O: ${scores.O})`;
}

updateInfo();

//kliknutí na jednotlivá políčka
boards.forEach((board) => {
    const boardIndex = parseInt(board.dataset.board, 10);
    const cells = board.querySelectorAll('.cell');

    cells.forEach((cell) => {
        cell.addEventListener('click', () => {
            // Lze hrát jen v aktuální desce, do volného pole a dokud hra neskončila
            if (isGameOver || boardIndex !== currentBoard || cell.textContent !== '') {
                return;
            }

            // Zápis tahu
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase());

            // Kontrola výhry v aktuální desce
            if (checkWin(cells, currentPlayer)) {
                scores[currentPlayer]++;
                board.classList.add(`won-${currentPlayer.toLowerCase()}`, 'disabled');
                mainCells[currentBoard].classList.add(`won-${currentPlayer.toLowerCase()}`);
                mainCells[currentBoard].textContent = currentPlayer;
                nextBoard();
            } else if (isBoardFull(cells)) {
                // Remíza v dané desce
                board.classList.add('draw', 'disabled');
                mainCells[currentBoard].classList.add('draw');
                mainCells[currentBoard].textContent = '-';
                nextBoard();
            } else {
                // Přepnutí hráče pro další tah v téže desce
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateInfo();
            }
        });
    });
});

function checkWin(cells, player) {
    return WINNING_COMBOS.some(([a, b, c]) => {
        return cells[a].textContent === player &&
            cells[b].textContent === player &&
            cells[c].textContent === player;
    });
}

function isBoardFull(cells) {
    return Array.from(cells).every(cell => cell.textContent !== '');
}

function nextBoard() {
    boards[currentBoard].classList.remove('active');
    mainCells[currentBoard].classList.remove('active-target');

    currentBoard++;

    // Kontrola konce všech 9 desek
    if (currentBoard >= 9) {
        isGameOver = true;
        if (scores.X > scores.O) {
            info.innerHTML = `Vítěz: Hráč X! (${scores.X} : ${scores.O})`;
        } else if (scores.O > scores.X) {
            info.innerHTML = `Vítěz: Hráč O! (${scores.O} : ${scores.X})`;
        } else {
            info.innerHTML = `Konec hry: Remíza! (${scores.X} : ${scores.O})`;
        }
        return;
    }

    // Aktivace další desky v pořadí
    boards[currentBoard].classList.add('active');
    mainCells[currentBoard].classList.add('active-target');

    // Střídání hráče pro novou desku
    currentPlayer = currentBoard % 2 === 0 ? 'X' : 'O';
    updateInfo();
}
