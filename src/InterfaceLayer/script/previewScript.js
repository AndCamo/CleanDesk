const { ipcRenderer } = require('electron');

let logs = [];
let categories = ['POLITICS', 'SPORTS', 'BUSINESS', 'PARENTING', 'TECH', 'ARTS & CULTURE', 'SCIENCE & MATHEMATICS', 'STYLE & BEAUTY', 'TRAVEL', 'FOOD & DRINK', 'ENTERTAINMENT', 'HOME & LIVING', 'EDUCATION', 'OTHERS'];


// Funzione per annullare l'organizzazione"
const cancelPreviewOrganization = () => {
   logs = [];
   sessionStorage.removeItem("log");
   
   history.back();
};

async function getLog() {
   logs = JSON.parse(sessionStorage.getItem("log"));
   console.log("SONO IN PREVIEW\n");
   console.log(logs);
}

async function getLogByCategory(category){

   let logList = [];
   for (let item of logs){
      if(item.category == category){
         logList.push(item);
      }
   }

   return logList;
}

function updateLogCategory(path){
   let updatedLogs = [];
   selectElement = document.getElementById(path);
   newCategory = selectElement.value;

   for (let item of logs){
      if(item.filePath == path){
         let tmpCategory = item.category;
         let tmpFinalPath = item.finalPath;
         item["category"] = newCategory;
         item["finalPath"] = tmpFinalPath.replace(tmpCategory, newCategory);
      }
      updatedLogs.push(item);
   }
   logs = updatedLogs;
   sessionStorage.removeItem("log")
   sessionStorage.setItem("log",  JSON.stringify(updatedLogs));
   location.reload();
}

async function showPreview(){
   await getLog();

   previewContainer = document.getElementById("previewContainer");
   if (logs.length === 0){
      previewContainer += "Nessuna preview da visualizzare"
   }

   for (let category of categories){
      let logList = await getLogByCategory(category);
      // If there are logs for the current category
      if(logList.length != 0){
         let header = 
            '<div class="row p-2 titleRow">' +
               '<div class="col-12" style="text-align: center;">' + category +'</div>' +
           '</div>';

         previewContainer.innerHTML += header
         let categoryPreview = document.createElement("div");
         categoryPreview.classList.add("row", "folderSection", "preview");
         let categorySelect;
         for (let item of logList) {
            let newRow = document.createElement('div');
            newRow.classList.add("row", "p-2", "justify-content-evenly");

            categorySelect = document.createElement("select");
            categorySelect.classList.add("categorySelect")
            categorySelect.setAttribute("id", item.filePath)
            let onchangeQuery = "updateLogCategory('" + item.filePath + "')";

            categorySelect.setAttribute("onchange", onchangeQuery);

            for (let category of categories) {
               let newOption = document.createElement("option");
               newOption.innerHTML = category;
               newOption.setAttribute("value", category);
               if (category == item.category) {
                  newOption.setAttribute("selected", "selected");
               }
               categorySelect.appendChild(newOption);
            }
            newRow.innerHTML += '<div class = "col-4">' + item.fileName + '</div>';
            newRow.innerHTML += '<div class = "col-4 previewPath" title="' + item.filePath + '">' + item.filePath + '</div>';
            let tmp = document.createElement("div");
            tmp.classList.add("col-3", "d-flex", "justify-content-end");
            tmp.appendChild(categorySelect);
      
            newRow.appendChild(tmp);
            categoryPreview.appendChild(newRow);
         }
         previewContainer.appendChild(categoryPreview);
      }
   }
}

async function organizeFiles(){
   await getLog();
   
   let folderPath = JSON.parse(sessionStorage.getItem("folderPath"));
   document.getElementById("previewButtonRow").style.display = "none";
   document.getElementById("previewResult").style.display = "block";
   
   let reportOrg = await ipcRenderer.invoke("organizeFile", { folderPath: folderPath, logs: JSON.stringify(logs)});
   sessionStorage.setItem("reportOrg", reportOrg);
   window.location.href = 'detailOrgPage.html';
}