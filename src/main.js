const { error } = require('console')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow

const createWindow = () => {
   mainWindow = new BrowserWindow({
     width: 800,
     height: 600,
   })
 
   mainWindow.loadFile("./src/InterfaceLayer/index.html")
 }

app.whenReady().then(() => {
   createWindow()
})