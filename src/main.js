const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { testFunction } = require("./StorageLayer/storageTest.js");
const { OrganizzazioneControl } = require("./ApplicationLayer/OrganizzazioneFile/OrganizzazioneControl.js");
const { spawn } = require('child_process');
const {PythonShell} = require('python-shell');
const { promises: Fs } = require('fs')
const { VisualizzaReportControl } = require ("./ApplicationLayer/VisualizzaReport/VisualizzaReportControl.js");
const { Console, error } = require('console');
const path = require('node:path'); 
const { ModelAdapter } = require('./ApplicationLayer/OrganizzazioneFile/ModelAdapter/ModelAdapter.js')
const { exec } = require("child_process");
require('electron-reload')(__dirname);


let mainWindow
let pythonShell
let subpy
const createWindow = () => {
   mainWindow = new BrowserWindow({
      width: 1200,
      height: 700,
      'minHeight': 720,
      'minWidth': 1200,
      autoHideMenuBar: true,
      webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      icon: "icons/icon.icns"
     }
   })
 
   mainWindow.loadFile("./src/InterfaceLayer/app/homepage.html")
 }

app.whenReady().then(() => {
   const serverPath = path.join(__dirname, "ApplicationLayer", "server.py");
   console.log(serverPath);
   pythonShell = new PythonShell(serverPath);
   createWindow()
})

app.on('window-all-closed', () => {
   pythonShell.childProcess.kill('sigint');
   app.quit();
 })


async function creaOrganizzazione(log, initPath){
   return await new Promise(async (resolve, reject) => {
      const organizzazioneControl = new OrganizzazioneControl();
      let reportOrg = await organizzazioneControl.creaReportORG(log, initPath);
      console.log("IN CREA", reportOrg.id);
      resolve(reportOrg);
   });
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
   let filters = data.filters;
   let modelAdapter = new ModelAdapter();
   result = await modelAdapter.modelStartOrganization(data.folderPath, filters)
   return result;
})

ipcMain.on('organizeFile', async(event, data) => {
   let filesLog = JSON.parse(data.logs);
   let folderPath = data.folderPath;
   creaOrganizzazione(filesLog, folderPath)
   .then((reportOrg) => {
      mainWindow.loadURL(`file://${__dirname}/InterfaceLayer/app/detailOrgPage.html?id=${reportOrg.id}`);
   })
   .catch(() => {
      mainWindow.loadURL(`file://${__dirname}/InterfaceLayer/app/detailOrgPage.html?id=${reportOrg.id}`);
   });
   
})

// folder chooser
ipcMain.on('open-folder-dialog', function (event) {
   dialog.showOpenDialog(mainWindow, {
     properties: ['openDirectory'],
   }).then(result => {
     if (!result.canceled) {
       event.sender.send('selected-folder', result.filePaths[0]);
     }
   });
 });

 async function isDirectory(path) {  
   const stats = await Fs.stat(path)

   return stats.isDirectory()
 }


ipcMain.handle('isDirectory', async (event, data) => {
   console.log(data.path);
   let flag = await isDirectory(data.path)
   .catch((error) => {
      throw error;
   });

   return flag;
 });


async function getFolderContent(path) {
   let folderContent = [];

   return await new Promise((resolve, reject) => {
      Fs.readdir(path, { withFileTypes: true }, (err, files) => {
         if (err)
            reject(err);
         else {
            files.forEach(file => {
               let name = file.name
               if (!name.startsWith(".")) {
                  let fileInfo = { fileName: name, isDir: file.isDirectory() };
                  folderContent.push(fileInfo);
               }
            })
            resolve(folderContent);
         }
      });
   });
}

 ipcMain.handle("getFolderPreview", async (event, data) => {
   let path = data.folderPath;

   let list = await getFolderContent(path).catch((error) => {
      throw(error)
   });
   
   return list;
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

ipcMain.handle('getReportInfo', async(event, data) => {
   let visualizzaControl = new VisualizzaReportControl();
   let reportORG = await visualizzaControl.getReportByID(data.reportID)
   .catch((err) => {
      console.log(err);
   });
   return reportORG;
})

ipcMain.handle('viewDetailsReport', async(event, data) => {
   let visualizzaControl = new VisualizzaReportControl();
   let list = await  visualizzaControl.viewDetailsByReportID(data.reportID)
      .catch((err) =>{
         console.log(err)
      });
   return list;
})


ipcMain.handle('deleteOrganization', async (event, data) => {
   const organizzazioneControl = new OrganizzazioneControl();
   await organizzazioneControl.deleteReportORG(data.reportID);
 });

 ipcMain.handle('saveOrganization', async (event, data) => {
   const organizzazioneControl = new OrganizzazioneControl();
   await organizzazioneControl.updateReportInfo(data.reportID, data.name, data.description);
 });

