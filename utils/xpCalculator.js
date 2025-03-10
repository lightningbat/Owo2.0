const { databaseMap } = require('../utils/database');
const { EmbedBuilder } = require('discord.js');

/**
 * 
 * @param {Discord.TextChannel} channel 
 * @param {Discord.User} user
 * @param {number} xp_addup 
 */
function xpCalculator(channel, user, xp_addup) {

    const { id: user_id, globalName: user_global_name } = user;

    const { exp: old_xp, level: old_level } = databaseMap.get(user_id);

    const xp_required = (old_level + 1) * 100; // exp required to level up
    
    let new_xp = old_xp + xp_addup;

    // updating level if new xp has reached xp_required
    const new_level = new_xp >= xp_required ? old_level + 1 : old_level;

    // calculating level up bonus
    let levelUp_bonus = 0;
    if (new_level > old_level) {
        levelUp_bonus = new_level * 1000;
    }

    // calculating left over xp
    // e.g if xp_required = 100 and new_xp = 120
    // then left_over_xp = 20
    const left_over_xp = xp_required - new_xp;
    
    // adding up left over xp
    new_xp = left_over_xp <= 0 ? Math.abs(left_over_xp) : new_xp;

    // writing data
    databaseMap.get(user_id).exp = new_xp;
    databaseMap.get(user_id).level = new_level;

    if (levelUp_bonus > 0) {
        databaseMap.get(user_id).balance += levelUp_bonus;
    }

    if (new_level > old_level) {
        const userAvatarURL = user.displayAvatarURL({ dynamic: true, size: 256 })
        // sending embed message with user profile and bonus amount
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Level Up!')
            .setThumbnail(userAvatarURL)
            .setDescription(`**${user_global_name}**, You have reached level **${new_level}**! You have received **${levelUp_bonus}** 🟡`)

        channel.send({ embeds: [embed] });
    }
}

module.exports = xpCalculator