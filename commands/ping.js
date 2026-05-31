module.exports = {
    name: 'ping',
    ownerOnly: false,
    execute(sock, msg, args) {
        sock.sendMessage(msg.key.remoteJid, { text: 'Titan-omega is alive and kicking! 🚀' });
    }
};

