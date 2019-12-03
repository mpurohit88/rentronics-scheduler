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
        connection.changeUser({ database: 'rentronicsnew_auea' });
        // connection.query("SELECT ins.id, ps.order_id, ins.user_id as customer_id, ps.payment_amount, ps.scheduled_date as payment_date, ps.payment_amount, ps.payment_status as status, ps.remark, '1' as is_active, '4' as created_by, ps.created_at FROM `prod_orders` as ins inner join payment_schedules as ps on ins.id = ps.order_id where order_no like 'Auc%' and order_id = 4 order by payment_date", function (error, rows, fields) {
        // connection.query("SELECT ps.order_id, o.user_id as customer_id, ins.installment_no, ps.scheduled_date as payment_date, ps.payment_status as `status`, \'1\' as is_active, ps.remark, \'4\' as created_by, ps.created_at FROM `payment_schedules` as ps INNER JOIN prod_orders as o ON ps.order_id = o.id  AND o.assigned_to = 16 INNER JOIN (SELECT id, @row_number:=CASE WHEN @db_names=order_id THEN @row_number+1 ELSE 1 END AS installment_no, @db_names:=order_id AS order_id FROM payment_schedules, (SELECT @row_number:=0,@db_names:='') AS t ORDER BY order_id, scheduled_date) as ins ON ps.id = ins.id ORDER BY ps.order_id, ins.installment_no, ps.scheduled_date", function (error, rows, fields) {
        // connection.query("SELECT ps.order_id, o.user_id as customer_id, ins.installment_no, ps.scheduled_date as payment_date, ps.payment_status as `status`, 1 as is_active, ps.remark, 4 as created_by, (CASE o.frequency WHEN 1 THEN 4 WHEN 2 THEN 2 END) as frequency, o.rental as order_type, SUM(CASE ps.payment_status WHEN 1 THEN ps.payment_amount ELSE 0 END) AS payment_amt FROM `payment_schedules` as ps INNER JOIN prod_orders as o ON ps.order_id = o.id  AND o.assigned_to = 16 INNER JOIN (SELECT id, @row_number:=CASE WHEN @db_names=order_id THEN @row_number+1 ELSE 1 END AS installment_no, @db_names:=order_id AS order_id FROM payment_schedules, (SELECT @row_number:=0,@db_names:='') AS t ORDER BY order_id, scheduled_date) as ins ON ps.id = ins.id GROUP BY ps.order_id ORDER BY ps.order_id, ins.installment_no, ps.scheduled_date", function (error, rows, fields) {
          connection.query("SELECT ps.order_id, o.user_id as customer_id, ins.installment_no, DATE_FORMAT(ps.scheduled_date, '%Y-%m-%d') as payment_date, DATE_FORMAT(ps.payment_date, '%Y-%m-%d') as payment_rec_date, ps.payment_status as `status`, '1' as is_active, ps.remark,  '4' as created_by, ps.created_at, ps.payment_amount FROM `payment_schedules` as ps INNER JOIN prod_orders as o ON ps.order_id = o.id  AND o.assigned_to = 16 INNER JOIN (SELECT id, @row_number:=CASE WHEN @db_names=order_id THEN @row_number+1 ELSE 1 END AS installment_no, @db_names:=order_id AS order_id FROM payment_schedules, (SELECT @row_number:=0,@db_names:='') AS t ORDER BY order_id, scheduled_date) as ins ON ps.id = ins.id ORDER BY ps.order_id, ins.installment_no, ps.scheduled_date", function (error, rows, fields) {
          
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

