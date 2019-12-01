const connection = require('../../config/connection.js');

const PaymentSchedule = function (params) {
  this.id = params.id;
  this.order_id = params.order_id;
  this.customer_id = params.customer_id;
  this.installment_no = params.installment_no;
  this.payment_date = params.payment_date;
  this.status = params.status;
  this.is_active = params.is_active;
  this.created_at = params.created_at;
  this.created_by = params.created_by;
}

PaymentSchedule.prototype.insertRecord = async function () {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        console.log('Error....', error)
        throw error;
      }

      if (!error) {
        connection.changeUser({ database: 'rentronicnew_auce' });

        const scheduleValues = [
          [that.id, that.order_id, that.customer_id, that.installment_no, that.payment_date, that.status, that.is_active, that.created_at, that.created_by]
        ];

        connection.query('INSERT INTO payment_schedule(id, order_id, customer_id, installment_no, payment_date, status, is_active, created_at, created_by) VALUES ?', [scheduleValues], function (error, rows, fields) {
          if (!error) {
            // console.log('order inserted', rows.insertId);
            resolve({ order_id: rows.insertId });
          } else {
            console.log("Error...", error);
            reject(error);
          }
        });

      } else {
        console.log("Error...", error);
        reject(error);
      }
      connection.release();
    });
  }).catch((error) => {
    console.log("Error...", error);
    throw error;
  });
};

module.exports = PaymentSchedule;