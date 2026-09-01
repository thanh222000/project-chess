let boardState = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['',  '',  '',  '',  '',  '',  '',  ''],
    ['',  '',  '',  '',  '',  '',  '',  ''],
    ['',  '',  '',  '',  '',  '',  '',  ''],
    ['',  '',  '',  '',  '',  '',  '',  ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let selectedCell = null;
let currentTurn = 'white';
let moveHistory = [];
let capturedByWhite = [];
let capturedByBlack = [];

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function renderBoard() {
    const boardElement = document.getElementById('chessboard');
    boardElement.innerHTML = '';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = r;
            square.dataset.col = c;

            if (c === 0) {
                const rankLabel = document.createElement('span');
                rankLabel.classList.add('coordinate', 'rank');
                rankLabel.innerText = 8 - r;
                square.appendChild(rankLabel);
            }
            if (r === 7) {
                const fileLabel = document.createElement('span');
                fileLabel.classList.add('coordinate', 'file');
                fileLabel.innerText = files[c];
                square.appendChild(fileLabel);
            }

            let piece = boardState[r][c];
            if (piece !== '') {
                const img = document.createElement('img');
                img.src = getPieceImageFilename(piece);
                square.appendChild(img);
            }

            square.addEventListener('click', () => handleSquareClick(r, c));
            boardElement.appendChild(square);
        }
    }
}

function getPieceImageFilename(piece) {
    let color = piece === piece.toUpperCase() ? 'w' : 'b';
    return `${color}${piece.toLowerCase()}.png`;
}

function handleSquareClick(r, c) {
    let piece = boardState[r][c];

    if (selectedCell === null) {
        if (piece !== '') {
            let isWhitePiece = piece === piece.toUpperCase();
            if ((currentTurn === 'white' && isWhitePiece) || (currentTurn === 'black' && !isWhitePiece)) {
                selectedCell = { r, c };
                highlightSquare(r, c);
            }
        }
    } else {
        let startR = selectedCell.r;
        let startC = selectedCell.c;

        if (startR === r && startC === c) {
            selectedCell = null;
            renderBoard();
            return;
        }

        let targetPiece = boardState[r][c];
        
        if (targetPiece !== '') {
            let isTargetWhite = targetPiece === targetPiece.toUpperCase();
            let isSourceWhite = boardState[startR][startC] === boardState[startR][startC].toUpperCase();
            
            if (isTargetWhite !== isSourceWhite) {
                if (isSourceWhite) {
                    capturedByWhite.push(targetPiece);
                    updateCapturedUI();
                } else {
                    capturedByBlack.push(targetPiece);
                    updateCapturedUI();
                }
            }
        }

        boardState[r][c] = boardState[startR][startC];
        boardState[startR][startC] = '';

        let moveText = `${files[startC]}${8 - startR} -> ${files[c]}${8 - r}`;
        moveHistory.push(moveText);
        updateHistoryUI();

        currentTurn = currentTurn === 'white' ? 'black' : 'white';
        document.getElementById('turn-indicator').innerText = `Lượt: ${currentTurn === 'white' ? 'Trắng' : 'Đen'}`;

        selectedCell = null;
        renderBoard();
    }
}

function highlightSquare(r, c) {
    renderBoard();
    const squares = document.querySelectorAll('.square');
    squares.forEach(sq => {
        if (parseInt(sq.dataset.row) === r && parseInt(sq.dataset.col) === c) {
            sq.style.border = '2px solid #ffcc00';
        }
    });
}

function updateCapturedUI() {
    document.getElementById('white-captured').innerHTML = capturedByWhite.length > 0 
        ? capturedByWhite.map(p => `<img src="${getPieceImageFilename(p)}">`).join('') 
        : 'Chưa có';

    document.getElementById('black-captured').innerHTML = capturedByBlack.length > 0 
        ? capturedByBlack.map(p => `<img src="${getPieceImageFilename(p)}">`).join('') 
        : 'Chưa có';
}

function updateHistoryUI() {
    const historyList = document.getElementById('move-history');
    historyList.innerHTML = moveHistory.map((m, idx) => `<li>${idx + 1}. ${m}</li>`).join('');
    historyList.scrollTop = historyList.scrollHeight;
}

document.getElementById('btn-new').addEventListener('click', () => {
    boardState = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['',  '',  '',  '',  '',  '',  '',  ''],
        ['',  '',  '',  '',  '',  '',  '',  ''],
        ['',  '',  '',  '',  '',  '',  '',  ''],
        ['',  '',  '',  '',  '',  '',  '',  ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    currentTurn = 'white';
    moveHistory = [];
    capturedByWhite = [];
    capturedByBlack = [];
    document.getElementById('turn-indicator').innerText = 'Lượt: Trắng';
    updateCapturedUI();
    updateHistoryUI();
    renderBoard();
});

renderBoard();
