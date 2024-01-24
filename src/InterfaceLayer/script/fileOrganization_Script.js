const { ipcRenderer } = require('electron');
const { link } = require('original-fs');

const blacklist = [];

window.onload = function() {
   if (blacklist.length == 0){
      document.getElementById('blacklist').innerHTML = "VUOTA";
   } else {
      list = getBlackListFiles();
      document.getElementById('blacklist').innerHTML = list;
   }
 };


function getBlackListFiles(){
   filePicker = document.getElementById('blacklist-input');
   list = filePicker.files;
   console.log(list)
   document.getElementById('blacklist').innerHTML = list[0].path;
   return list;
}

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


