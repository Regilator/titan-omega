module.exports = {
    name: 'owner',
    ownerOnly: true, // This restricts access to only your number
    execute(sock, msg, args) {
        const ownerMenu = `
┏▣ ◈ *TITAN TECH OWNER MENU* ◈
┃ *Owner* : Nightwing
┃ *Status* : Active
┃ 
┃ ⚙️ *Commands:*
┃ ➽ restart
┃ ➽ update
┃ ➽ setbio
┃ ➽ setprofilepic
┗▣`;
        sock.sendMessage(msg.key.remoteJid, { text: ownerMenu });
    }
};

