
let boardSize = 0; // records board size for reference
let backgroundImage = "(./images/setting1.jpg)";
let turn = false; // false is black, true is white
let gameState = {}; // stores value of each board space
let checked = []; // stores list of currently checked structure
let koRecord = ""; // records ko coordinate

let blackCaptured = 0; // tallys capture points for white
let whiteCaptured = 0; // tallys capture points for black

function checkOpponent(row, column) { // check for opponent stone on all sides of placed stone
    if ((row - 1) > 0 && gameState[(row - 1)][column] == !turn) {
        if (checkForLife(row - 1, column) == false) {
            removeStones();
        }
    }
    if ((column + 1) < (boardSize + 1) && gameState[row][(column + 1)] == !turn) {
        if (checkForLife(row, column + 1) == false) {
            removeStones();
        }
    }
    if ((row + 1) < (boardSize + 1) && gameState[(row + 1)][column] == !turn) {
        if (checkForLife(row + 1, column) == false) {
            removeStones();
        }
    }
    if ((column - 1) > 0 && gameState[row][(column - 1)] == !turn) {
        if (checkForLife(row, column - 1) == false) {
            removeStones();
        }
    }
}

function checkForLife(row, column) { // check stones and structures for life
    let stone = gameState[row][column];
    let above = `${row - 1}-${column}`;
    let right = `${row}-${column + 1}`;
    let below = `${row + 1}-${column}`;
    let left = `${row}-${column - 1}`;

    checked.push(`${row}-${column}`);

    if (checkForLiberties(row, column)) {
        checked = [];
        return true;
    } else if ((row - 1) > 0 && gameState[(row - 1)][column] == stone && !checked.includes(above) && checkForLife(row - 1, column)) {
        return true;
    } else if ((column + 1) < (boardSize + 1) && gameState[row][(column + 1)] == stone && !checked.includes(right) && checkForLife(row, column + 1)) {
        return true;
    } else if ((row + 1) < (boardSize + 1) && gameState[(row + 1)][column] == stone && !checked.includes(below) && checkForLife(row + 1, column)) {
        return true;
    } else if ((column - 1) > 0 && gameState[row][(column - 1)] == stone && !checked.includes(left) && checkForLife(row, column - 1)) {
        return true;
    } else {
        return false;
    }
}

function checkForLiberties(row, column) { // checks stones for liberties
    if (
        (row - 1) > 0 && gameState[(row - 1)][column] == 2 ||
        (column + 1) < (boardSize + 1) && gameState[row][(column + 1)] == 2 ||
        (row + 1) < (boardSize + 1) && gameState[(row + 1)][column] == 2 ||
        (column - 1) > 0 && gameState[row][(column - 1)] == 2) {
        return true;
    }
}

function removeStones() { // removes stones listed in "checked" array
    if (turn == false) {
        whiteCaptured += checked.length; // tally points for black
    } else {
        blackCaptured += checked.length; // tally points for white
    }

    if (checked.length == 1) {
        koRecord = checked[0]; // record to prevent ko
    }

    checked.forEach(coordinate => { // remove dead structure
        let square = document.getElementById(coordinate);
        square.style.removeProperty("background-image"); // remove from UI
        let coordinates = coordinate.split("-");
        gameState[coordinates[0]][(coordinates[1])] = 2; // remove from gameState
    });
    checked = []; // reset list of checked stones
}

function playStone(square) { // executes the play of a single stone
    let coordinates = square.id.split("-");
    let row = parseInt(coordinates[0]);
    let column = parseInt(coordinates[1]);

    if (gameState[row][column] != 2) { // prevents playing on top of stones
        return;
    }

    if (`${row}-${column}` == koRecord) { // checks for ko
        alert("Illegal move.");
        return;
    }
    koRecord = "";

    gameState[row][column] = turn; // updates the gameState

    checkOpponent(row, column); // checks for captures

    if (checkForLife(row, column) == false) { //checks for suicide
        alert("Illegal move.");
        gameState[row][column] = 2; // corrects the gameState
        return;
    }

    if (turn == false) { // updates the UI
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
function firstBoard(squares) { // generates the first board and starting gameState
    boardSize = squares;
    const board = document.querySelector("#board");

    const body = document.querySelector("body"); // set background image
    body.style.cssText = "background-image: url(./images/setting1.jpg)";

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

function newBoard() { // generates a new board of 5x5, 13x13, or 19x19
    let squares = prompt("What size board would you like? [5, 13, or 19]");
    const board = document.querySelector("#board");
    board.replaceChildren();
    firstBoard(squares);
}

function changeBackground() { // set new background image
    const backgroundImages = ["(./images/setting1.jpg)", "(./images/setting2.jpg)", "(./images/setting3.jpg)"]

    let i = backgroundImages.indexOf(backgroundImage);
    if (i == 2) {
        i = 0;
    } else {
        i++;
    }

    console.log(i);

    backgroundImage = backgroundImages[i];
    const body = document.querySelector("body");
    body.style.cssText = "background-image: url" + backgroundImages[i] + "";
}


firstBoard(19);
document.querySelector("#background-button").addEventListener("click", () => changeBackground());