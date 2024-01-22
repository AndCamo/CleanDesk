const { ReportORG_DAO } = require("../../StorageLayer/ReportORG_DAO");


class VisualizzazioneReportControl{
   constructor(){}

   async viewReports(dateFrom, dateTo){
      let reportORG_DAO = new ReportORG_DAO();
      let reportORGBeanList = [];

      if(dateTo == ""  && dateFrom == ""){ // Taking all the reports
         console.log("NOT Date FROM and NOT TO\n");
         await reportORG_DAO.getAll().then((objs) =>{
            console.log("All Obj:", objs);
            reportORGBeanList = objs;
         })
         .catch((err) =>{
            console.error(err.message);
         });
      }
      else if(dateTo == "" && dateFrom != ""){ //Taking all from a specified date to now
         console.log("Date FROM but NOT Date TO \n");
         let date = new Date().toISOString().slice(0,10);
         await reportORG_DAO.getFromDateTo(dateFrom,date).then((objs) =>{
         console.log("All Obj:", objs);
         reportORGBeanList = objs;
         });
      }
      else if(dateTo != "" && dateFrom == ""){ //taking all from first to a specified date
         console.log("NOT Date FROM but Date TO \n");
         await reportORG_DAO.getReportUntil(dateTo).then((objs) =>{
         console.log("All Obj:", objs);
         reportORGBeanList = objs;
         });
      }
      else if(dateTo != "" && dateFrom != ""){ //taking from a specified date to a specified date
         console.log("Date FROM and Date TO insered\n");
         await reportORG_DAO.getFromDateTo(dateFrom,dateTo)
         .then((obj) =>{
            reportORGBeanList = obj;
            console.log("All Obj: ", obj);
         })
         .catch((err) =>{
            console.error(err);
         })
         
      }
   return reportORGBeanList;
   }
}

async function test() {
   const viewControl = new VisualizzazioneReportControl();
   let dateFrom = "2024-01-20";
   let dateTo = "2024-01-22";
   let list = viewControl.viewReports(dateFrom, dateTo);
}

//test()
