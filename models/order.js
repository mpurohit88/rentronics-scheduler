const axios = require('axios');
const connection = require('../config/connection.js');
const { dbName } = require('../config/db.js');
const { isNullOrUndefined } = require('util');
const { getDateTime, getDate } = require('../common/datetime.js');

let Order = function (params) {
  this.fdbName = params.fdbName;
  this.order_id = params.order_id;
};



Order.prototype.getOrdersDetails = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }

      connection.changeUser({ database: that.fdbName });
        connection.query(`SELECT o.*, u.user_id, u.id AS userId FROM orders AS o INNER JOIN user AS u ON u.id = o.created_by INNER JOIN ezidebit_payments AS ep ON ep.yourSystemReference = o.order_id WHERE ep.eziDebitCustomerID IN('${that.order_id}') GROUP BY o.order_id;`, function (error, rows, fields) {
          if (error) { console.log("Error...", error); reject(error); }
          resolve(rows);       
        });
      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
};



Order.prototype.getPaymentSchedule = function (order_id) {
  const that = this;
  let paymentSchedule = [];
  const nextInst = [];
  let lastInst = [];

  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) { throw error; }
        connection.changeUser({ database: that.fdbName });

        connection.query('SELECT ps.`id`, ps.`order_id`, ps.`customer_id`, ps.`installment_no`, DATE_FORMAT(ps.`payment_date`, \'%Y-%m-%d\') payment_date, DATE_FORMAT(ps.`settlement_date`,\'%Y-%m-%d\') settlement_date, ps.`payment_amt`, ps.`total_paid`, ps.`remark`, ps.`status`, ps.`is_active`, ps.`created_by`, ps.`updated_by`, ps.`created_at`, ps.`updated_at`, sp.status as pay_status_name, u.name as accept_by FROM `payment_schedules` as ps LEFT JOIN status_payment as sp ON ps.status = sp.id  LEFT JOIN user as u ON u.id = ps.created_by where ps.order_id = "' + order_id + '" AND ps.is_active = 1 AND ps.status IN(1,7,16,17) ORDER BY installment_no, id LIMIT 1', function (error, nextInst, fields) {
            if (error) { console.log("Error...", error); reject(error); }
            connection.query('SELECT ps.`id`, ps.`total_paid`, ps.`status` FROM `payment_schedules` as ps WHERE  ps.order_id = "' + order_id + '" AND  total_paid != \'\' AND status != 1 ORDER BY total_paid DESC LIMIT 1', function (error, lastInst, fields) {
              if (error) { console.log("Error...", error); reject(error); }
                resolve({ nextInstallmentRow: nextInst[0], lastInst: lastInst[0] });
            });
        });

      connection.release();
      console.log('Payment Schedule fetched %d', connection.threadId);
    });
  }).catch((error) => {
    throw error;
  });
};

module.exports = Order;