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
  this.payment_rec_date =  params.payment_rec_date;
  this.payment_amt =  params.payment_amt;
  this.total_paid =  params.total_paid;
  this.due_installment_amt = params.due_installment_amt;
  this.sub_installment_no =  params.sub_installment_no;
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
        connection.changeUser({ database: 'rentronicsnew_auea' });
         let Values = [
          [that.order_id, that.customer_id, that.installment_no, that.sub_installment_no, that.payment_date, that.payment_rec_date, that.payment_amt, that.total_paid, that.due_installment_amt, that.status, that.is_active, that.created_by, that.created_at]
        ];
        
        connection.query('INSERT INTO payment_status(order_id, customer_id, installment_no, sub_installment_no, payment_date, payment_rec_date, payment_amt, total_paid, due_installment_amt, status, is_active, created_by, created_at) VALUES ?', [Values], function (error, rows, fields) {
        // connection.query('INSERT INTO payment_schedule(order_id, customer_id, installment_no, payment_date, status, is_active, created_at, created_by) VALUES ?', [scheduleValues], function (error, rows, fields) {
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