const { ipcRenderer } = require('electron');
const { link } = require('original-fs');

let blacklist = [];


window.onload = function() {
   updateBlacklistBox(blacklist)
 };

 function updateBlacklistBox(list){
   if (list.length == 0){
      document.getElementById('blacklist').innerHTML = "La Blacklist è vuota!";
   } else {
      document.getElementById('blacklist').innerHTML = " ";
      for (const file of list){
         let newElement = ('<b>' + file.name + '</b> <u>[' + file.path +']</u><br>')
         document.getElementById('blacklist').innerHTML += newElement
      }
   }
 }

 function clearBlacklist(){
   blacklist = [];
   updateBlacklistBox(blacklist)
 }

 function getBlackListFiles(){
   let filePicker = document.getElementById('blacklist-input');
   let list = filePicker.files;
   for (const file of list){
      blacklist.push(file);
   }
   updateBlacklistBox(blacklist);
 }

 // Function to show the folder chooser at the user.
 function insertFolderPath(){
   ipcRenderer.send('open-folder-dialog');
 }

 // Get the folder choosed
 ipcRenderer.on('selected-folder', function (event, path) {
   console.log('Selected folder:', path);
   document.getElementById("folder-path").value = path;
   });


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


