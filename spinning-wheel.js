
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

let remainingSpins = 10;
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
    let randomNumber1 = Math.floor(Math.random() * 10) + 1;
    let randomNumber2 = Math.floor(Math.random() * 29) + 1;

    rotationAngle += (360 - (winIndex * 30) + randomNumber2 + (spinCount * 3 * 360));
    console.log(rotationAngle);

    wheel.style.transform = `rotate(${rotationAngle}deg)`;

    rotationAngle = 0;

    setTimeout(() => {
        spinButton.disabled = false;

        remainingSpins--;

        const sectorValue = sectors[winIndex].querySelector('span').textContent;
        console.log(sectors[winIndex]);
        currentWin.textContent = sectorValue;
        if (currentWin.textContent != "Free Spins") {
            totalWins += Number(currentWin.textContent);
        }

        if (sectorValue === 'Free Spins') {
            freeSpinsRemaining += 3;
            remainingSpins += 3;
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















// Event listener for the spin button

/*

let wheel = document.querySelector('.wheel');
let sectorsArray = ['sector-1', 'sector-2', 'sector-3', 'sector-4', 'sector-5', 'sector-6', 'sector-7', 'sector-8', 'sector-9', 'sector-10', 'sector-11', 'sector-12'];
let spinButton = document.querySelector('.spin-btn');
spinButton.addEventListener('click', startSpinning);

let value = Math.ceil(Math.random() * 5001);
let currentWin = document.querySelector('.current-win');
let totalWinEl = document.querySelector('.total-win');


function startSpinning() {


    var spinsRemaining = 10;



    spin();

    function spin() {
        // Check if there are spins remaining
        if (spinsRemaining > 0) {
            var stopSector1 = getRandomSectorIndex();
            var stopSector2 = getRandomSectorIndex();

            // Make sure stopSector2 is different from stopSector1
            while (stopSector2 === stopSector1) {
                stopSector2 = getRandomSectorIndex();
            }

            spinWheel(stopSector1, stopSector2, function () {
                spinsRemaining--;
                console.log('Spin complete! Spins remaining:', spinsRemaining);

                // Check for winning sectors
                var winningSector1 = getWinner(stopSector1, 3);
                var winningSector2 = getWinner(stopSector2, 2);

                if (winningSector1) {
                    console.log('Winner! Sector:', winningSector1);
                }
                if (winningSector2) {
                    console.log('Winner! Sector:', winningSector2);
                }

                // Trigger additional spins for winning sectors
                if (winningSector1 || winningSector2) {
                    console.log('Triggering additional spins for winning sectors...');
                    spinsRemaining += 3;
                }

                // Trigger additional spins for "Free spins" sector
                if (sectorsArray[stopSector1] === 'Free Spins' || sectorsArray[stopSector2] === 'Free spins') {
                    console.log('Triggering additional spins for Free spins sector...');
                    spinsRemaining += 3;
                }

                spin(); // Continue to the next spin
            });
        } else {
            console.log('All spins completed!');
        }
    }

    function spinWheel(stopSector1, stopSector2, callback) {
        //var duration = 5000; // 5 seconds
        //var startTime = Date.now();

        function animate() {
            /*var currentTime = Date.now();
            //var elapsedTime = currentTime - startTime;
            //var rotation = (360 / sectorsArray.length) * elapsedTime / duration;

            //wheel.style.transform = 'rotate(' + rotation + 'deg)';

            if (elapsedTime < duration) {
                requestAnimationFrame(animate);
            } else {
                let randomNumber1 = Math.floor(Math.random() * 10) + 1;
                let randomNumber2 = Math.floor(Math.random() * 29) + 1;

                let stopAngle1 = 360 - (stopSector1 * 30) +randomNumber2 + (randomNumber1*360);
                let stopAngle2 = 360 - (stopSector2 * 30) +randomNumber2 + (randomNumber1*360);

                wheel.style.transform = "rotate(" + stopAngle1 + "deg)";
                setTimeout(function () {
                    wheel.style.transform = "rotate(" + stopAngle2 + "deg)";
                    setTimeout(callback, 1000); // Wait for 1 second before executing the callback
                }, 1000); // Wait for 1 second before rotating to the second stop sector
            //}
        }

        animate();
    }

    function getRandomSectorIndex() {
        return Math.floor(Math.random() * (sectorsArray.length - 1));
    }

    function getWinner(stopSector, count) {
        var sector = sectorsArray[stopSector];
        var occurrences = 1;

        for (var i = 0; i < spinsRemaining; i++) {
            var spinSector = getRandomSectorIndex();
            if (sectorsArray[spinSector] === sector) {
                occurrences++;
                if (occurrences === count) {
                    return sector;
                }
            }
        }

        return null;
    }
}



*/

/*startGame();

function startGame() {
    let sectorsArray = ['sector-1', 'sector-2', 'sector-3', 'sector-4', 'sector-5', 'sector-6', 'sector-7', 'sector-8', 'sector-9', 'sector-10', 'sector-11', 'sector-12'];

    function getRandomSectorIndex() {
        return Math.floor(Math.random() * (sectorsArray.length-1));

    }
   

    let spinsRemaining = 10;



    let wheel = document.querySelector('.wheel');
    let spinButton = document.querySelector('.spin-btn');
    let value = Math.ceil(Math.random() * 5001);
    let currentWin = document.querySelector('.current-win');
    let totalWinEl = document.querySelector('.total-win');

    let sector1 = document.getElementById('sector1');
    sector1.style.backgroundColor = "#61bb46";
    let sector2 = document.getElementById('sector2');
    sector2.style.backgroundColor = "#fdb827";
    let sector3 = document.getElementById('sector3');
    sector3.style.backgroundColor = "#4200dc";
    let sector4 = document.getElementById('sector4');
    sector4.style.backgroundColor = "#e03a3e";
    let sector5 = document.getElementById('sector5');
    sector5.style.backgroundColor = "#A6DC00";
    let sector6 = document.getElementById('sector6');
    sector6.style.backgroundColor = "#009ddc";
    let sector7 = document.getElementById('sector7');
    sector7.style.backgroundColor = "#f5821f";
    let sector8 = document.getElementById('sector8');
    sector8.style.backgroundColor = "#00DCC5";
    let sector9 = document.getElementById('sector9');
    sector9.style.backgroundColor = "#00DC0C";
    let sector10 = document.getElementById('sector10');
    sector10.style.backgroundColor = "#800000";
    let sector11 = document.getElementById('sector11');
    sector11.style.backgroundColor = "#963d97";
    let sector12 = document.getElementById('sector12');
    sector12.style.backgroundColor = "#DC1B00";



    let totalWin = 0;
    spinButton.addEventListener('click', spin);
    let startTime = Date.now();
    let duration = 5000; // 5 seconds


    function spin() {
        let randomNumber = Math.floor(Math.random() * 29) + 1;
        //var stopAngle = (stopSector * sectorAngle) + randomNumber;

        let currentTime = Date.now();
        let elapsedTime = currentTime - startTime;
        let spinCount = 0;
        let stopSector1 = getRandomSectorIndex();
        let stopSector2 = getRandomSectorIndex();
        while (stopSector2 === stopSector1 || 
            (spinCount > 0 && (stopSector2 === stopSector1 + 1 || 
                (stopSector2 === 0 && stopSector1 === sectorsArray.length - 1)))) {
            stopSector2 = getRandomSectorIndex();
        }
        let rotation = ;
        console.log('stop sector1:',stopSector1)
        console.log('stop sector2:',stopSector2)

        if(spinsRemaining == 0){
            spinsRemaining = 10;
            totalWin = 0;
        }
        spinsRemaining--;
        console.log(spinsRemaining);
        console.log('rotation:', rotation);
        wheel.style.transform = "rotate(" + rotation + "deg)";
        setTimeout(() => {
            let pointer = document.querySelector('.check-color');
            let pointerRect = pointer.getBoundingClientRect();
            let pointerX = pointerRect.left + (pointerRect.width / 2);
            let pointerY = pointerRect.top + (pointerRect.width / 2);
            let sectorBelowPointer = document.elementFromPoint(pointerX, pointerY);
            let targetColor = getComputedStyle(sectorBelowPointer).backgroundColor;
            let sectors = Array.from(document.getElementsByClassName('sector'));
            let winningSector = sectors.find(sector => sector.style.backgroundColor === targetColor);
            if (winningSector.textContent === "Free Spins") {
                for (let i = 1; i <= 3; i++) {
                    wheel.style.transform = "rotate(" + value + "deg)";
                    value += Math.ceil(Math.random() * 5000);
                }
            } else {
                currentWin.textContent = winningSector.textContent;
                totalWin += Number(currentWin.textContent);
                totalWinEl.textContent = totalWin;
            }


        }, 5001);
        value += Math.ceil(Math.random() * 5001);
    }

}
*/




/*
let spinButton = document.querySelector('.spin-btn');
spinButton.addEventListener('click', startSpinning);



function startSpinning() {
    let wheel = document.querySelector('.wheel');
    let sectors = ['sector-1', 'sector-2', 'sector-3', 'sector-4', 'sector-5', 'sector-6', 'sector-7', 'sector-8', 'sector-9', 'sector-10', 'sector-11', 'sector-12'];
    var spinsRemaining = 10;

    spin();

    function spin() {
        console.log('spins remaining:',spinsRemaining);
        // Check if there are spins remaining
        if (spinsRemaining > 0) {
            var spinCount = 0;
            var stopSector1 = getRandomSectorIndex();
            var stopSector2 = getRandomSectorIndex();
            console.log('stop sector1:',stopSector1)
            console.log('stop sector2:',stopSector2)


            // Make sure stopSector2 is different from stopSector1 and they are not consecutive
            while (stopSector2 === stopSector1 || 
                (spinCount > 0 && (stopSector2 === stopSector1 + 1 || 
                    (stopSector2 === 0 && stopSector1 === sectors.length - 1)))) {
                stopSector2 = getRandomSectorIndex();
            }

            spinWheel(stopSector1, stopSector2, function () {
                spinCount++;

                if (spinCount < 5) {
                    spin();
                } else {
                    spinsRemaining--;
                    console.log('Spin complete! Spins remaining:', spinsRemaining);

                    // Trigger additional spins for "Free spins" sector
                    if (sectors[stopSector1] === 'FreeSpins' || sectors[stopSector2] === 'FreeSpins') {
                        console.log('Triggering additional spins for Free spins sector...');
                        spinsRemaining += 3;
                    }
                }
            });
        } else {
            console.log('All spins completed!');
        }
    }

    function spinWheel(stopSector1, stopSector2, callback) {
        var duration = 5000; // 5 seconds
        var startTime = Date.now();

        function animate() {
            var currentTime = Date.now();
            var elapsedTime = currentTime - startTime;
            console.log("sectors: ", sectors.length);
            var rotation = (360 / sectors.length) * elapsedTime / duration;
            console.log("rotation: ", rotation);
            let value = Math.ceil(Math.random() * 5001);

            wheel.style.transform = "rotate(" + value + "deg)";
            var stopAngle1 = (360 / sectors.length) * stopSector1;
            var stopAngle2 = (360 / sectors.length) * stopSector2;

            wheel.style.transform = "rotate(" + stopAngle1 + "deg)";
    
        }

        animate();
    }

    function getRandomSectorIndex() {
        return Math.floor(Math.random() * (sectors.length-1));
    }
}
*/










