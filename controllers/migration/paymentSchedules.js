const PaymentSchedules = require('../../models/migration/paymentSchedules');
const PaymentSchedule = require('../../models/migration/paymentSchedule');

const Order = require('../../api/order');

const readSchedule = async function () {

  // username: "ashu_auea_7575",
  // password: "agq7b1sb",

  const result = await Order.onLogin({
    username: "firs_auce_4049",
    password: "qulcuxqn",
  });

  try {
    const paymentSchedules = new PaymentSchedules();

    const scheudules = await paymentSchedules.readSchedule();

    console.log(new Date());

    let i = 0;
    let installment_no = 0;
    let arrayOfInsta = [];
    let is_active = 1;

    for (i = 0; i < scheudules.length; i++) {
      is_active = 1;
      const order_id = scheudules[i].order_id;

      if (scheudules[i].status === 1 || (scheudules[i].status === 0 && scheudules[i].remark !== '')) {
        if (arrayOfInsta[order_id]) {
          installment_no = arrayOfInsta[order_id];
          installment_no = installment_no + 1;
          arrayOfInsta[order_id] = installment_no;
        } else {
          installment_no = installment_no + 1;
          arrayOfInsta[order_id] = installment_no;
        }
      } else {
        installment_no = -1;
        is_active = 0;
      }

      // const paymentSchedule = new PaymentSchedule({
      //   id: scheudules[i].id,
      //   order_id: scheudules[i].order_id,
      //   customer_id: scheudules[i].customer_id,
      //   installment_no: installment_no,
      //   payment_date: scheudules[i].payment_date,
      //   status: scheudules[i].status,
      //   is_active: scheudules[i].is_active,
      //   created_at: scheudules[i].created_at,
      //   created_by: scheudules[i].created_by
      // });

      await Order.paymentSubmit({
        token: result.token, // added token for authentication
        order_id: scheudules[i].order_id,
        customer_id: scheudules[i].customer_id,
        installment_no: installment_no,
        payment_date: scheudules[i].payment_date,
        payment_rec_date: scheudules[i].payment_date,
        // payment_amt: paymentAmt,
        total_paid: totalPaid,
        due_installment_amt: 0,
        sub_installment_no: 0,
        installment_before_delivery: 0,
        last_installment_no: 13,
        each_payment_amt: 60,
        frequency: orderTypeData.frequency,
        status: payResopnse.status,
        order_type: orderData.order_type,
        no_of_total_installment: 13,
        last_date_of_payment: scheudules[i].payment_date,
      });

      paymentSchedule.insertRecord();
    }

    console.log(new Date());
    console.log("Completed....");
  } catch (ex) {
    console.log("error...", ex);
  }
}

module.exports = { readSchedule: readSchedule }