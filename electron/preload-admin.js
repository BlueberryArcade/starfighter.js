const { contextBridge, ipcRenderer } = require('electron');

const validSendChannels = ['tutorial:navigate', 'tutorial:edit', 'left:ready'];
const validReceiveChannels = ['game:error', 'game:clear-error'];

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (validReceiveChannels.includes(channel) && typeof func === 'function') {
      ipcRenderer.removeAllListeners(channel);
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  }
});
