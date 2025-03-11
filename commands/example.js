export default {
    name: 'example',
    pattern: /^!ping/i,
    execute: async (sock, msg) => {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Pong!' });
    }
  };