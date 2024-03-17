var assert = require("assert");
var { expect } = require("expect");
const { ipcRenderer } = require('electron');
const { promises: Fs } = require('fs')

let pahtToTest = [
   {
      path: "/Users/andrea/Desktop/NC23_CleanDesk/SDD",
      os: "mac"
   },
   {
      path: "/Users/andrea/Desktop/NC23_CleanDesk/RAD",
      os: "mac"
   }
]

describe('Cateogory 3) Check Correctness Category', function () {
   pahtToTest.forEach(function (data) {
      let path;
      let flag;
      before(function () {
         path = data.path;
         isDirectory(data.path)
         .then((data) => {
            flag = data;
         })
         .catch((error) => {
            throw error;
         });
      });
      it('The path should refer to a folder [' + data.path + ']', function () {
         expect(flag).toBeTruthy();
      });
   })
});


async function isDirectory(path) {  
   const stats = await Fs.stat(path)

   return stats.isDirectory()
 }