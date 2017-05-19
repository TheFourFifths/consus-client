import config from 'config';
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
        show: false,
        webPreferences: {
            experimentalFeatures: true
        }
    });

    // Open developer tools when in development mode
    if (process.argv.indexOf('--dev') > -1) {
        window.webContents.openDevTools();
    }

    // Capture an optional port from the command line args
    let port = process.argv.reduce((port, arg) => {
        return (arg.match(/^--port=(\d+)$/) || [0, port])[1];
    }, config.get('server.port'));

    // Load the app's webpage
    window.loadURL(`file://${__dirname}/index.html?port=${port}`);

    // Show the application once it's loaded
    window.once('ready-to-show', () => {
        window.show();
    });

    // Dereference the window when it's closed
    window.on('closed', () => {
        window = null;
    });

    // Listen for the back/forward buttons to be clicked (via mouse buttons)
    window.on('app-command', (e, cmd) => {
        if (cmd === 'browser-backward' && window.webContents.canGoBack()) {
            window.webContents.goBack();
        }
        if (cmd === 'browser-forward' && window.webContents.canGoForward()) {
            window.webContents.goForward();
        }
    });

    window.setMenu(null);
}

// Create window once Electron is initialized
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    app.quit();
});
