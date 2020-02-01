const moment = require('moment');

const getDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
}

const getDateInDDMMYYYY = (date) => {
  return moment(date).format("DD-MM-YYYY")
}


// const getCurrentDateDBFormat() {
//   return moment().format("YYYY-MM-DD")
// }

// const getCurrentDate() {
//   return moment().format("MM/DD/YYYY")
// }


// const getCurrentDateInYYYYMMDD() {
//   return moment().format("YYYY/MM/DD")
// }


// const getCurrentDateDDMMYYYY() {
//   return moment().format("DD-MM-YYYY")
// }

// const getTimeinDBFormat(date) {
//   return moment(date).format("HH:mm:ss")
// }

// const get12HourTime(date) {
//   return moment(date).format("hh:mm:A")
// }

// const getTime(date) {
//   return moment(date).format("HH:mm")
// }

// const setTime(time) {
//   let hour = time.split(':')[0];
//   let minute = time.split(':')[1];
//   return moment().set({'hour': hour, 'minute': minute})
// }

// const convertDateInUTC(date) {  
//   return moment.utc(date);  
// }

// const setDBDateFormat(date){
//   let day = date.split('-')[0];
//   let month = date.split('-')[1];
//   let year = date.split('-')[2];
//   return (year + '-' + month + '-' + day) ;
// }

// const isBirthDate(date){
//   const custDate = new Date(date);
//   const currDate = new Date();
//   return (custDate.getDate() === currDate.getDate() && custDate.getMonth() === currDate.getMonth());
// }


// const addOneDay(date){
//   return moment(date).add(1, 'days').format("YYYY-MM-DD");  
// }

// const subtractOneDay(date){
//   return moment(date).subtract(1, 'days').format("YYYY-MM-DD");  
// }

// const checkPastDate(date) {  
//   return moment(date).format("YYYY-MM-DD") > getDate();
// }

// const checkFutureDate(date) {
//   return moment(date).format("YYYY-MM-DD") < getDate();
// }

// const getDateWithFullMonthNDay = (date) => {
//   return moment(date).format("DD-MMMM-YYYY, dddd");
// }


module.exports = {
  getDate: getDate,
  getDateInDDMMYYYY:getDateInDDMMYYYY
}