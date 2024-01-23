const { app, BrowserWindow, ipcMain } = require('electron')
const { testFunction } = require("./StorageLayer/storageTest.js");
const { OrganizzazioneControl } = require("./ApplicationLayer/OrganizzazioneFile/OrganizzazioneControl.js");
const { spawn } = require('child_process');
const {PythonShell} = require('python-shell');
const { VisualizzaReportControl } = require ("./ApplicationLayer/VisualizzaReport/VisualizzaReportControl.js")

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


async function leggiCartella(path){
  let result;
   await fetch('http://127.0.0.1:5000/classify', {
      method: "POST",
      headers: {
          'Content-Type':"application/json"
      },
      body: JSON.stringify({"path": path})
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
  result = await leggiCartella(data.folderPath)
  await creaOrganizzazione(result, data.folderPath)
})

ipcMain.handle('viewAllReportList', async (event, data) =>{
   let visualizzaControl = new VisualizzaReportControl();
   let list = await visualizzaControl.getAllReports().catch((err) =>{
      console.log(err);
   });
   return list;
})

ipcMain.handle('viewUntilReportsList', async (event , data) =>{
   let visualizzaControl = new VisualizzaReportControl();
   let list = await visualizzaControl.getUntilReport(data.dataTo)
   .catch((err) =>{
      console.log(err);
   });
   return list;
})

ipcMain.handle('viewFromToReportList', async(event,data)=>{
   let visualizzaControl = new VisualizzaReportControl();
   let list = await visualizzaControl.getFromToReport(data.dateFrom, data.dateTo)
   .catch((err) =>{
      console.log(err);
   })
   return list;
})