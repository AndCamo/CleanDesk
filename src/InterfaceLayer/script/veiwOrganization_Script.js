const { ipcRenderer } = require('electron')

async function viewAllReports(){
   let list = await ipcRenderer.invoke('viewAllReportList')
   
   for(let i in list){
      document.getElementById("reportUL").innerHTML += "<li>" + list[i].Nome + list[i].Descrizione+ list[i].NomeCartella, list[i].DataReport+ "</li>";
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




