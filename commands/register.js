const { databaseMap } = require('../utils/database');
const { RegisterAmount } = require('../utils/variables');

module.exports = {
    name: 'register',
    description: 'Register a new user',
    execute(message, args) {
        const user = message.author;
        const userId = user.id;
        const userGlobalName = user.globalName;

        if (databaseMap.has(message.author.id)) {
            return message.channel.send(`Silly **${userGlobalName}**, You are already registered.`);
        }

        databaseMap.set(userId, {
            globalName: userGlobalName,
            exp: 0,
            level: 0,
            balance: RegisterAmount,
            wins: 0,
            losses: 0,
            totalBetsCount: 0,
            maxReach: RegisterAmount,
            loan: 0,
            lastLoginAmount: null,
            lastLoginTimestamp: null,
            loginStreak: 0,
            timeStamp: new Date().getTime()
        });

        message.channel.send(`**${userGlobalName}**, You have been registered.\nAnd as a new user you get ${RegisterAmount} bonus coins 🟡.`);
    }
}