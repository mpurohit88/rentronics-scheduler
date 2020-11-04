const connection = require('../config/connection.js');
const { dbName } = require('../config/db.js');

const Franchise = function (params) {

};

Franchise.prototype.getFranchiseDBName = function () {
  return new Promise((resolve, reject) => {
    connection.getConnection((error, connection) => {
      if (error) { throw error; }

      connection.changeUser({ database: dbName });
      connection.query(`Select f.fdbname, f.name as franchise_name, c.name as company_name,  c.nbzn, c.location, c.director as director_name, c.email, c.contact, c.alt_contact, c.website from company as c INNER JOIN franchise as f ON c.company_id = f.company_id GROUP BY f.fdbname`, (error, rows, fields) => {
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





Franchise.prototype.getEzidebitAccountDetails = function () {
  return new Promise((resolve, reject) => {
    connection.getConnection((error, connection) => {
      if (error) { throw error; }

      connection.changeUser({ database: dbName });
      let Query = `SELECT f.fdbname, AES_DECRYPT(digital_key, 'rentronics') as digital_key, AES_DECRYPT(user_name, 'rentronics') as user_name, AES_DECRYPT(client_id, 'rentronics') as client_id FROM ezidebit_creds as ec INNER JOIN franchise as f ON f.id = ec.franchise_id WHERE ec.status = 1 AND ec.is_active = 1`;
      connection.query(Query, (error, result, fields) => {
          if (error) { console.log('Error...', error); reject(error); }          
          let decryptResult = [];
          Object.values(result).map((data) => {
            decryptResult.push({
              fdbname: data.fdbname,
              digital_key: data.digital_key.toString('utf8'),
              user_name: data.user_name.toString('utf8'),
              client_id: data.client_id.toString('utf8'),
            });
          });
          resolve(decryptResult);
      });
      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  }).catch(error => {
    throw error;
  });
};




module.exports = Franchise;
