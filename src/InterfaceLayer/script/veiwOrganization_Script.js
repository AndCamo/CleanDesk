const { ipcRenderer } = require('electron');
const {path} = require("path")
const pathRegexMac = /^(?:\/(?:[^\/:]+\/)*)?(?:[^\/\s]+)?$/;
const pathRegexWindows = /^(?:[a-zA-Z\s]:\\|\\\\)(?:[^\\\s:]+\\)(?:[^\/:<>"?|]+)?$/;


async function determinateOS(){
   let os = "Unknown OS";
   userAgent = window.navigator.userAgent;
   if (userAgent.indexOf("Win") != -1) os = "Windows";
   else if (userAgent.indexOf("Mac") != -1) os = "MacOS";
   return os;
}

async function viewAllReports(){
   let list = await ipcRenderer.invoke('viewAllReportList');
   let container = document.getElementById('main-container');
   
   for(let i in list){
      let currentPath = list[i].NomeCartella;
      let finalFolder;
      if(pathRegexWindows.test(currentPath)){
         let values = list[i].NomeCartella.split('\\');
         finalFolder = values.join("\\"+ " ");
      }else{
         let values = list[i].NomeCartella.split("/");
         finalFolder = values.join("/ ");
      }
      

      let idReport = list[i].ID;
      let newDiv = document.createElement('div');
      newDiv.classList.add("row", "m-5","p-3", "reportORGrow", "align-items-center");
      let titolo = list[i].Nome;


      newDiv.innerHTML = 
      '<div class = "col-2 shortDots" title="' + titolo + '">' + list[i].Nome + '</div>'+
      '<div class="col-3">'+ list[i].Descrizione + '</div>'+
      '<div class = "col-2">'+ list[i].DataReport + '</div>'+
      '<div class = "col-3 descriptionCell" >'+ finalFolder + '</div>'+
      '<div class = "col-1 detailsButton" onclick="openDetails('+idReport+')">'+
      '<input type="hidden" id="reportID" value="'+idReport+'">'+
      'Visualizza </div>';

      container.appendChild(newDiv);
   }
}

async function viewUntilReports(){
   inputDateTo = document.getElementById("dateTo").value;
   let list = await ipcRenderer.invoke('viewUntilReportsList', {dateTo : inputDateTo})
   .catch((err) =>{
      console.log(err);
   })

   for(let i in list){
      document.getElementById("reportUL").innerHTML += "<li>" + list[i].Nome + list[i].Descrizione+ list[i].NomeCartella, list[i].DataReport+ "</li>";
   }
}

async function viewFromToReports(){
   let inputDateTo = document.getElementById("dateTo").value;
   let inputDateFrom = document.getElementById("dateFrom").value;
   let list = await ipcRenderer.invoke('viewFromToReportList',{dateTo : inputDateTo, dateFrom : inputDateFrom });

   for(let i in list){
      document.getElementById("reportUL").innerHTML += "<li>" + list[i].Nome + list[i].Descrizione+ list[i].NomeCartella, list[i].DataReport+ "</li>";
   }
}


async function getReportByID(IDReport){
   let reportORG = await ipcRenderer.invoke('getReportInfo',{reportID : IDReport});
   return reportORG;
}

async function printListDetails(list){
   //taking the html element container
   let container = document.getElementById('main-container');
   
   for(let i in list){
      let initialFolder;
      let finalFolder;
      currentPath = list[i].PathPartenza;
      if(pathRegexWindows.test(currentPath)){
         let datas = list[i].PathPartenza.split('\\');
         initialFolder = datas.join("\\"+" ");
         let values = list[i].PathFinale.split("\\");
         finalFolder = values.join("\\"+" ");
      }else{
         let datas = list[i].PathPartenza.split("/");
         initialFolder = datas.join("/ ");
         let values = list[i].PathFinale.split("/");
         finalFolder = values.join("/ ");
      }

      let newDiv = document.createElement('div');
      newDiv.classList.add("row", "m-5","p-3", "reportORGrow", "align-items-center");

      newDiv.innerHTML = 
      '<div class = "col-4">' + list[i].Nome + '</div>'+
      '<div class = "col-4">' + initialFolder + '</div>'+
      '<div class = "col-4">' + finalFolder + '</div>';

      container.appendChild(newDiv);
   }

}

async function viewAllDetails(){
   //taking the params from URL
   let tmp = new URLSearchParams(window.location.search);

   //taking the param "idReport"
   let IDReport = tmp.get('idReport');

   let reportORG = await getReportByID(IDReport).catch((err) =>{
      console.log(err);
   });

   //taking the div "headRow"
   let headRow = document.getElementById('titleRow');

   //creating a new div col
   let headInfo = document.createElement('div');
   headInfo.replaceWith(" ");

   headInfo.innerHTML = 
   ' <div class="col-12"> Dettagli organizzazione "' + reportORG[0].Nome +
   '" del giorno: '+ reportORG[0].DataReport + '</div>';

   headRow.appendChild(headInfo);
   
   //Taking all re fileReport by ReportID
   let list = await ipcRenderer.invoke('viewDetailsReport',{reportID : IDReport});
   
   //creating and adding a new div with fileReport data
   printListDetails(list);
   
}

async function eseguiRicerca(input, list){
   let resultList = [];

   for(let i in list){
      let nameFile = String(list[i].Nome).toLowerCase(); 
      if(nameFile.includes(input)){
         console.log(nameFile)
         resultList.push(list[i]);
      }
   }
   return resultList;
}

async function showFiltered(list, input){

   let resultList = await eseguiRicerca(input, list).catch((err) =>{
      console.log(err);
   });
 
   printListDetails(resultList);
}

async function fillHeadRow(IDReport){
   let reportORG = await getReportByID(IDReport).catch((err) =>{
      console.log(err);
   });
   

   let headRow = document.getElementById('titleRow');

   //creating a new div col
   let headInfo = document.createElement('div');

   headInfo.innerHTML = 
   ' <div class="col-12"> Dettagli organizzazione "' + reportORG[0].Nome +
   '" del giorno: '+ reportORG[0].DataReport + '</div>';

   headRow.appendChild(headInfo);

}

async function showList(){
   let tmp = new URLSearchParams(window.location.search);

   //taking id of report
   let IDReport = tmp.get('idReport');

   //taking filter
   let filter = tmp.get('filter');
   await fillHeadRow(IDReport);
   //fill headRow with name and Date of report
   
   let list = await ipcRenderer.invoke('viewDetailsReport',{reportID : IDReport});

   if(filter == 'off'){//show all file report
      printListDetails(list)
   }
   else  { 
      //show only saerched file
      let input = tmp.get('query').toLowerCase();
      showFiltered(list,input)
   }
}