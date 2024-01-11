const { ipcRenderer } = require('electron')


function startOrganization(){
   path = document.getElementById("folderPath").value;
   if(path != ""){
      ipcRenderer.invoke("startOrganization", {folderPath : path})
      .then((result) => {
         document.getElementById("resultbox").innerText = "FATTOOOOO"
      }).catch((error) => {
         document.getElementById("resultbox").innerText = "ERRORE DIOCAN"
      })
   }
}

function connectionTest(){
   ipcRenderer.send("test");
}

