const { get_bot_name } = require('../variables');

module.exports = {
    name: 'help',
    description: 'List all available commands',
    execute(message, args) {
        const botName = get_bot_name();
        const helpEmbed = {
            color: 0x0099ff,
            title: 'Help',
            description: 'List of available commands:',
            fields: [
                { name: `@${botName} register`, value: 'Register a new user' },
                { name: `@${botName} bet <amount>`, value: 'Place a bet' },
                { name: `@${botName} peek`, value: 'Check your balance' },
                { name: `@${botName} leaderboard`, value: 'View the leaderboard' },
                { name: `@${botName} loan <amount>`, value: 'Get more coins' },
                { name: `@${botName} status`, value: 'More information about you' },
                { name: `@${botName} daily`, value: 'Daily login bonus' },
            ]
        };

        message.channel.send({ embeds: [helpEmbed] });
    }
}