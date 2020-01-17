const connection = require('../config/connection.js');


const Report = function (params) {
    this.dbName = params.dbName;
};



Report.prototype.getActiveOrder = function () {
    const that = this;
    return new Promise((resolve, reject) => {
      connection.getConnection((error, connection) => {
        if (error) {
          throw error;
        }
        if (!error) {
                connection.changeUser({ database: that.dbName });
                // connection.query('SELECT o.id as order_id, o.customer_id FROM orders as o WHERE is_active = 1 AND o.assigned_to = 4', function (error, rows, fields) {
                connection.query('SELECT o.id, o.order_id, o.customer_id, c.first_name, c.last_name, c.address, c.mobile, c.telephone, c.email, c.postcode, DATE_FORMAT(o.order_date, \'%Y-%m-%d\') order_date, o.order_status, o.assigned_to, o.order_type, o.payment_mode, o.product_id, o.order_type_id, DATE_FORMAT(o.delivery_date, \'%Y-%m-%d\') delivery_date, DATE_FORMAT(o.delivery_time, \'%T\') delivery_time, os.order_status as order_status_name from orders as o INNER JOIN customer as c on o.customer_id = c.id INNER JOIN order_status as os on o.order_status = os.id WHERE o.is_active = 1 AND o.assigned_to = 4', function (error, rows, fields) {

              if (!error) {
                resolve(rows);
              } else {
                console.log("Error...", error);
                reject(error);
              }
            });
          }
        connection.release();
        console.log('Process Complete %d', connection.threadId);
      });
    });
  };

  

Report.prototype.getOrderReport = function (order_id, customer_id) {
  const that = this;
  return new Promise((resolve, reject) => {
    connection.getConnection((error, connection) => {
      if (error) {
        throw error;
      }
      if (!error) {
            connection.changeUser({ database: that.dbName });
            connection.query('SELECT ps.id, ps.order_id, ps.customer_id, ps.installment_no, DATE_FORMAT(ps.payment_date,\'%Y-%m-%d\') payment_date, DATE_FORMAT(ps.settlement_date,\'%Y-%m-%d\') settlement_date, ps.payment_amt, ps.total_paid, ps.remark, ps.status, sp.status as status_name, ps.is_active FROM payment_schedules as ps LEFT JOIN status_payment as sp ON ps.status = sp.id WHERE ps.order_id = "'+ order_id +'" AND ps.customer_id = "'+ customer_id +'" AND DATE_FORMAT(ps.payment_date, \'%Y-%m-%d\') BETWEEN  DATE_FORMAT("2019-12-17",\'%Y-%m-%d\') AND DATE_FORMAT("2020-01-17" ,\'%Y-%m-%d\')', function (error, rows, fields) {
            if (!error) {
              resolve(rows);
            } else {
              console.log("Error...", error);
              reject(error);
            }
          });
        }
      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
};



module.exports = Report;
