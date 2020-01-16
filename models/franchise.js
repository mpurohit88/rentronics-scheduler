const connection = require('../config/connection.js');
const { dbName } = require('../config/db.js');

const Franchise = function (params) {

};

Franchise.prototype.getFranchiseDBName = function () {
  return new Promise((resolve, reject) => {
    connection.getConnection((error, connection) => {
      if (error) {
        throw error;
      }

      if (!error) { 
        connection.changeUser({ database: dbName });
        connection.query(`Select fdbname From franchise`, (error, rows, fields) => {
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

module.exports = Franchise;
