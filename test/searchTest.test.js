var assert = require("assert");
var { expect } = require("expect");
const { getConnection } = require("../src/StorageLayer/connectionPool.js");
const { FileReportDAO } = require("../src/StorageLayer/FileReportDAO.js");
const { ReportORGBean } = require("../src/StorageLayer/ReportORGBean");
const { ReportORG_DAO } = require("../src/StorageLayer/ReportORG_DAO");

let nameToTest = [
   {
      name: "Appdasdle",
      reportId: 303
   },
   {
      name: "Apple",
      reportId: 303
   }
]
describe('Insert file to search', function () {
   describe('Cateogory 1) Check MatchReport Category', function () {
      nameToTest.forEach(function (data) {
         let name;
         let reportId;
         let reportOrg = new ReportORGBean();
         beforeEach(function () {
            name = data.name;
            reportId = data.reportId;
            const reportORG_DAO = new ReportORG_DAO();

            reportORG_DAO.getReportByID(reportId).then((data) => {
               reportOrg = data[0];
            })
         });
         it('The ID of the Report to search should be in the database [' + data.name + ']', function () {
            expect(reportOrg).not.toBeUndefined();
         });
      })
   })
});
