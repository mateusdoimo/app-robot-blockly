// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, net } = require('electron')
const path = require('path')

const wifi = require('node-wifi');
const util = require('util');


// Função para listar as redes Wi-Fi disponíveis
function scanWifiNetworks() {
    return new Promise((resolve, reject) => {
        wifi.scan((error, networks) => {
            if (error) {
                reject(error);
            } else {
                resolve(networks);
            }
        });
    });
}

function getCurrentConnectionsAsync() {
    return new Promise((resolve, reject) => {
        wifi.getCurrentConnections((error, currentConnections) => {
            if (error) {
                reject(error);
            } else {
                resolve(currentConnections);
            }
        });
    });
}

async function getWifi() {
    try {
        const networks = await scanWifiNetworks();
        return networks
    } catch (error) {
        console.error('Erro ao escanear redes WiFi:', error);
        return false
    }
}

async function verificarRedeWifi() {
    try {
        // Obtenha informações sobre as redes WiFi disponíveis
        const currentConnections = await getCurrentConnectionsAsync();

        if (currentConnections && currentConnections.length > 0) {
            return currentConnections; // O nome da rede à qual você está conectado
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

async function connectToWiFi() {
    // Configure as informações da rede Wi-Fi
    const ssid = 'ROBO-ESP32'; // Substitua pelo nome da sua rede Wi-Fi
    const password = 'password';   // Substitua pela senha da sua rede Wi-Fi

    try {
        // Use await para aguardar a conexão e capturar quaisquer erros
        await wifi.connect({ ssid, password });
        return true;
    } catch (error) {
        console.error(error)
        return false;
    }
}

require('electron-reload')(__dirname)

const createWindow = () => {

    wifi.init({
        iface: null // network interface, choose a random wifi interface if set to null
    });

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true,
    })

    mainWindow.webContents.openDevTools();

    const iconPath = path.join(__dirname, 'img/puzzle.ico'); // Substitua 'seu-icone.ico' pelo nome do seu ícone
    mainWindow.setIcon(iconPath);


    // and load the index.html of the app.
    mainWindow.loadFile('./src/index.html')

    //listAvailableNetworks();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', getWifi)
    ipcMain.handle('wifiConectado', verificarRedeWifi)
    ipcMain.handle('connectToWiFi', connectToWiFi)
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. Você também pode colocar eles em arquivos separados e requeridos-as aqui.