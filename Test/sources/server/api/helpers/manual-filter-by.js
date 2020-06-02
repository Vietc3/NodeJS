module.exports = {
  friendlyName: 'Manual filter by',

  description: 'Manual filter by',

  inputs: {
    data: {
      type: "ref"
    },
    field: {
      type: "string"
    },
    condition: {
      type: "ref"
    },
  },

  sync: true,

  fn: function (inputs, exits) {
    let { data, field, condition } = inputs;

    if (typeof condition == "object") {
      let key = Object.keys(condition)[0];
      let _value = condition[key];
      let arrFields = field.split(".");
      let temp = data;
      
      for(let item of arrFields) {
        if(typeof temp !== 'object' || temp === null) return exits.success(false)
        temp = temp[item];
      }
      
      switch(key) {
        case "<":
          return exits.success(temp < _value);
          break;
        case "<=":
          return exits.success(temp <= _value);
          break;
        case ">":
          return exits.success(temp > _value);
          break;
        case ">=":
          return exits.success(temp >= _value);
          break;
        case "!=":
          return exits.success(temp != _value);
          break;
        case "in":
          return exits.success(_value.includes(temp));
          break;
        case "nin":
          return exits.success(!_value.includes(temp));
          break;
        case "contains":
          return exits.success(_.deburr(temp.toLowerCase()).includes(_.deburr(_value.toLowerCase())));
          break;
        case "and": {
          let isValid = true;

          for ( let i in _value ) {
            let manualFilterBy = sails.helpers.manualFilterBy( data, field, _value[i] );
            isValid = isValid && manualFilterBy
          }
          return exits.success(isValid)
        }
        default:
          return exits.success(true);
      }
    
    } else {
      let arrFields = field.split(".");
      let temp = data;
      
      for(let item of arrFields) {
        temp = temp[item];
      }

      return exits.success(temp == condition);
    }
  }
}