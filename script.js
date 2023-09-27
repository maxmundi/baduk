
let turn = false; // false is black, true is white
let gameState = {}; // stores value of each board space
let checked = [];

let blackCaptured = 0;
let whiteCaptured = 0;

function addStoneToGamestate(row, column) {
    gameState[row][column] = turn;
}

function checkOpponent(row, column) {
    let above = { row: row - 1, column: column };
    let right = { row: row, column: column + 1 };
    let below = { row: row + 1, column: column };
    let left = { row: row, column: column - 1 };

    if ((row - 1) > 0 && gameState[(row - 1)][column] == !turn && !checked.includes(above)) {
        if (checkForLife(row - 1, column) == false) {
            removeStones();
        }
    }
    if ((column + 1) < 20 && gameState[row][(column + 1)] == !turn && !checked.includes(right)) {
        if (checkForLife(row, column + 1) === false) {
            removeStones();
        }
    }
    if ((row + 1) < 20 && gameState[(row + 1)][column] == !turn && !checked.includes(below)) {
        if (checkForLife(row + 1, column) === false) {
            removeStones();
        }
    }
    if ((column - 1) > 0 && gameState[row][(column - 1)] == !turn && !checked.includes(left)) {
        if (checkForLife(row, column - 1) === false) {
            removeStones();
        }
    }
    checked = [];
}

function checkForLife(row, column) {
    let stone = gameState[row][column];
    let stoneCoordinate = { row: row, column: column };
    let above = `${row - 1}-${column}`;
    let right = `${row}-${column + 1}`;
    let below = `${row + 1}-${column}`;
    let left = `${row}-${column - 1}`;

    checked.push(`${row}-${column}`);

    if (checkForLiberties(row, column)) {
        return true;
    } else if ((row - 1) > 0 && gameState[(row - 1)][column] == stone && !checked.includes(above) && checkForLife(row - 1, column)) {
        return true;
    } else if ((column + 1) < 20 && gameState[row][(column + 1)] == stone && !checked.includes(right) && checkForLife(row, column + 1)) {
        return true;
    } else if ((row + 1) < 20 && gameState[(row + 1)][column] == stone && !checked.includes(below) && checkForLife(row + 1, column)) {
        return true;
    } else if ((column - 1) > 0 && gameState[row][(column - 1)] == stone && !checked.includes(left) && checkForLife(row, column - 1)) {
        return true;
    } else {
        return false;
    }
}

function checkForLiberties(row, column) {
    if (
        (row - 1) > 0 && gameState[(row - 1)][column] == 2 ||
        (column + 1) < 20 && gameState[row][(column + 1)] == 2 ||
        (row + 1) < 20 && gameState[(row + 1)][column] == 2 ||
        (column - 1) > 0 && gameState[row][(column - 1)] == 2) {
        return true;
    }
}

function removeStones() {
    if (turn == false) {
        whiteCaptured += checked.length;
    } else {
        blackCaptured += checked.length;
    }

    checked.forEach(coordinate => {
        let square = document.getElementById(coordinate);
        square.style.removeProperty("background-image");
        let coordinates = coordinate.split("-");
        gameState[coordinates[0]][(coordinates[1])] = 2;
    });
    checked = [];
}

function playStone(square) {
    let coordinates = square.id.split("-");
    let row = parseInt(coordinates[0]);
    let column = parseInt(coordinates[1]);

    if (gameState[row][column] != 2) {
        return;
    }

    addStoneToGamestate(row, column);

    checkOpponent(row, column);


    if (turn == false) {
        square.style.cssText = "background-image: url(./images/blackstone.png); background-size: cover";
        turn = !turn;
        return;
    } else {
        square.style.cssText = "background-image: url(./images/whitestone.png); background-size: cover";
        turn = !turn;
        return;
    }
}

/* Generate the first 19x19 board*/
function firstBoard(squares) {
    const board = document.querySelector("#board");
    const squareWidth = 700 / squares;

    for (i = 0; i < squares; ++i) {
        const row = document.createElement("div");
        row.className += "row";
        gameState[i + 1] = {};
        row.style.cssText += "height: " + (700 / squares) + "px";
        for (j = 0; j < squares; ++j) {
            const square = document.createElement("div");
            square.className += "square";
            square.id = "" + (i + 1) + "-" + (j + 1) + "";
            gameState[i + 1][j + 1] = 2;
            square.addEventListener("click", () => playStone(square));
            row.appendChild(square);
        }
        board.appendChild(row);
    }

    if (squares == 19) {
        board.style.cssText = "background-image: url(./images/goboard19.png)"
    }
}

/* Generate a new board of 5x5, 13x13, or 19x19 */
function newBoard() {
    let squares = prompt("What size board would you like? [5, 13, or 19]");
    const board = document.querySelector("#board");
    board.replaceChildren();
    firstBoard(squares);
}

firstBoard(19);