const { ipcRenderer } = require('electron')


function startOrganization(){
   path = document.getElementById("folderPath").value;
   if(path != ""){
      ipcRenderer.invoke("startOrganization", {folderPath : path}).then((result) => {
         console.log(result)
      })
   }
}

function connectionTest(){
   ipcRenderer.send("test");
}

