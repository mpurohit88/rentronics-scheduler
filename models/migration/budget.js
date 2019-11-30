const connection = require('../config/connection.js');

const Budget = function (params) {
  this.id = params.id;
  this.user_id = params.user_id;
  this.userid = params.userid;
  this.is_active = params.is_active;
  this.created_by = params.created_by;

  this.budget_list = params.budget_list;
  this.customer_id = params.customer_id;
}

Budget.prototype.postOrder = function () {
  const that = this;
  return new Promise(function (resolve, reject) {

    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      if (!error) {
        connection.changeUser({ database: dbName.getFullName(dbName["prod"], that.user_id.split('_')[1]) });

        const budget_list = that.budget_list;
        const budgetValues = [
          [that.customer_id, budget_list.work, budget_list.benefits, budget_list.accomodation, budget_list.childcare, budget_list.rent, budget_list.power, budget_list.telephone, budget_list.mobile, budget_list.vehicle, budget_list.vehicle_fuel, budget_list.transport, budget_list.food, budget_list.credit_card, budget_list.loan, budget_list.other_expenditure, budget_list.pre_order_exp, budget_list.income, budget_list.expenditure, budget_list.surplus, budget_list.afford_amt, budget_list.paid_day, budget_list.debited_day, 1, that.created_by]
        ];

        connection.query('INSERT INTO budget(customer_id, work, benefits, accomodation, childcare, rent, power, landline_phone, mobile_phone, vehicle_finance, vehicle_fuel, public_transport, food, credit_store_cards, loans_hire_purchase, other_expenditure, pre_order_exp, total_income, total_expenditure, total_surplus, afford_amt, paid_day, debited_day,  is_active, created_by) VALUES ?', [budgetValues], function (error, rows, fields) {
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

module.exports = Budget;