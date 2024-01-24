const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');

const width = 8;

let playerGo = 'white';

playerDisplay.textContent = 'white';


const startPieces = [rook, knight, bishop, queen, king, bishop, knight, rook, pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, rook, knight, bishop, queen, king, bishop, knight, rook,];

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true);
        square.setAttribute('square-id', i);
        const row = Math.floor((63 - i) / 8) + 1;
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
        } else {
            square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
        }
        gameBoard.append(square);

        if (i <= 15) {
            square.firstChild.firstChild.classList.add('black');
        }

        if (i >= 48) {
            square.firstChild.firstChild.classList.add('white');
        }
    });
    reverseIds();
}

createBoard();


const allSquares = document.querySelectorAll('.square');

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}

function dragOver(e) {
    e.preventDefault();
    // console.log(e.target);
}

function dragDrop(e) {
    e.stopPropagation();
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo) || false;
    const valid = checkIfValid(e.target, takenByOpponent);
    console.log(valid);
    console.log(takenByOpponent);
    console.log(correctGo);
    if (correctGo) {
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            changePlayer();
            return;
        }
        if (taken && !takenByOpponent) {
            infoDisplay.textContent = "You can not go here!";
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return;
        }
        if (valid) {
            e.target.append(draggedElement);
            changePlayer();
        }
    }
}


function checkIfValid(target, takenByOpponent) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;
    switch (piece) {
        case 'pawn':
            return checkPawn(startId, targetId, takenByOpponent);
        case 'knight':
            return checkKnight(startId, targetId);
        case 'bishop':
            return checkBishop(startId, targetId);
        case 'rook':
            return checkRook(startId, targetId);
        case 'queen':
            return checkRook(startId, targetId) || checkBishop(startId, targetId);
        case 'king':
            return checkKing(startId, targetId);
    }
    return false;
}

function checkKnight(startId, targetId){
    if (
        startId + width * 2 - 1 === targetId
        || startId + width * 2 + 1 === targetId
        || startId + width - 2 === targetId
        || startId + width + 2 === targetId
        || startId - width - 2 === targetId
        || startId - width + 2 === targetId
        || startId - width * 2 - 1 === targetId
        || startId - width * 2 + 1 === targetId
    ) {
        return true;
    }
}

function checkPawn(startId, targetId, takenByOpponent){
    const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
    if (
        (starterRow.includes(startId) && startId + width * 2 === targetId && !takenByOpponent)
        || (startId + width === targetId && !takenByOpponent)
        || (startId + width - 1 === targetId && takenByOpponent)
        || (startId + width + 1 === targetId && takenByOpponent)
    ) {
        return true;
    }
    return false;
}

function checkKing(startId, targetId) {
    return targetId === startId + 1
        || targetId === startId - 1
        || targetId === startId + width
        || targetId === startId - width
        || targetId === startId + width + 1
        || targetId === startId + width - 1
        || targetId === startId - width + 1
        || targetId === startId - width - 1;

}


function checkRook(startId, targetId) {
    let changeNum = 8;
    if (targetId < startId) changeNum = -changeNum;
    for (let i = 1; i < width; i++) {
        const obstacles = [];
        if (startId + changeNum * i === targetId) {
            for (let j = 1; j < i; j++) {
                const obstacle = document.querySelector(`[square-id="${startId + changeNum * j}"]`).firstChild;
                if (obstacle) obstacles.push(obstacle);
            }
            return obstacles.length === 0;
        }
        if (startId - changeNum * i === targetId) {
            for (let j = 1; j < i; j++) {
                const obstacle = document.querySelector(`[square-id="${startId - changeNum * j}"]`).firstChild;
                if (obstacle) obstacles.push(obstacle);
            }
            return obstacles.length === 0;
        }
        if (startId + i === targetId) {
            for (let j = 1; j < i; j++) {
                const obstacle = document.querySelector(`[square-id="${startId + j}"]`).firstChild;
                if (obstacle) obstacles.push(obstacle);
            }
            return obstacles.length === 0;
        }
        if (startId - i === targetId) {
            for (let j = 1; j < i; j++) {
                const obstacle = document.querySelector(`[square-id="${startId - j}"]`).firstChild;
                if (obstacle) obstacles.push(obstacle);
            }
            return obstacles.length === 0;
        }
    }
    return false;
}

function checkBishop(startId, targetId) {
    let changeNum = width;
    if (targetId < startId) changeNum = -changeNum;
    for (let i = 1; i < width; i++) {
        const obstacles = [];
        if (startId + changeNum * i + i === targetId) {
            for (let j = 1; j < i; j++) {
                const obstacle = document.querySelector(`[square-id="${startId + changeNum * j + j}"]`).firstChild;
                if (obstacle) obstacles.push(obstacle);
            }
            return obstacles.length === 0;
        }
        if (startId + changeNum * i - i === targetId) {
            for (let j = 1; j < i; j++) {
                const obstacle = document.querySelector(`[square-id="${startId + changeNum * j - j}"]`).firstChild;
                if (obstacle) obstacles.push(obstacle);
            }
            return obstacles.length === 0;
        }
    }
    return false;
}

function changePlayer() {
    if (playerGo === 'black') {
        reverseIds();
        playerGo = 'white';
        playerDisplay.textContent = 'white';
    } else {
        reverseIds();
        playerGo = 'black';
        playerDisplay.textContent = 'black';
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square) => {
        square.setAttribute('square-id', (width * width - 1) - Number(square.getAttribute('square-id')));
    })
}
