const { MaxBetAmount } = require("./variables")

function calculateWin(amount, userTotalBetCounts) {
    // win percentage
    let maxWinChance;
    let minWinChance; 
    // range within which win percentage is calculated
    let maxRange;
    let minRange;
    // win amount multiplier
    let minAmount;
    let maxAmount;
    // result delay for each bet in milliseconds
    let simulationDelay;

    if (amount >= 1 && amount <= 1000) {
        maxWinChance = 70;
        minWinChance = 65;
        minRange = 1;
        maxRange = 1000;
        minAmount = 0.3
        maxAmount = 1;
        simulationDelay = Math.floor(Math.random() * 500) + 500; // 500 - 1000
    } else if (amount >= 1001 && amount <= 5000) {
        maxWinChance = 65;
        minWinChance = 60;
        minRange = 1001;
        maxRange = 5000;
        minAmount = 1;
        maxAmount = 1.8;
        simulationDelay =  Math.floor(Math.random() * (1500 - 800 + 1) + 800); // 800 - 1500
    } else if (amount >= 5001 && amount <= 15000) {
        maxWinChance = 60;
        minWinChance = 55;
        minRange = 5001;
        maxRange = 15000;
        minAmount = 1.8;
        maxAmount = 3;
        simulationDelay =  Math.floor(Math.random() * (2000 - 1500 + 1) + 1500); // 1500 - 2000
    } else if (amount >= 15001 && amount <= 30000) {
        maxWinChance = 55;
        minWinChance = 50;
        minRange = 15001;
        maxRange = 30000;
        minAmount = 3;
        maxAmount = 4.5;
        simulationDelay =  Math.floor(Math.random() * (3000 - 2000 + 1) + 2000); // 2000 - 3000
    } else if (amount >= 30001 && amount <= 50000) {
        maxWinChance = 50;
        minWinChance = 45;
        minRange = 30001;
        maxRange = 50000;
        minAmount = 4.5;
        maxAmount = 6;
        simulationDelay =  Math.floor(Math.random() * (4000 - 3000 + 1) + 3000); // 3000 - 4000
    } else if (amount >= 50001 && amount <= 75000) {
        maxWinChance = 45;
        minWinChance = 40;
        minRange = 50001;
        maxRange = 75000;
        minAmount = 6;
        maxAmount = 7.5;
        simulationDelay =  Math.floor(Math.random() * (5000 - 4000 + 1) + 4000); // 4000 - 5000
    } else if (amount >= 75001 && amount <= 120000) {
        maxWinChance = 40;
        minWinChance = 35;
        minRange = 75001;
        maxRange = 120000;
        minAmount = 7.5;
        maxAmount = 10;
        simulationDelay =  Math.floor(Math.random() * (6000 - 5000 + 1) + 5000); // 5000 - 6000
    } else if (amount >= 120001 && amount <= MaxBetAmount) {
        maxWinChance = 35;
        minWinChance = 20;
        minRange = 120001;
        maxRange = MaxBetAmount;
        minAmount = 10;
        maxAmount = 15;
        simulationDelay =  Math.floor(Math.random() * (10000 - 6000 + 1) + 6000); // 6000 - 10000
    }

    // increasing win chance for new users
    if (userTotalBetCounts <= 7) {
        maxWinChance = 100 - userTotalBetCounts * 3;
        minWinChance = 95 - userTotalBetCounts * 2.5;
    }


    // calculating what percentage of the bet range the user has bet
    // e.g if user bet 1200 and if the range is 1000-2000 then amount_percent will be 20%
    const amount_percent = (( amount- (minRange - 1) ) / (maxRange - (minRange-1))) * 100;
    
    // calculating the exact win chance
    // e.g if amount_percent if 20% and if win chance range between 60-70% then win chance will be
    // 20% of max win chance minus min win chance, i.e 20% of 10 = 2 so win chance will be 70% - 2 = 68%
    const winChance =  maxWinChance - ((maxWinChance - minWinChance) * amount_percent / 100);

    // calculating the exact win amount multiplier
    // e.g if amount_percent if 20% and if win amount range between 1.2-1.8 then win amount will be
    // 20% of max win amount minus min win amount, i.e 20% of 0.6 = 0.12 so win amount will be 1.2 + 0.12 = 1.32
    const winAmountMultiplier = ((amount_percent / 100) * (maxAmount - minAmount)) + minAmount;

    return { winChance, winAmountMultiplier, simulationDelay };
}

module.exports = calculateWin;