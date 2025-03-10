const { databaseMap } = require('../utils/database');
const { MaxLoanAmount } = require('../utils/variables');
const { get_bot_name, get_register_message } = require('../variables');

module.exports = {
    name: 'loan',
    description: 'Get a loan',
    execute(message, args) {
        const { id: userId, globalName: userGlobalName } = message.author;
        let loanReqAmount;
        let old_loan;
        
        // checking if user exist
        if (!databaseMap.has(userId)) {
            return message.channel.send(get_register_message(userGlobalName, get_bot_name()));
        }
        //checking if loan amount is provided
        if (!args?.[1]) {
            return message.channel.send(`**${userGlobalName}**, Please provide a amount to loan.`);
        } else {
            loanReqAmount = parseInt(args[1]);
            old_loan = databaseMap.get(userId).loan
        }
        // checking if loan amount is valid
        if (!Number.isInteger(loanReqAmount)) {
            return message.channel.send(`**${userGlobalName}**, Please provide a valid amount to loan.`);
        }
        // checking if user loan is less than total giveable loan
        if (MaxLoanAmount - old_loan < loanReqAmount) {
            if (MaxLoanAmount - old_loan === 0) {
                return message.channel.send(`**${userGlobalName}**, You have reached the maximum loan limit of ${MaxLoanAmount} 🟡`);
            }
            return message.channel.send(`**${userGlobalName}**, You can't loan more than ${MaxLoanAmount - old_loan} 🟡`);
        }

        // updating data
        databaseMap.get(userId).loan += loanReqAmount;
        databaseMap.get(userId).balance += loanReqAmount;

        // sending response
        message.channel.send(`**${userGlobalName}**, You have loaned **${loanReqAmount}** 🟡 Now you have **${databaseMap.get(userId).balance}** 🟡`);
    }
}