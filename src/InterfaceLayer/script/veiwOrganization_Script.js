const { ipcRenderer } = require('electron')

async function viewAllReports(){
   let list = await ipcRenderer.invoke('viewAllReportList');
   let container = document.getElementById('main-container');
   
   for(let i in list){
      let idReport = list[i].ID;
      let newDiv = document.createElement('div');
      newDiv.classList.add("row", "m-5","p-3", "reportORGrow", "align-items-center");
      
      newDiv.innerHTML = 
      '<div class = "col-2">' + list[i].Nome + '</div>'+
      '<div class="col-2">'+ list[i].Descrizione + '</div>'+
      '<div class = "col-2" style="text-align: center">'+ list[i].DataReport + '</div>'+
      '<div class = "col-4 descriptionCell" >'+ list[i].NomeCartella + '</div>'+
      '<div class = "col-2 detailsButton" onclick="viewDetailsByReportID()">'+
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

async function viewDetailsByReportID(){
   let reportID = document.getElementById("reportID").value;
   //window.location.href='viewDetailsReport.html';
   console.log("ReportID nello Script: "+ reportID);
   let list = await ipcRenderer.invoke('viewDetailsReport',{reportID : reportID});
   let container = document.getElementById('main-container');

   for(let i in list){
      let finalPath = "";
      finalPath = list[i].PathFinale;
      console.log("Nel for dello script: "+finalPath);
      let newDiv = document.createElement('div');
      newDiv.classList.add("row", "m-5","p-3", "reportORGrow", "align-items-center");

      newDiv.innerHTML = 
      '<div class = "col-4">' + list[i].Nome + '</div>'+
      '<div class = "col-4">' + list[i].PathPartenza + '</div>'+
      '<div class = "col-4">' + list[i].PathFinale + '</div>';

      container.appendChild(newDiv);
   }
}




