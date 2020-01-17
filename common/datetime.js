import moment from 'moment';

export function getDate(date) {
  return moment(date).format("YYYY-MM-DD");
}

export function getCurrentDateDBFormat() {
  return moment().format("YYYY-MM-DD")
}


export function getCurrentDate() {
  return moment().format("MM/DD/YYYY")
}


export function getCurrentDateInYYYYMMDD() {
  return moment().format("YYYY/MM/DD")
}

export function getDateInDDMMYYYY(date) {
  return moment(date).format("DD-MM-YYYY")
}

export function getCurrentDateDDMMYYYY() {
  return moment().format("DD-MM-YYYY")
}

export function getTimeinDBFormat(date) {
  return moment(date).format("HH:mm:ss")
}

export function get12HourTime(date) {
  return moment(date).format("hh:mm:A")
}

export function getTime(date) {
  return moment(date).format("HH:mm")
}

export function setTime(time) {
  let hour = time.split(':')[0];
  let minute = time.split(':')[1];
  return moment().set({'hour': hour, 'minute': minute})
}

export function convertDateInUTC(date) {  
  return moment.utc(date);  
}

export function setDBDateFormat(date){
  let day = date.split('-')[0];
  let month = date.split('-')[1];
  let year = date.split('-')[2];
  return (year + '-' + month + '-' + day) ;
}

export function isBirthDate(date){
  const custDate = new Date(date);
  const currDate = new Date();
  return (custDate.getDate() === currDate.getDate() && custDate.getMonth() === currDate.getMonth());
}


export function addOneDay(date){
  return moment(date).add(1, 'days').format("YYYY-MM-DD");  
}

export function subtractOneDay(date){
  return moment(date).subtract(1, 'days').format("YYYY-MM-DD");  
}

export function checkPastDate(date) {  
  return moment(date).format("YYYY-MM-DD") > getDate();
}

export function checkFutureDate(date) {
  return moment(date).format("YYYY-MM-DD") < getDate();
}

export function getDateWithFullMonthNDay(date) {
  return moment(date).format("DD-MMMM-YYYY, dddd");
}

