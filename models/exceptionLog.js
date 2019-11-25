const connection = require('../config/connection.js');

var ExceptionLog = function (params) {
  this.dbName = params.dbName;
  this.code = params.code;
  this.message = params.message;
  this.franchise_id = params.franchise_id;
  this.stack = params.stack;
  this.created_by = params.created_by;
};


ExceptionLog.prototype.log = function () {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      if (!error) {
        connection.changeUser({ database: dbName["prod"] });
        connection.query('INSERT INTO exception_log(code, message, franchise_id, stack, created_by) VALUES ("' + that.code + '", "' + that.message + '", "' + that.franchise_id + '","' + that.stack + '", "' + that.created_by + '")', function (error, rows, fields) {
          if (!error) {
            // console.log(rows.insertId)
          } else {
            console.log("Error...", error);
            reject(error);
          }
        });

        resolve();

      } else {
        console.log("Error...", error);
        reject(error);
      }

      connection.release();
      console.log('Exception Added %d', connection.threadId);
    });
  }).catch((error) => {
    throw error;
  });
}

module.exports = ExceptionLog;
