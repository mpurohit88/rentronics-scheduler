const connection = require('../config/connection.js');

const FixedOrder = function (params) {
  this.id = params.id;
  this.user_id = params.user_id;
  this.userid = params.userid;
  this.is_active = params.is_active;
  this.created_by = params.created_by;

  this.fixedOrderType = params.fixedOrderType;
  this.customer_id = params.customer_id;

}

FixedOrder.prototype.postOrder = function () {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      if (!error) {
        connection.changeUser({ database: dbName.getFullName(dbName["prod"], that.user_id.split('_')[1]) });

        const fixedValues = that.fixedOrderType;
        let fixedOrderValues = [
          [that.customer_id, fixedValues.int_unpaid_bal, fixedValues.cash_price, fixedValues.delivery_fee, fixedValues.ppsr_fee, fixedValues.liability_wavier_fee, fixedValues.frequency, fixedValues.first_payment, fixedValues.last_payment, fixedValues.duration, fixedValues.no_of_payment, fixedValues.each_payment_amt, fixedValues.total_payment_amt, fixedValues.before_delivery_amt, fixedValues.exp_delivery_date, fixedValues.exp_delivery_time, fixedValues.minimum_payment_amt, fixedValues.intrest_rate, fixedValues.intrest_rate_per, fixedValues.total_intrest, that.is_active, that.created_by]
        ];

        connection.query('INSERT INTO fixed_order(customer_id, int_unpaid_bal, cash_price, delivery_fee, ppsr_fee, liability_wavier_fee, frequency, first_payment, last_payment, duration, no_of_payment, each_payment_amt, total_payment_amt, before_delivery_amt, exp_delivery_date, exp_delivery_time, minimum_payment_amt, interest_rate, interest_rate_per, total_interest, is_active, created_by) VALUES ?', [fixedOrderValues], function (error, rows, fields) {
          if (!error) {
            resolve(rows.insertId);
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
      console.log('Order Added for Franchise Staff %d', connection.threadId);
    });
  }).catch((error) => {
    throw error;
  });
};

module.exports = FixedOrder;