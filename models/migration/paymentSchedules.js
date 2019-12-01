const connection = require('../../config/connection.js');

const PaymentSchedules = function (params) {

}

PaymentSchedules.prototype.readSchedule = function () {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      if (!error) {
        connection.changeUser({ database: 'rentronicnew_auce' });

        connection.query("SELECT ins.id, ps.order_id, ins.user_id as customer_id, ps.payment_amount, ps.scheduled_date as payment_date, ps.payment_amount, ps.payment_status as status, ps.remark, '1' as is_active, '4' as created_by, ps.created_at FROM `orders_rentonics` as ins inner join payment_schedules as ps on ins.id = ps.order_id where order_no like 'Auc%' and order_id = 4 order by payment_date", function (error, rows, fields) {
          if (!error) {
            resolve(rows);
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
    throw error;
  });
};

module.exports = PaymentSchedules;