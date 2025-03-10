const fs = require('fs');
const { get_bot_name } = require('../variables');

module.exports = {
    name: 'leaderboard',
    description: 'Show the leaderboard',
    execute(message, args) {
        // reading database
        const database = JSON.parse(fs.readFileSync('database.json', 'utf8'));
        // converting database to a map
        const databaseMap = new Map(Object.entries(database));

        // checking if user exist
        if (!databaseMap.has(message.author.id)) {
            return message.channel.send(`**${message.author.globalName}**, You are not registered. Use \`@${get_bot_name()} register\` to register.`);
        }

        const leaderboardEmbed = {
            color: 0x0099ff,
            title: 'Leaderboard',
            description: 'Top users by balance:',
            fields: []
        };

        const valueArray = Array.from(databaseMap.values());

        // sorting data by balance in descending order
        valueArray.sort((a, b) => b.balance - a.balance);

        // populating leaderboard embed
        for (let i = 0; i < 10 && i < valueArray.length; i++) {
            leaderboardEmbed.fields.push({ name: `${i + 1}. ${valueArray[i].globalName}`, value: valueArray[i].balance });
        }

        message.channel.send({ embeds: [leaderboardEmbed] });
    }
};