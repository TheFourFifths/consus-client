import electron from 'electron';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// The browser window
let window;

// Create the main app window
function createWindow() {
    // Create the browser window
    window = new BrowserWindow({
        fullscreen: true,
        show: false
    });

    // Open developer tools when in development mode
    if (process.argv.indexOf('--dev') > -1) {
        window.webContents.openDevTools();
    }

    // Load the app's webpage
    window.loadURL('file://' + __dirname + '/index.html');

    // Show the application once it's loaded
    window.once('ready-to-show', () => {
        window.show();
    });

    // Dereference the window when it's closed
    window.on('closed', () => {
        window = null;
    });

    window.setMenu(null);
}

// Create window once Electron is initialized
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    app.quit();
});
