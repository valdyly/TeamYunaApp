const { app, BrowserWindow, protocol, Menu } = require('electron');
const path = require('path');
const url = require('url');

// Menangani hak istimewa protokol file agar aman di Electron
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true, bypassCSP: true } }
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Membuka izin akses lokal untuk aset CSS/JS
    },
    icon: path.join(__dirname, 'src/assets/logo.png')
  });

  // Menghilangkan menu bar (File Edit View Window) secara total
  Menu.setApplicationMenu(null);

  // Memuat file index.html dari folder dist secara langsung menggunakan protocol standard
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});