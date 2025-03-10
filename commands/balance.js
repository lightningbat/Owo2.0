const { databaseMap } = require('../utils/database');
const { get_bot_name } = require('../variables');

module.exports = {
    name: 'peek',
    description: 'Check your balance',
    execute(message, args) {
        const user = message.author;
        const userId = user.id;
        const userGlobalName = user.globalName;

        // checking if user exist
        if (!databaseMap.has(userId)) {
            return message.channel.send(`**${userGlobalName}**, You are not registered. Use \`@${get_bot_name()} register\` to register.`);
        }

        const userBalance = databaseMap.get(userId).balance;
        
        message.channel.send(`**${userGlobalName}**, You currently have **${userBalance}** 🟡`);
    }
};