module.exports =  function checkError(error) {
  if(error || error.response.status === 401) {
    console.log('checkError', error);
  }
}