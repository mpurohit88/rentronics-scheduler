
const axios = require('axios');
const API_CONSUMER = 'http://localhost:3000';

const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = {
  onLogin: async ({ ...payload }) => {
    const URL = `${API_CONSUMER}/api/auth/login`;
    try {
      const { data } = await axios(
        URL,
        Object.assign({}, PARAMS({ methodType: 'POST' }), {
          data: payload,
        }),
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
  paymentSubmit: async (req) => {
    const URL = `${API_CONSUMER}/api/franchise/order/paymentsubmit`;
    try {
      const { data } = await axios(URL, {
        method: 'POST',
        data: req,
        headers: {
          'Content-Type': 'application/json',
        },
        headers: { Authorization: `Basic ${req.token}` }
      }
      );
      return data;
    } catch (error) {
      checkError();
      throw error;
    }
  }
}