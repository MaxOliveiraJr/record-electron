const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron');
const path = require('path')
const os = require("os");

const isDev = process.env.NODE_DEV !== undefined && process.env.NODE_DEV === "development" ? true : false;

const isMac = process.platform === 'darwin' ? true : false;

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 600,
        icon: path.join(__dirname, "assets", "icon", "progBR.png"),
        backgroundColor: "#123",
        show: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'src', 'preload.js')
        }
    });
    win.loadFile("./src/index.html");
    if (isDev) {
        win.webContents.openDevTools();
    }
    win.once('ready-to-show', () => {
        win.show();
        setTimeout(() => {

            win.webContents.send('cpu_name', os.cpus()[0].model);
        }, 3000)

        const menuTemplate = [
            { role: 'appMenu' },
            { role: 'fileMenu' },
            {
                label: 'fileMenu', submenu: [
                    {
                        label: 'New Window', click: () => {
                            createWindow();
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Close all windows',
                        accelerator: 'CmdOrCtrl+a',
                        click: () => {
                            console.log('ra')
                            BrowserWindow.getAllWindows().forEach(window => window.close())
                        }

                    }
                ]
            },
        ];
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    })
}

app.whenReady().then(() => {
    createWindow();
    console.log(os.cpus()[0].model)
    globalShortcut.register('CmdOrCtrl+d', () => {
        console.log("Atalho Global")
        BrowserWindow.getAllWindows()[0].setAlwaysOnTop(true)
        BrowserWindow.getAllWindows()[0].setAlwaysOnTop(false)
    })
})

app.on('will-quit',()=>{
    globalShortcut.unregisterAll();
})

app.on('window-all-closed', () => {
    console.log('Todas as Janelas fechadas');
    if (!isMac) {
        app.quit();
    }
})

// Para Mac
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})


ipcMain.on('open_new_window', () => {
    createWindow();
})