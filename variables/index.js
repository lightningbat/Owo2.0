let botName;

/**
 * 
 * @param {string} user_global_name 
 * @param {string} bot_name 
 * @returns 
 */
const get_register_message = (user_global_name, bot_name) => `**${user_global_name}**, You are not registered. Use \`@${bot_name} register\` to register.`

module.exports = { 
    set_bot_name : (name) => botName = name,
    get_bot_name : () => botName,
    get_register_message
}