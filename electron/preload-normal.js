const { contextBridge } = require('electron');

// Right panel (browser-sync output) has no IPC access
contextBridge.exposeInMainWorld('electronAPI', {});
