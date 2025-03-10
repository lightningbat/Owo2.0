const { databaseMap } = require('../utils/database');
const { MaxBetAmount } = require('../utils/variables');
const xpCalculator = require('../utils/xpCalculator');
const calculateWin = require('../utils/winCalculator');
const num2words = require('number-to-words');
const { get_register_message, get_bot_name } = require('../variables');

const roundGifUrl = 'https://media.tenor.com/A304jUnS4nsAAAAj/dice-dice-roll.gif';
const victoryGifUrl = 'https://media.tenor.com/PzmnoMaIv8wAAAAi/congratulation-festivals.gif';
const loseGifUrl = 'https://c.tenor.com/0Ym9uQRAIoEAAAAC/tenor.gif';

module.exports = {
    name: 'bet',
    description: 'Place a bet',
    async execute(message, args) {
        // validating bet amount
        await validateArgs(args, message.author)
            .then((betAmount) => placeBet(message, betAmount))
            .catch((error) => message.channel.send(error));
    }
};

function validateArgs(args, user) {
    return new Promise((resolve, reject) => {
        // extracting user id and global name
        const { id: userId, globalName: userGlobalName } = user;
        let betAmount;
        let userBalance;

        // checking if user is registered
        if (!databaseMap.has(userId)) {
            reject(get_register_message(userGlobalName, get_bot_name()));
        } else {
            userBalance = databaseMap.get(userId).balance
        }
        // checking if has provided bet amount
        if (!args?.[1]) {
            reject(`**${userGlobalName}**, Please provide a amount to bet.`);
        } else {
            betAmount = args[1]
        }
        // checking if bet amount is either a Number or "all"
        if (!Number.isInteger(parseInt(betAmount)) && betAmount.toLowerCase() !== "all") {
            reject(`**${userGlobalName}**, Please provide a valid amount to bet.`);
        } else {
            // converting bet amount into a number if user provided "all"
            if (betAmount.toLowerCase() === "all") {
                betAmount = Math.min(userBalance, MaxBetAmount);
            }
            // converting bet amount to a integer number
            else {
                betAmount = parseInt(betAmount);
            }
        }
        // checking if user has enough balance
        if (betAmount > userBalance || betAmount < 1) {
            reject(`**${userGlobalName}**, Insufficient balance.\nYou currently have **${userBalance}** 🟡.`);
        }
        // checking if bet amount is within range
        if (betAmount < 1 || betAmount > MaxBetAmount) {
            reject(`**${userGlobalName}**, Bet amount must be between 1 and ${num2words.toWords(MaxBetAmount)}.`);
        }

        resolve(betAmount);
    })

}

async function placeBet(message, betAmount) {
    // extracting user id and global name
    const { id: userId, globalName: userGlobalName } = message.author;

    // updating user exp
    try {
        xpCalculator(message.channel, message.author, 10);
    } catch (error) {
        console.error(error);
        message.reply('There was an error while updating your exp!');
    }

    // calculating win chance and win amount multiplier based on bet amount
    const {
        winChance,
        winAmountMultiplier,
        simulationDelay 
    } = calculateWin(betAmount, databaseMap.get(userId).totalBetsCount);
    
    // global variables
    let winAmount = 0;
    let deductedWinAmount = 0;

    // simulating a random outcome
    const randomNumber = Math.random() * 100;
    let ifUserWon = false;

    if (randomNumber <= winChance) { // user won
        ifUserWon = true;
        // getting old data
        const old_balance = databaseMap.get(userId).balance;
        const old_maxReach = databaseMap.get(userId).maxReach;
        const old_loan = databaseMap.get(userId).loan;

        winAmount = Math.ceil(betAmount * winAmountMultiplier)

        let new_loan = old_loan;

        // checking if user has loan
        if (old_loan > 0) {
            // deducting 20% of win amount
            // if loan amount is less than 20% of win amount
            deductedWinAmount = Math.min(Math.floor(winAmount * 0.2), old_loan);
            winAmount -= deductedWinAmount;
            new_loan = old_loan - deductedWinAmount;
        }

        // writing data
        databaseMap.set(userId, {
            ...databaseMap.get(userId),
            balance: old_balance + winAmount,
            wins: databaseMap.get(userId).wins + 1,
            totalBetsCount: databaseMap.get(userId).totalBetsCount + 1,
            maxReach: Math.max(old_maxReach, old_balance + winAmount),
            loan: new_loan
        });
    }
    else { // user lost
        // writing data
        databaseMap.set(userId, {
            ...databaseMap.get(userId),
            balance: databaseMap.get(userId).balance - betAmount,
            losses: databaseMap.get(userId).losses + 1,
            totalBetsCount: databaseMap.get(userId).totalBetsCount + 1,
        });
    }

    // Handling visual part of user end
    // after doing all the calculations and writing data to database
    // to keep it working perfectly even when user spams the command
    const betEmbed = {
        color: 0x808080,
        title: 'Bet placed!',
        description: `${userGlobalName} bet ${betAmount} 🟡`,
        thumbnail: {
            url: roundGifUrl,
        },
    }

    // sending biding message
    const sentMessage = await message.channel.send({ embeds: [betEmbed] });

    // simulating delay
    await new Promise(resolve => setTimeout(resolve, simulationDelay));

    // sending result message
    if (ifUserWon) {
        const winEmbed = getWinEmbed(userGlobalName, betAmount, winAmount, deductedWinAmount);
        sentMessage.edit({ embeds: [winEmbed] });
    } else {
        const lossEmbed = {
            color: 0xff0000,
            title: 'You lost!',
            description: `**${userGlobalName}** bet ${betAmount} 🟡 And lost All`,
            thumbnail: {
                url: loseGifUrl,
            },
        }
        sentMessage.edit({ embeds: [lossEmbed] });
    }
}

function getWinEmbed(userGlobalName, betAmount, winAmount, deductedWinAmount) {
    const winEmbed = {
        color: 0x00ff00,
        title: 'You won!',
        description: `**${userGlobalName}** bet ${betAmount} 🟡 And won **${winAmount}** 🟡`,
        thumbnail: {
            url: victoryGifUrl,
        },
    }
    if (deductedWinAmount > 0) {
        winEmbed.footer = {
            text: `Loan deducted: ${deductedWinAmount} 🟡`
        }
    }
    return winEmbed
}