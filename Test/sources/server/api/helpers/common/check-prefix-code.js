module.exports = {
  friendlyName: "Check Prefix Code",

  description: "Check exist of prefix code",

  inputs: {
    prefix: {
      type: 'string',
    },
    code: {
      type: 'string'
    },
  },
  
  sync: true,

  fn: function (inputs, exits) {
    let {
      prefix,
      code,
    } = inputs;

    var patt = new RegExp("\\b" + prefix.toLowerCase() + "\\d{1,}\\b");
    let checkPrefix = code.toLowerCase().match(patt);
    let status = checkPrefix && checkPrefix.index == 0;
    return exits.success({ 
      status: !status, 
      message: status ? require('util').format(sails.__(sails.config.constant.INTERCEPT.CANT_USE_SYSTEM_PREFIX), prefix) : ''
    });
  }
};
