module.exports = {
  description: 'return some unique intercept message',

  inputs: {
    errorName: {
      type: "string",
      required: true
    }
  },
  
  sync: true,

  fn: function (inputs, exits) {
    let {errorName} = inputs;
    
    if(errorName === 'UsageError') {
      return exits.success({status: false, message: sails.__("Thông tin không hợp lệ")});
    }
    return exits.success({status: false, message: sails.__("error")});
  }

}