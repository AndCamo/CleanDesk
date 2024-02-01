let logs = [];
let categories = ['POLITICS', 'SPORTS', 'BUSINESS', 'PARENTING', 'TECH', 'ARTS & CULTURE', 'SCIENCE & MATHEMATICS', 'STYLE & BEAUTY', 'TRAVEL', 'FOOD & DRINK', 'ENTERTAINMENT', 'HOME & LIVING', 'EDUCATION', 'OTHERS'];


// Funzione lambda per aprire la pagina "index.html"
const cancelOrganization = () => {
   logs = [];
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
            for (let category of categories) {
               let newOption = document.createElement("option");
               newOption.innerHTML = category;
               newOption.setAttribute("value", category);
               if (category == item.category) {
                  newOption.setAttribute("selected", "selected");
               }

               categorySelect.appendChild(newOption);
            }
            newRow.innerHTML = '<div class = "col-6">' + item.fileName + '</div>';
            let tmp = document.createElement("div");
            tmp.classList.add("col-6", "d-flex", "justify-content-end");
            tmp.appendChild(categorySelect);
      
            newRow.appendChild(tmp);
            categoryPreview.appendChild(newRow);
         }
         previewContainer.appendChild(categoryPreview);
      }
   }

}
