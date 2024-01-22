const { app, BrowserWindow, ipcMain } = require('electron')
const { testFunction } = require("./StorageLayer/storageTest.js");
const { OrganizzazioneControl } = require("./ApplicationLayer/OrganizzazioneFile/OrganizzazioneControl.js");
const { spawn } = require('child_process');
const {PythonShell} = require('python-shell');

require('electron-reload')(__dirname);


let mainWindow
let pythonShell

const createWindow = () => {
   mainWindow = new BrowserWindow({
      width: 1200,
      height: 700,
      'minHeight': 700,
      'minWidth': 1200,
     webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
     }
   })
 
   mainWindow.loadFile("./src/InterfaceLayer/app/homepage.html")
 }

app.whenReady().then(() => {
   // Start The Server
   pythonShell = new PythonShell('./src/ApplicationLayer/server.py');
   createWindow()
})

app.on('window-all-closed', () => {
   pythonShell.childProcess.kill('sigint');
   app.quit();
 })


async function leggiCartella(path, filters){
  let result;
   const data = {
      path: path,
      filters: filters
   };

   let requestData = JSON.stringify(data);
   console.log(requestData);
   await fetch('http://127.0.0.1:5000/classify', {
      method: "POST",
      headers: {
          'Content-Type':"application/json"
      },
      body: requestData
   })
   .then(response => response.json())
   .then((data) => {
      result = data;
   })
   .catch(error => console.log(error))
   
   return result;
} 

async function creaOrganizzazione(log, initPath){
   const organizzazioneControl = new OrganizzazioneControl();
   await organizzazioneControl.creaReportORG(log, initPath);
}

ipcMain.on('test', (event, data) => {
  console.log("Test OK");
  fetch('http://127.0.0.1:5000/test' , {
     method: "GET",
     headers: {
        'Content-Type':"application/json"
    }
  })
  .then(response => response.json())
  .then(async (data) => {
     console.log(data);
     event.reply('risultato', data);
  })
  .catch(error => console.log(error))
})

ipcMain.handle('startOrganization', async (event, data) => {
  let result;
  filters = {
      content : true,
      mediaSubFolder: true,
      othersFolder: true,
      preserveFolder: false,
      blacklist: [
         "/Users/andrea/Desktop/NC23_CleanDesk/RAD/NC23_RAD_V0.9.pdf",
         "/Users/andrea/Desktop/NC23_CleanDesk/RAD/NC23_SDD_V0.6.pdf"
   ]
 }
  result = await leggiCartella(data.folderPath, filters)
  await creaOrganizzazione(result, data.folderPath)
})