/**
 * Transaction Class
 */
var Transaction = (function () {

  /**
   * Return an data object of all inputs and textarea values
   * @private
   * @param {element} formElem
   */
  var getData = function (formElem) {
    var rst = {};
    var elem;

    for (var i = 0; i < formElem.length; i++) {
      elem = formElem[i];
      if (typeof elem.value !== 'undefined') {
        if (elem.type !== 'radio' || elem.checked) { // should have a handler map if want to support more type
          rst[elem.name] = elem.value;
        }        
      };
    }

    return rst;
  };

  /**
   * Return an url param string
   * @private
   * @param {object} obj 
   */
  var param = function (obj) {
    var rst = '';

    for (var p in obj) {
      rst += p + '=' + obj[p] + '&';
    }

    return rst.substring(0, rst.length - 1); // remove the last "&"
  };

  /**
   * @constructor
   * @param {element} formElem
   */
  function Transaction(formElem) {
    this._formElem = formElem;
    this.data = {};
  }

  /**
   * get all input values
   */
  Transaction.prototype.initData = function () {
    this.data = getData(this._formElem);
  };

  /**
   * validate email, amount, and purpose
   */
  Transaction.prototype.validate = function () {
    if (!this._formElem.email.checkValidity() || this._formElem.email.value === '') return false;
    if (!this._formElem.amount.checkValidity() || this._formElem.amount.value === '') return false;
    if (typeof this.data.purpose === 'undefined')  return false;
    return true;
  };

  /**
   * send a post request to server to save the information to database
   */
  Transaction.prototype.send = function (callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/save');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.onload = callback;
    xhr.send(param(this.data));
  };

  /**
   * reset the form
   */
  Transaction.prototype.reset = function () {
    this._formElem.reset();
  };

  return Transaction;
})();
