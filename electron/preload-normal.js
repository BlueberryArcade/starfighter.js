const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Used by the injected console panel to open a source file in VS Code.
  openInEditor: (sourceId, line) => ipcRenderer.send('editor:open', { sourceId, line })
});
