const { ipcRenderer } = require('electron');
const { link } = require('original-fs');

const pathRegexMac = /^(?:\/(?:[^\/:]+\/)*)?(?:[^\/]+)?$/;
const pathRegexWindows = /^(?:[a-zA-Z\s]:\\|\\\\)(?:[^\\\s:]+\\)(?:[^\/:<>"?|]+)?$/;
const deniedPaths = ["/Library", "/Applications", "/System", "C:\\Windows", "C:\\Program Files (x86)", "C:\\Program Files", "C:\\ProgramData", "C:\\Recovery"]



let blacklist = [];
let folderPath = "";

window.onload = function () {
   folderPath = document.getElementById("folder-path").value;
   console.log("ON LOAD");
   console.log(folderPath);
   if(folderPath != "")
      updateFolderPreview();
   updateBlacklistBox(blacklist);
};

function updateBlacklistBox(list) {
   if (list.length == 0) {
      document.getElementById('blacklist').innerHTML = "La Blacklist è vuota!";
   } else {
      document.getElementById('blacklist').innerHTML = "";
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
      ipcRenderer.invoke('isDirectory', {path : path})
      .then((isDirectory) => {
         if (!isDirectory){
            alert("🚫 \n Impossibile avviare la classificazione, Il Path riferisce ad un File, fornire una cartella");
            return false;
         }
      }).catch((error) => {
         alert("🚫 \n Impossibile avviare la classificazione, il path inserito non esiste!");
         return false;
      });

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
   folderPath = path;
   if (checkFolderPath(path)) {
      updateFolderPreview();
      document.getElementById("folder-path").value = folderPath;
   } else {
      document.getElementById("folder-path").value = "";
      let previewBox = document.getElementById("folderPreviewBox");
      previewBox.innerHTML = "Inserisci una cartella per visualizzare l'anteprima.";
      document.getElementById("folderPreview").style.height = "max-content";
   }
});

function updateFolderPath() {
   let text = document.getElementById("folder-path").value;
   folderPath = text;
   if (checkFolderPath(folderPath)) {
      document.getElementById("folder-path").value = folderPath;
      updateFolderPreview();
   } else {
      document.getElementById("folder-path").value = "";
      let previewBox = document.getElementById("folderPreviewBox");
      previewBox.innerHTML = "Inserisci una cartella per visualizzare l'anteprima.";
      document.getElementById("folderPreview").style.height = "max-content";
   }
}


async function updateFolderPreview(){
   ipcRenderer.invoke("getFolderPreview", { folderPath: folderPath})
      .then((folderContent) => {
         let previewBox = document.getElementById("folderPreviewBox");
         let icon = "";
         previewBox.innerHTML = "";
         for (let item of folderContent){
            if (item.isDir){
               icon = '<i class="fa-regular fa-folder-open previewIcon"></i>'
            } else {
               icon = '<i class="fa-regular fa-file-lines previewIcon"></i>'
            }
            let tmpBox = document.getElementById("folderPreview");
            previewBox.style.height = "25vh"
            
            let newDiv = document.createElement('div');
            newDiv.classList.add("col-4", "previewItem");
            let newElement = icon + ('<b>' + item.fileName + '</b>');
            newDiv.innerHTML += newElement;

            previewBox.appendChild(newDiv);
         }
      }).catch((error) => {
         document.getElementById("folderPreviewBox").innerHTML = "Inserisci una cartella per visualizzare l'anteprima.";
         document.getElementById("folderPreview").style.height = "max-content";
      })
}



function startOrganization() {
   let path = folderPath;

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
      document.getElementById("buttonRow").style.display = "none";
      document.getElementById("organizationResult").style.display = "block";
      ipcRenderer.invoke("startOrganization", { folderPath: path, filters, filters })
         .then(async (organizationLog) => {
            console.log(organizationLog);
            sessionStorage.setItem("log", JSON.stringify(organizationLog));
            sessionStorage.setItem("folderPath", JSON.stringify(path));
            alert( "✅ \n Organizzazione effettuata");
            openPreviewPage();
         }).catch((error) => {
            document.getElementById("organizationResult").innerHTML = "ERRORE";
            window.location.href = 'homepage.html';
            alert("ERRORE" + error)
         })
   }
}

function connectionTest() {
   ipcRenderer.send("test");
}