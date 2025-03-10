const { databaseMap } = require('../utils/database');
const { get_bot_name } = require('../variables');

module.exports = {
    name: 'status',
    description: 'More information about you',
    execute(message, args) {
        const { id: userId, globalName: userGlobalName } = message.author;

        // checking if user exist
        if (!databaseMap.has(userId)) {
            return message.channel.send(`**${userGlobalName}**, You are not registered. Use \`@${get_bot_name()} register\` to register.`);
        }

        const userBalance = databaseMap.get(userId).balance;
        const userXP = databaseMap.get(userId).exp;
        const userLevel = databaseMap.get(userId).level;
        const userWins = databaseMap.get(userId).wins;
        const userLosses = databaseMap.get(userId).losses;
        const userTotalBetsCount = databaseMap.get(userId).totalBetsCount;
        const userMaxReach = databaseMap.get(userId).maxReach;
        const userLoan = databaseMap.get(userId).loan;
        
        const embed = {
            color: 0x0099ff,
            title: `Status for ${userGlobalName}`,
            fields: [
                { value: `**${userBalance}** 🟡`, name: 'Balance', inline: false },
                { value: `**${userMaxReach}** 🟡`, name: 'Max Reach', inline: false },
                { value: `**${userXP}**`, name: 'XP', inline: true },
                { value: `**${userLevel}**`, name: 'Level', inline: true },
                { value: `**${userLoan}**`, name: 'Loan', inline: false },
                { value: `**${userWins}**`, name: 'Wins', inline: true },
                { value: `**${userLosses}**`, name: 'Losses', inline: true },
                { value: `**${userTotalBetsCount}**`, name: 'Total Rounds Played', inline: false },
            ]
        };

        message.channel.send({ embeds: [embed] });
    }
};