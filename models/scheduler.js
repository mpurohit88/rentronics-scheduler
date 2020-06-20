const connection = require('../config/connection.js');

const Scheduler = function (params) {
  this.dbName = params.dbName;
  this.type = params.type;
  this.customer_id = params.customerId;
};

Scheduler.prototype.saveScheduler = function () {
  const that = this;
  return new Promise((resolve, reject) => {
    connection.getConnection((error, connection) => {
      if (error) { throw error; }

      let values = [[that.type, that.customer_id]];

      connection.changeUser({ database: that.dbName });
      connection.query('INSERT INTO scheduler(type, customer_id) VALUES ?', [values], function (error, rows, fields) {
        if (error) { console.log('Error...', error); reject(error); }
          resolve(rows);
      });
      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  }).catch(error => {
    throw error;
  });
};

module.exports = Scheduler;
