const connection = require('../config/connection.js');
const { dbName } = require('../config/db.js');

const Report = function (params) {
    this.dbName = params.dbName;
    this.products_id = params.products_id;
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
                connection.query('SELECT o.id, o.order_id, o.customer_id, c.first_name, c.last_name, c.address, c.city, c.mobile, c.telephone, c.email, c.postcode, DATE_FORMAT(o.order_date, \'%Y-%m-%d\') order_date, o.order_status, o.assigned_to, o.order_type, o.payment_mode, o.product_id, o.order_type_id, DATE_FORMAT(o.delivery_date, \'%Y-%m-%d\') delivery_date, DATE_FORMAT(o.delivery_time, \'%T\') delivery_time, os.order_status as order_status_name from orders as o INNER JOIN customer as c on o.customer_id = c.id INNER JOIN order_status as os on o.order_status = os.id WHERE o.is_active = 1 AND o.assigned_to = 4', function (error, rows, fields) {

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

  
  

Report.prototype.getOrderType = function (orderId, orderType, orderTypeId) {
  const that = this;
  return new Promise((resolve, reject) => {
    connection.getConnection((error, connection) => {
      if (error) {
        throw error;
      }
      if (!error) {
        connection.changeUser({ database: that.dbName });
          if(orderType === 1){
            connection.query('SELECT `id`, `customer_id`, `int_unpaid_bal`, `cash_price`, `delivery_fee`, `ppsr_fee`, `discount`, `liability_wavier_fee`, `frequency`, DATE_FORMAT(`first_payment`,  \'%Y-%m-%d\') as `first_payment`, DATE_FORMAT(`last_payment`,  \'%Y-%m-%d\') as `last_payment`, `duration`, `no_of_payment`, `each_payment_amt`, `total_payment_amt`, `before_delivery_amt`, DATE_FORMAT(`exp_delivery_date`,  \'%Y-%m-%d\') as `exp_delivery_date`,  DATE_FORMAT(`exp_delivery_time`, \'%h:%i:%p\') as exp_delivery_time, `minimum_payment_amt`, `interest_rate`, `interest_rate_per`, `total_interest`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at` FROM `fixed_order` where id = "'+ orderTypeId +'"',function (error, rows, fields) {
              if (error) { console.log("Error...", error); reject(error); }
              resolve(rows);
            });
          }else if(orderType === 2){
            connection.query('SELECT `id`, `customer_id`, `goods_rent_price`, `ppsr_fee`, `liability_fee`, `weekly_total`, `frequency`, DATE_FORMAT(`first_payment`,  \'%Y-%m-%d\') as first_payment, `duration`, `each_payment_amt`, `before_delivery_amt`, DATE_FORMAT(`exp_delivery_date`, \'%Y-%m-%d\') as exp_delivery_date, DATE_FORMAT(`exp_delivery_time`, \'%h:%i:%p\') as exp_delivery_time, `bond_amt`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at` FROM `flex_order` where id = "'+ orderTypeId +'"',function (error, rows, fields) {
              if (error) { console.log("Error...", error); reject(error); }
                resolve(rows);
            });
          }
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
            connection.query('SELECT DATE_ADD(DATE_ADD(LAST_DAY(NOW()),INTERVAL 1 DAY), INTERVAL -2 MONTH) AS first_date,  LAST_DAY(DATE_SUB(DATE(NOW()) , INTERVAL 1 MONTH)) as last_date, ps.id, ps.order_id, ps.customer_id, ps.installment_no, DATE_FORMAT(ps.payment_date,\'%Y-%m-%d\') payment_date, DATE_FORMAT(ps.settlement_date,\'%Y-%m-%d\') settlement_date, ps.payment_amt, ps.total_paid, ps.remark, ps.status, sp.status as status_name, ps.is_active FROM payment_schedules as ps LEFT JOIN status_payment as sp ON ps.status = sp.id WHERE ps.order_id = "'+ order_id +'" AND ps.customer_id = "'+ customer_id +'" AND DATE_FORMAT(ps.payment_date, \'%Y-%m-%d\') BETWEEN DATE_ADD(DATE_ADD(LAST_DAY(NOW()),INTERVAL 1 DAY), INTERVAL -2 MONTH) AND  LAST_DAY(DATE_SUB(DATE(NOW()) , INTERVAL 1 MONTH))', function (error, rows, fields) {
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



Report.prototype.getProductDetail = function (productsId) {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      if (!error) {
        connection.changeUser({ database: dbName });
        connection.query('select * from product where id IN('+productsId+')',function (error, rows, fields) {                
            resolve(rows);
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


module.exports = Report;
