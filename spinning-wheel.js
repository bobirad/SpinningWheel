
const spinButton = document.querySelector('.spin-btn');
spinButton.addEventListener('click', () => {
    if (remainingSpins > 0) {
        spinWheel();
    }
});

const wheel = document.querySelector('.wheel');
const sectors = Array.from(document.querySelectorAll('.sector'));
const checkColor = document.querySelector('.check-color');
const currentWin = document.querySelector('.current-win');
const totalWin = document.querySelector('.total-win');
const spinsLeftEl = document.querySelector('.spins-left');

let remainingSpins = 10;
spinsLeftEl.textContent = remainingSpins;


let consecutiveWins = 0;
let lastWinIndex = -1;
let totalWins = 0;
let freeSpinsRemaining = 0;

function getRandomNumber() {
    let usedNumbers = [];

    for (let i = 1; i <= 12; i++) {
        let randomNumber = Math.floor(Math.random() * 11) + 1;
        while (usedNumbers.includes(randomNumber)) {
            randomNumber = Math.floor(Math.random() * 11) + 2;
        }
        usedNumbers.push(randomNumber);

    }

    return usedNumbers;
}
let sectorIndexes = getRandomNumber();
console.log('sector indexes:', sectorIndexes);
const winningSectors = [
    { sectorIndex: sectorIndexes[0], occurrences: 3 },
    { sectorIndex: sectorIndexes[1], occurrences: 2 },
    { sectorIndex: sectorIndexes[2], occurrences: 1 },
    { sectorIndex: sectorIndexes[3], occurrences: 1 },
    { sectorIndex: sectorIndexes[4], occurrences: 1 },
    { sectorIndex: sectorIndexes[5], occurrences: 1 },
    { sectorIndex: sectorIndexes[6], occurrences: 1 },

];

let winningSectorIndices = [];
winningSectors.forEach(winningSector => {
    const { sectorIndex, occurrences } = winningSector;
    winningSectorIndices = winningSectorIndices.concat(Array(occurrences).fill(sectorIndex));
});
console.log('winning sector indices: ', winningSectorIndices);
const nonWinningSectorIndices = Array.from(Array(sectors.length).keys()).filter(index => !winningSectorIndices.includes(index));

let rotationAngle = 0;
let spinCount = 0;

function spinWheel() {
    remainingSpins--;
    spinsLeftEl.textContent = remainingSpins;

    spinCount++;
    console.log("remaining spins:", remainingSpins);
    spinButton.disabled = true;
    let winIndex;
    if (consecutiveWins === 2) {
        winIndex = nonWinningSectorIndices[Math.floor(Math.random() * nonWinningSectorIndices.length)];
    } else {
        winIndex = winningSectorIndices[Math.floor(Math.random() * winningSectorIndices.length)];
    }
    while (winIndex === lastWinIndex) {
        winIndex = winningSectorIndices[Math.floor(Math.random() * winningSectorIndices.length)];
    }

    lastWinIndex = winIndex;

    console.log(winIndex)
    lastWinIndex = winIndex;
    let randomNumber2 = Math.floor(Math.random() * 29) + 1;

    rotationAngle += (360 - (winIndex * 30) + randomNumber2 + (spinCount * 3 * 360));
    console.log(rotationAngle);

    wheel.style.transform = `rotate(${rotationAngle}deg)`;

    rotationAngle = 0;

    setTimeout(() => {
        spinButton.disabled = false;

        const sectorValue = sectors[winIndex].querySelector('span').textContent;
        console.log(sectors[winIndex]);
        currentWin.textContent = sectorValue;
        if (currentWin.textContent != "Free Spins") {
            totalWins += Number(currentWin.textContent);
        }

        if (sectorValue === 'Free Spins') {
            freeSpinsRemaining += 3;
            remainingSpins += 3;
            spinsLeftEl.textContent = remainingSpins;

            autoSpin();
        } else {
            consecutiveWins = 0;
        }

        totalWin.textContent = totalWins;

        if (sectorValue !== 'Free Spins') {
            consecutiveWins++;
            if (consecutiveWins === 3) {
                const nonWinningSectors = sectors.filter((sector, index) => index !== winIndex);
                const nextWinIndex = Math.floor(Math.random() * nonWinningSectors.length);
                const nextWinSector = nonWinningSectors[nextWinIndex];
                nextWinSector.querySelector('span').textContent = 'Next Winner';
                consecutiveWins = 0;
            }
        }

        const winSector = sectors[winIndex];
        const winSectorColor = winSector.style.backgroundColor;
        checkColor.style.backgroundColor = winSectorColor;
    }, 5500);

}

function autoSpin() {
    if (freeSpinsRemaining > 0) {
        setTimeout(() => {
            setTimeout(() => {
                console.log("free spins remaining:", freeSpinsRemaining);
                spinWheel();
                freeSpinsRemaining--;
                autoSpin();
            }, 1000);
        }, 5000);

    }
}

