const { ReportORG_DAO } = require("../../StorageLayer/ReportORG_DAO");


class VisualizzaReportControl{
   constructor(){}

   async getAllReports(){ //taking all the reports
      let reportORG_DAO = new ReportORG_DAO();
      let reportORGBeanList = [];

      await reportORG_DAO.getAll().then((objs) =>{
         reportORGBeanList = objs;
      })
      .catch((err) =>{
         console.error(err.message);
      });

      return reportORGBeanList;
   }

   async getAllFromReports(dateFrom){ //Taking all from a specified date to now
      let reportORG_DAO = new ReportORG_DAO();
      let reportORGBeanList = [];
      let date = new Date().toISOString().slice(0,10);

      await reportORG_DAO.getFromDateTo(dateFrom,date).then((objs) =>{
         reportORGBeanList = objs;
      }).catch((err) =>{
         console.error(err);
      });
      return reportORGBeanList;
   }

   async getUntilReport(dateTo){ //taking all from first to a specified date
      let reportORG_DAO = new ReportORG_DAO();
      let reportORGBeanList = [];
      console.log("Visualizza Report Control" + dateTo)
      await reportORG_DAO.getReportUntil(dateTo).then((objs) =>{
         reportORGBeanList = objs;
      })
      .catch((err) =>{
         console.error(err);
      })
      return reportORGBeanList;
   }

   async getFromToReport(dateFrom,dateTo){ //Taking the report from a specified date, to a specified date
      let reportORG_DAO = new ReportORG_DAO();
      let reportORGBeanList = [];

      await reportORG_DAO.getFromDateTo(dateFrom,dateTo)
         .then((obj) =>{
            reportORGBeanList = obj;
         })
         .catch((err) =>{
            console.error(err);
         });

      return reportORGBeanList;
   }
}

module.exports = {VisualizzaReportControl};

async function test() {
   const viewControl = new VisualizzaReportControl();
   let dateFrom = "2024-01-20";
   let dateTo = "2024-01-23";
   let list = await viewControl.getUntilReport(dateTo).catch((err)=>{
      console.log(err)
   });
   console.log(list);
}
//test()
