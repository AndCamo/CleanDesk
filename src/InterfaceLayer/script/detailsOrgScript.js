const { ipcRenderer } = require('electron');

let reportOrg;


const cancelOrganization = () => {
   sessionStorage.removeItem("reportOrg");
   ipcRenderer.invoke('deleteOrganization', {reportID : reportOrg.ID}).then(
      () => {
         window.location.href = 'homepage.html';
      });
};

async function saveReportORG(){
   nameOrg = document.getElementById("report-name").value;
   descriptionOrg = document.getElementById("report-description").value;

   if(nameOrg.length === 0 || nameOrg === null){
      tmpName = "Nuova Organizzazione (N° " + reportOrg.ID + ")";
   }
   if(descriptionOrg.length === 0 || descriptionOrg === null){
      tmpDescription = "Organizzazione del giorno: " + reportOrg.DataReport + ",\nSulla cartella: [" + reportOrg.NomeCartella +"]"
   }
   ipcRenderer.invoke('saveOrganization', {reportID : reportOrg.ID, name: nameOrg, description: descriptionOrg})
   .then(async () => {
         goHomePage();
   });
}

async function getReportByID(IDReport){
   let reportORG = await ipcRenderer.invoke('getReportInfo',{reportID : IDReport});
   return reportORG;
}

async function getReportInfo(){
   let url = new URLSearchParams(window.location.search);
   let reportOrgID = url.get("id");
   let tmp = await getReportByID(reportOrgID);
   reportOrg = tmp[0]
   console.log(reportOrg);

   nameInput = document.getElementById("report-name");
   descriptionInput = document.getElementById("report-description")

   tmpName = "Nuova Organizzazione (N° " + reportOrg.ID + ")";
   tmpDescription = "Organizzazione del giorno: " + reportOrg.DataReport + ",\nSulla cartella: [" + reportOrg.NomeCartella +"]"

   nameInput.value = tmpName;
   descriptionInput.value = tmpDescription;
}

