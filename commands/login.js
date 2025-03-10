const { databaseMap } = require('../utils/database');
const { get_bot_name, get_register_message } = require('../variables');
const { LoginAmount } = require('../utils/variables');
const xpCalculator = require('../utils/xpCalculator');

module.exports = {
    name: 'daily',
    description: 'Login to your account',
    execute(message, args) {
        const { id: userId, globalName: userGlobalName } = message.author;

        let userLastLoginTimestamp;
        // tody timestamp with just date
        const dateToday = new Date().setHours(0, 0, 0, 0);
        const dateYesterday = new Date().setHours(0, 0, 0, 0) - 86400000;

        if (!databaseMap.has(userId)) {
            return message.channel.send(get_register_message(userGlobalName, get_bot_name()));
        } else {
            userLastLoginTimestamp = databaseMap.get(userId).lastLoginTimestamp
        }
        // checking if user already logged in today
        if (userLastLoginTimestamp && userLastLoginTimestamp === dateToday) {
            return message.channel.send(`**${userGlobalName}**, You have already collected your daily login bonus.`);
        }

        // checking if user logged in yesterday
        if (userLastLoginTimestamp && userLastLoginTimestamp === dateYesterday) {
            const userLastLoginAmount = databaseMap.get(userId).lastLoginAmount;
            const todayBonus = userLastLoginAmount + LoginAmount;
            databaseMap.get(userId).lastLoginAmount = todayBonus;
            databaseMap.get(userId).lastLoginTimestamp = dateToday;
            databaseMap.get(userId).loginStreak += 1;
            databaseMap.get(userId).balance += todayBonus;
            message.channel.send(`**${userGlobalName}**, You have logged in successfully today.\nYou have received ${todayBonus} 🟡 as a bonus for your daily login.`)
        } else {
            const userLastLoginAmount = databaseMap.get(userId).lastLoginAmount || LoginAmount;
            // calculating how many days user passed since last login
            const daysPassed = userLastLoginTimestamp ? Math.floor((dateToday - userLastLoginTimestamp) / 86400000) - 1 : 0;
            console.log("daysPassed", daysPassed);
            const todayBonus = Math.max((userLastLoginAmount - daysPassed * LoginAmount), LoginAmount);
            databaseMap.get(userId).lastLoginAmount = todayBonus;
            databaseMap.get(userId).lastLoginTimestamp = dateToday;
            databaseMap.get(userId).loginStreak = 1;
            databaseMap.get(userId).balance += todayBonus;
            message.channel.send(`**${userGlobalName}**, You have logged in successfully today.\nYou have received ${todayBonus} 🟡 as a bonus for your daily login.`)
        }

        // updating user exp
        try {
            xpCalculator(message.channel, message.author, 5);
        } catch (error) {
            console.error(error);
            message.reply('There was an error while updating your exp!');
        }
    }
}