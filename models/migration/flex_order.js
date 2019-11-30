const connection = require('../config/connection.js');

const FlexOrder = function (params) {
  this.id = params.id;
  this.user_id = params.user_id;
  this.userid = params.userid;
  this.is_active = params.is_active;
  this.created_by = params.created_by;

  this.flexOrderType = params.flexOrderType;
  this.customer_id = params.customer_id;
}

FlexOrder.prototype.postOrder = function () {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      if (!error) {
        connection.changeUser({ database: dbName.getFullName(dbName["prod"], that.user_id.split('_')[1]) });

        const flexValues = that.flexOrderType;
        const flexOrderValues = [
          [that.customer_id, flexValues.goods_rent_price, flexValues.ppsr_fee, flexValues.liability_fee, flexValues.weekly_total, flexValues.frequency, flexValues.first_payment, flexValues.each_payment_amt, flexValues.before_delivery_amt, flexValues.exp_delivery_date, flexValues.exp_delivery_time, flexValues.bond_amt, that.is_active, that.created_by]
        ];

        connection.query('INSERT INTO flex_order(customer_id, goods_rent_price, ppsr_fee, liability_fee, weekly_total, frequency, first_payment, each_payment_amt, before_delivery_amt, exp_delivery_date, exp_delivery_time, bond_amt, is_active, created_by) VALUES ?', [flexOrderValues], function (error, rows, fields) {
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

module.exports = FlexOrder;