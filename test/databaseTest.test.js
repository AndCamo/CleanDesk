const { getConnection } = require("../src/StorageLayer/connectionPool.js");
var assert = require("assert");
var { expect } = require("expect");

describe('Checl database connection', function () {
   it('The connection should return the database connection', function () {
      const connection = getConnection()
      .catch((error) => {
          throw (error);
      });

      expect(connection).not.toBe(undefined);
   });
});