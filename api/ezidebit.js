
const axios = require('axios');


const {API_CONSUMER} = require('../config/db.js');


const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = {  
  updatePaymentSchedule:  async (payload, token) => {
    const URL = `${API_CONSUMER}/api/ezidebit/updatePaymentSchedule`;
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
}