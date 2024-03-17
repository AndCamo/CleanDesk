var assert = require("assert");
var { expect } = require("expect");



const pathRegexMac = /^(?:\/(?:[^\/:]+\/)*)?(?:[^\/]+)?$/;
const pathRegexWindows = /^(?:[a-zA-Z\s]:\\|\\\\)(?:[^\\\s:]+\\)(?:[^\/:<>"?|]+)?$/;
const deniedPaths = ["/Library", "/Applications", "/System", "C:\\Windows", "C:\\Program Files (x86)", "C:\\Program Files", "C:\\ProgramData", "C:\\Recovery"]


let pahtToTest = [
   {
      path: "D:\\Downloads\\Images\\",
      os: "win"
   },
   {
      path: "/Users/Andrea/Desktop/Work/",
      os: "mac"
   }
]


describe('Insert folder Path to organize', function () {
   describe('Cateogory 1) Check Lenght Category', function () {
      pahtToTest.forEach(function (data) {
         let lenght
         before(function () {
            lenght = data.path.length
         });
         it('The lenght of the path should be between 4 and 256 [' + data.path + ']', function () {
            expect(lenght).toBeGreaterThanOrEqual(4)
            expect(lenght).toBeLessThanOrEqual(256)
         });
      })
   });

   describe('Category 2) Check Format Category', function () {
      pahtToTest.forEach(function (data) {
         let regex
         before(function () {
            if (data.os == "mac") {
               regex = pathRegexMac
            } else {
               regex = pathRegexWindows
            }
         });
         it('The path should match the respective regular expression [' + data.path + ']', function () {
            expect(data.path).toMatch(regex);
         });
      })
   });

   describe('Category 4) Check Admissibility Category', function () {
      pahtToTest.forEach(function (data) {
         let flag;
         let path;
         before(function () {
            path = data.path;
            flag = true;
         });
         it('The Path must refer to an eligible folder [' + data.path + ']', function () {
            for (let item of deniedPaths){
               if(path.startsWith(item)){
                  flag = false;
               }
            }
            expect(flag).toBeTruthy();
         });
      })
   });
});
