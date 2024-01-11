const { app, BrowserWindow, ipcMain } = require('electron')
const { testFunction } = require("./StorageLayer/storageTest.js");
const { OrganizzazioneControl } = require("./ApplicationLayer/OrganizzazioneFile/OrganizzazioneControl.js");
const { spawn } = require('child_process');


let mainWindow

// Run a Python script and return output
function runPythonScript(scriptPath, args) {
   // Use child_process.spawn method from 
   // child_process module and assign it to variable
   const pyProg = spawn('python', [scriptPath].concat(args));
 
   // Collect data from script and print to console
   let data = '';
   pyProg.stdout.on('data', (stdout) => {
     data += stdout.toString();
   });
 
   // Print errors to console, if any
   pyProg.stderr.on('data', (stderr) => {
     console.log(`stderr: ${stderr}`);
   });
 
   // When script is finished, print collected data
   pyProg.on('close', (code) => {
     console.log(`child process exited with code ${code}`);
     console.log(data);
   });
 }

const createWindow = () => {
   mainWindow = new BrowserWindow({
     width: 800,
     height: 600,
     webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
     }
   })
 
   mainWindow.loadFile("./src/InterfaceLayer/app/index.html")
 }

app.whenReady().then(() => {
   runPythonScript("./src/ApplicationLayer/server.py", []);
   createWindow()
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
     await testFunction();

  })
  .catch(error => console.log(error))
})

ipcMain.handle('startOrganization', async (event, data) => {
  let result;
  result = await leggiCartella(data.folderPath)
  await creaOrganizzazione(result, data.folderPath)
})
