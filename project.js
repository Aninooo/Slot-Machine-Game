const SYMBOLS_COUNT = { A: 2, B: 4, C: 6, D: 8 };
const SYMBOL_VALUES = { A: 5, B: 4, C: 3, D: 2 };
const ROWS = 3;
const COLS = 3;

let balance = 100;

document.getElementById('deposit-btn').addEventListener('click', () => {
    const depositAmount = parseFloat(document.getElementById('deposit').value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Invalid deposit amount, try again.");
    } else {
        balance += depositAmount;
        document.getElementById('balance').textContent = balance;
    }
});

document.getElementById('spin-btn').addEventListener('click', () => {
    const numberOfLines = parseInt(document.getElementById('lines').value);
    const bet = parseFloat(document.getElementById('bet').value);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
        alert("Invalid number of lines, try again.");
        return;
    }

    if (isNaN(bet) || bet <= 0 || bet > balance / numberOfLines) {
        alert("Invalid bet, try again.");
        return;
    }

    balance -= bet * numberOfLines;
    document.getElementById('balance').textContent = balance;

    const reels = spin();
    const rows = transpose(reels);
    displayRows(rows);

    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    document.getElementById('balance').textContent = balance;

    document.getElementById('message').textContent = `You won $${winnings}`;
});

function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
}

function transpose(reels) {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

function displayRows(rows) {
    for (let i = 0; i < ROWS; i++) {
        document.getElementById(`reel-${i + 1}`).textContent = rows[i].join(' | ');
    }
}

function getWinnings(rows, bet, lines) {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}
    