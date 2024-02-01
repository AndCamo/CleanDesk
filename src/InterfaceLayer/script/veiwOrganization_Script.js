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
      let finalFolder;
      if(determinateOS() == "Windows"){
         let values = list[i].NomeCartella.split(path.win32.sep);
         finalFolder = values.join(path.win32.sep + " ");
      }else{
         let values = list[i].NomeCartella.split("/");
         finalFolder = values.join("/ ");
      }
      

      let idReport = list[i].ID;
      let newDiv = document.createElement('div');
      newDiv.classList.add("row", "m-5","p-3", "reportORGrow", "align-items-center");
      
      newDiv.innerHTML = 
      '<div class = "col-2">' + list[i].Nome + '</div>'+
      '<div class = "col-3">'+ list[i].Descrizione + '</div>'+
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

async function viewDetailsByReportID(){
   //taking the params from URL
   let tmp = new URLSearchParams(window.location.search);

   //taking the param "idReport"
   let IDReport = tmp.get('idReport');
   console.log(IDReport);

   let reportORG = await getReportByID(IDReport).catch((err) =>{
      console.log(err);
   });

   console.log("Report nome: "+reportORG[0].Nome);
   console.log("Report data: "+reportORG[0].DataReport);



   //taking the div "headRow"
   let headRow = document.getElementById('titleRow');

   //creating a new div col
   let headInfo = document.createElement('div');

   headInfo.innerHTML = 
   ' <div class="col-12"> Dettagli organizzazione "' + reportORG[0].Nome +
   '" del giorno: '+ reportORG[0].DataReport + '</div>';

   headRow.appendChild(headInfo);
   
   //Taking all re fileReport by ReportID
   let list = await ipcRenderer.invoke('viewDetailsReport',{reportID : IDReport});

   //taking the html element container
   let container = document.getElementById('main-container');

   //creating and adding a new div with fileReport data
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






