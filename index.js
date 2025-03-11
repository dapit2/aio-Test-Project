import { useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import P from 'pino';
import { join } from 'path';
import { readdirSync } from 'fs';

// Initialize logger (debug mode)
const logger = P({ level: 'debug' }).child({ class: 'Baileys' });

// In-memory store for sessions
const store = makeInMemoryStore({ logger });
store.readFromFile('baileys_store.json');

// Load commands from 'commands' directory
const loadCommands = async () => {
  const commands = [];
  const files = readdirSync(join(__dirname, 'commands'));
  for (const file of files) {
    const command = await import(`./commands/${file}`);
    commands.push(command.default);
    logger.info(`Loaded command: ${command.default.name}`);
  }
  return commands;
};

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: state,
    printQRInTerminal: true,
    generateHighQualityLinkPreview: true,
  });

  // Auto-reconnect logic
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      if (statusCode === 401 || statusCode === 410) {
        logger.error('Session expired, scanning QR again...');
        await connectToWhatsApp();
      } else {
        logger.warn('Connection closed, reconnecting...');
        setTimeout(connectToWhatsApp, 5000);
      }
    } else if (connection === 'open') {
      logger.info('Connected successfully!');
    }
  });

  // Save credentials on change
  sock.ev.on('creds.update', saveCreds);

  // Message handler
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    // Extract text from extendedTextMessage
    const text = msg.message.extendedTextMessage?.text || msg.message.conversation;
    if (!text) return;

    logger.debug(`Received message: ${text} from ${msg.key.remoteJid}`);

    // Command handling
    const commands = await loadCommands();
    for (const command of commands) {
      if (command.pattern.test(text)) {
        try {
          await command.execute(sock, msg, text);
          logger.info(`Executed command: ${command.name}`);
        } catch (error) {
          logger.error(`Command failed: ${error.message}`);
        }
        break;
      }
    }
  });

  return sock;
};

// Start the bot
const startBot = async () => {
  try {
    await connectToWhatsApp();
  } catch (error) {
    logger.error('Failed to connect:', error);
    setTimeout(startBot, 5000);
  }
};

startBot();