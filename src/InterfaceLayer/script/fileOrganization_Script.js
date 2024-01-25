const { ipcRenderer } = require('electron');
const { link } = require('original-fs');

const pathRegexMac = /^(?:\/(?:[^\/:]+\/)*)?(?:[^\/\s]+)?$/;
const pathRegexWindows = /^(?:[a-zA-Z\s]:\\|\\\\)(?:[^\\\s:]+\\)(?:[^\/:<>"?|]+)?$/;
const deniedPaths = ["/Library", "/Applications", "/System", "C:\\Windows", "C:\\Program Files (x86)", "C:\\Program Files", "C:\\ProgramData", "C:\\Recovery"]



let blacklist = [];
let folderPath = "";

window.onload = function () {
   updateBlacklistBox(blacklist);
};

function updateBlacklistBox(list) {
   if (list.length == 0) {
      document.getElementById('blacklist').innerHTML = "La Blacklist è vuota!";
   } else {
      document.getElementById('blacklist').innerHTML = " ";
      for (const file of list) {
         let newElement = ('<b>' + file.name + '</b> <u>[' + file.path + ']</u><br>')
         document.getElementById('blacklist').innerHTML += newElement
      }
   }
}

function clearBlacklist() {
   blacklist = [];
   updateBlacklistBox(blacklist)
}

function getBlackListFiles() {
   if (folderPath.length === 0 || folderPath === null) {
      alert("⚠️ \n Devi inserire prima una cartella!");
   } else {
      let filePicker = document.getElementById('blacklist-input');
      let list = filePicker.files;
      for (const file of list) {
         blacklist.push(file);
      }
   }
   updateBlacklistBox(blacklist);
}

function checkFolderPath(path) {


   let os = "Unknown OS";
   userAgent = window.navigator.userAgent;
   if (userAgent.indexOf("Win") != -1) os = "Windows";
   else if (userAgent.indexOf("Mac") != -1) os = "MacOS";

   // Check lenght testing category
   if (path.length < 4 || path.length > 256 || path === null){
      alert("🚫 \n Il Path inserito non è valido. Potrebbe riferire alla Home di un Disco oppure essere nullo");
      return false
   }

   // Check format testing category
   if (!pathRegexMac.test(path) && os == "MacOS") {
      alert("🚫 \n Il Path è di un Formato Sbagliato!");
      return false;
   } else if (!pathRegexWindows.test(path) && os == "Windows") {
      alert("🚫 \n Il Path è di un Formato Sbagliato!");
      return false;
   }

   // Check correctness testing category
   ipcRenderer.invoke('isDirectory', {path : path}).then((isDirectory) => {
      console.log(isDirectory)
      if (!isDirectory){
         alert("🚫 \n Impossibile avviare la classificazione, Il Path riferisce ad un File, fornire una cartella");
         return false;
      }
   })

   // Check admissibility testing category
   for (let item of deniedPaths){
      if(path.startsWith(item)){
         alert("🚫 \n Impossibile avviare la classificazione,\n Il Path riferisce ad una cartella dedicata a File di Sistema, Librerie o di un Software!");
         return false;
      }
   }

   return true

}

// Function to show the folder chooser at the user.
function insertFolderPath() {
   ipcRenderer.send('open-folder-dialog');
}

// Get the folder choosed
ipcRenderer.on('selected-folder', function (event, path) {
   console.log(path)
   folderPath = path;
   console.log('Selected folder:', folderPath);
   if (checkFolderPath(path)) {
      document.getElementById("folder-path").value = folderPath;
   } else {
      document.getElementById("folder-path").value = "";
   }
});

function updateFolderPath() {
   let text = document.getElementById("folder-path").value;
   folderPath = text;
   if (checkFolderPath(folderPath)) {
      document.getElementById("folder-path").value = folderPath;
   } else {
      document.getElementById("folder-path").value = "";
   }
}





function startOrganization() {
   path = document.getElementById("folder-path").value;

   if (checkFolderPath(path)) {
      const tmpBlacklist = []
      for (let item of blacklist){
         tmpBlacklist.push(item.path);
      }

      let filters = {
         content: document.getElementById("contentCheckBox").checked,
         mediaSubFolder: document.getElementById("mediaCheckBox").checked,
         othersFolder: document.getElementById("othersCheckBox").checked,
         preserveFolder: document.getElementById("subfolderCheckBox").checked,
         blacklist: tmpBlacklist
      };
      console.log(filters);

      
      ipcRenderer.invoke("startOrganization", { folderPath: path, filters, filters })
         .then((result) => {
            alert("ORGANIZZAZIONE EFFETTUATA!")
         }).catch((error) => {
            alert("ERRORE" + error)
         })
   
   }
}

function connectionTest() {
   ipcRenderer.send("test");
}


