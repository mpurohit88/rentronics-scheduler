const connection = require('../config/connection.js');

const Customer = function (params) {
  this.dbName = params.dbName;
};

Customer.prototype.getBirthDate = function () {
  const that = this;

  return new Promise((resolve, reject) => {
    connection.getConnection((error, connection) => {
      if (error) {
        throw error;
      }

      if (!error) {
        connection.changeUser({ database: that.dbName });
        connection.query(`Select dob, email, id From customer`, (error, rows, fields) => {
          if (!error) {
            resolve(rows);
          } else {
            console.log('Error...', error);
            reject(error);
          }
        },
        );
      } else {
        console.log('Error...', error);
        reject(error);
      }

      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  }).catch(error => {
    throw error;
  });
};

module.exports = Customer;
