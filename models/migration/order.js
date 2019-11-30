const connection = require('../config/connection.js');

const Budget = require('./budget');
const FixedOrder = require('./fixed_order');
const FlexOrder = require('./flex_order');

const Order = function (params) {
  this.id = params.id;
  this.user_id = params.user_id;

  this.order_id = params.order_id;
  this.customer_id = params.customer_id;
  this.customer_type = params.customer_type;
  this.products_id = params.products_id;
  this.order_type = params.order_type;
  this.order_type_id = params.order_type_id;
  this.flexOrderType = params.flexOrderType;
  this.fixedOrderType = params.fixedOrderType;
  this.payment_mode = params.payment_mode;
  this.order_date = params.order_date;
  this.budget_list = params.budget_list;

  this.assigned_to = params.assigned_to;
  this.is_active = params.is_active;
  this.created_by = params.created_by;
  this.related_to = params.related_to;
  this.renting_for_id = params.renting_for_id;
  this.sales_type_id = params.sales_type_id;
  this.delivery_date = params.delivery_date;
}

Order.prototype.postOrder = async function () {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        console.log('Error....', error)
        throw error;
      }

      if (!error) {
        connection.changeUser({ database: dbName.getFullName(dbName["prod"], that.user_id.split('_')[1]) });

        const budget_id = await new Budget({ budget_list: that.budget_list, customer_id: customer_id }).postOrder();
        let order_type_id;

        if (that.fixedOrderType != null) {
          order_type_id = await new FixedOrder({ fixedOrderValues: that.fixedOrderValues, customer_id: customer_id, is_active: that.is_active, created_by: that.created_by }).postOrder();
        }

        if (that.flexOrderType != null) {
          order_type_id = await new FlexOrder({ flexOrderType: that.flexOrderType, customer_id: customer_id, is_active: that.is_active, created_by: that.created_by }).postOrder();
        }

        const orderValues = [
          [that.order_id, that.customer_id, that.customer_type, that.products_id, that.related_to, that.sales_type_id, that.renting_for_id, that.order_type, order_type_id, budget_id, that.payment_mode, that.assigned_to, that.order_date, fixedValues.exp_delivery_date, fixedValues.exp_delivery_time, 1, that.is_active, that.created_by]
        ];

        connection.query('INSERT INTO orders(order_id, customer_id, customer_type, product_id, product_related_to, sales_type_id, renting_for_id, order_type, order_type_id, budget_id, payment_mode, assigned_to, order_date, delivery_date, delivery_time, order_status, is_active, created_by) VALUES ?', [orderValues], function (error, rows, fields) {
          if (!error) {
            // console.log('order inserted', rows.insertId);
            resolve({ order_id: rows.insertId, budget_id: budget_id });
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
    console.log("Error...", error);
    throw error;
  });
};

Order.prototype.readExistingOrder = async function () {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        console.log("Error...", error);
        throw error;
      }

      if (!error) {
        connection.changeUser({ database: '' });

        connection.query('select * from order', function (error, rows, fields) {
          if (!error) {
            // console.log('order inserted', rows.insertId);
            resolve({ orders: rows });
          } else {
            console.log("Error...", error);
            reject(error);
          }
        });
      }
    });
  });
}

module.exports = Order;