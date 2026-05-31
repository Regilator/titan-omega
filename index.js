const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const { isOwner } = require('./lib/auth');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('Titan-omega is now online!');
        }
    });

    // Dynamic command loader
    const commands = new Map();
    // Ensure the directory exists to prevent errors
    if (!fs.existsSync('./commands')) fs.mkdirSync('./commands');
    
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.set(command.name, command);
    }

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        if (!text.startsWith('*')) return; // Prefix is *

        const args = text.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        if (!commands.has(commandName)) return;

        const command = commands.get(commandName);

        // Check if command is Owner-only
        if (command.ownerOnly && !isOwner(msg.key.remoteJid.split('@')[0])) {
            return sock.sendMessage(msg.key.remoteJid, { text: "⚠️ This command is restricted to the Owner only." });
        }

        try {
            command.execute(sock, msg, args);
        } catch (error) {
            console.error(error);
            sock.sendMessage(msg.key.remoteJid, { text: "❌ An error occurred while executing this command." });
        }
    });
}

connectToWhatsApp();

