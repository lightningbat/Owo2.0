# Owo2.0 - Discord Economy Bot

Owo2.0 is a Discord bot inspired by the popular Owo bot, designed to provide a fun and engaging economy system for your server.

**Disclaimer:** This bot is not designed for production use. It is primarily a personal project intended for fun and learning. As such, it is not highly scalable and may not be suitable for large servers.

## Features

* **Inspired by Owo:** Mimics and expands upon the core economy features of the Owo bot.
* **Registration:** New users can register and receive a starting bonus.
* **Betting:** Users can bet coins with variable payouts based on the bet amount.
* **Balance Check:** Users can check their current coin balance.
* **Leaderboard:** View the top players on the server.
* **User Status:** Get detailed information about your user profile.
* **Daily Bonus:** Claim daily bonus coins with an increasing streak bonus.
* **Loans:** Borrow coins from the bot with an automatic repayment system.
* **Local JSON Database:** Uses a `database.json` file in the project directory for data storage.

## Commands

### User Registration

* `register`: Registers a new user and provides a starting bonus.

### Betting

* `bet <amount>`: Bets the specified amount of coins. Payouts are variable and depend on the bet amount.

### Balance and Leaderboard

* `peek`: Checks the user's current coin balance.
* `leaderboard`: Displays the top players based on their coin balance.
* `status`: Displays detailed information about the user's profile.

### Daily Bonus

* `daily`: Claims the daily bonus coins. The bonus amount increases by 1000 for each consecutive day claimed and decreases by 1000 for missed days.

### Loans

* `loan`: Borrows coins from the bot, up to a maximum of 20,000. Loans must be repaid before another loan can be issued. 20% of all bet winnings are automatically deducted to repay the loan.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lightningbat/Owo2.0
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure your bot:**
    * Create a `.env` file in the root directory.
    * Add your bot token: `BOT_TOKEN=your_bot_token`
4.  **Run the bot:**
    ```bash
    node index.js
    ```

## Dependencies

* [Discord.js](https://discord.js.org/)
* [Node.js](https://nodejs.org/)

## Data Storage

* `database.json`: A local JSON file is used to store user data. **Note:** This method is not recommended for production bots due to potential data loss and scalability limitations.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bug reports and feature requests.

## License

[MIT](LICENSE)