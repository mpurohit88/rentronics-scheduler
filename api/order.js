
const axios = require('axios');


const {API_CONSUMER} = require('../config/db.js');


const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = {  
  getPaymentSchedule: async (payload, token) => {    
    const URL = `${API_CONSUMER}/api/franchise/order/getPaymentSchedule`;
    // console.log('url....', URL, payload, token);
    try {
      const { data } = await axios(URL, {
          method: 'POST',
          data: payload,
          headers: {  'Content-Type': 'application/json', },
          headers: { Authorization: `Basic ${token}` },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  
  paymentSubmit: async (payload, token) => {
    const URL = `${API_CONSUMER}/api/franchise/order/paymentsubmit`;
    try {
      const { data } = await axios(URL, 
        {
          method: 'POST',
          data: payload,
          headers: { 'Content-Type': 'application/json' },
          headers: { Authorization: `Basic ${token}` },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  
  dishonourToPayment:  async (payload, token) => {
    const URL = `${API_CONSUMER}/api/franchise/order/dishonourToPayment`;
    try {
      const { data } = await axios(URL, 
        {
          method: 'POST',
          data: payload,
          headers: { 'Content-Type': 'application/json' },
          headers: { Authorization: `Basic ${token}` }
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
  

  // onLogin: async ({ ...payload }) => {
  //   const URL = `${API_CONSUMER}/api/auth/login`;
  //   try {
  //     const { data } = await axios(
  //       URL,
  //       Object.assign({}, PARAMS({ methodType: 'POST' }), {
  //         data: payload,
  //       }),
  //     );
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // paymentSubmit: async (req) => {
  //   const URL = `${API_CONSUMER}/api/franchise/order/paymentsubmit`;
  //   try {
  //     const { data } = await axios(URL, {
  //       method: 'POST',
  //       data: req,
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       headers: { Authorization: `Basic ${req.token}` }
  //     }
  //     );
  //     return data;
  //   } catch (error) {
  //     checkError();
  //     throw error;
  //   }
  // }
}