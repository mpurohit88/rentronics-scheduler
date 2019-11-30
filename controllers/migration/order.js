const Order = require('../../models/migration/order');

const postOrder = async function () {

  const orderObj = new Order();

  const orders = orderObj.readExistingOrder();

  for (const order of orders) {

    let orderParams = {
      user_id: req.decoded.user_id,
      userid: req.decoded.id,

      order_id: req.body.order_id,
      customer_id: req.body.customer_id,
      customer_type: req.body.customer_type,
      products_id: req.body.products_id,
      order_type: req.body.order_type,
      flexOrderType: req.body.flexOrderType,
      fixedOrderType: req.body.fixedOrderType,
      payment_mode: req.body.payment_mode,
      order_date: req.body.order_date,
      budget_list: req.body.budget_list,
      related_to: req.body.related_to,
      assigned_to: req.body.assigned_to,
      is_active: req.body.is_active,
      created_by: req.decoded.id,
      duration: req.body.duration,
      sales_type_id: req.body.sales_type_id,
      renting_for_id: req.body.renting_for_id,
      converted_to: req.body.converted_to,
    };

    if (orderParams.user_id != ''
      && orderParams.order_id != null
      && orderParams.customer_id != null
      && orderParams.products_id != ''
      && orderParams.order_type != null
      && orderParams.budget_list != ""
      && orderParams.order_date != ''
      && orderParams.payment_mode != null
      && orderParams.assigned_to != null
      && (orderParams.flexOrderType != null || orderParams.fixedOrderType != null)) {
      try {
        const newOrder = new Order(orderParams);

        const result = await newOrder.postOrder();

        return 'successful'
        // res.send({ order: order });
      } catch (err) {
        next(err);
      }
    } else {
      console.log('Invalid or Incomplete Credentials');
      res.send('invalid');
    }
  }


};

module.exports = { postOrder }