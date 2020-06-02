module.exports = {
  friendlyName: 'Manual filter',

  description: 'Manual filter',

  inputs: {
    data: {
      type: "ref"
    },
    filter: {
      type: "ref"
    }
  },

  sync: true,

  fn: function (inputs, exits) {
    let { data, filter } = inputs;
    let isValid = true;

    for (let key in filter) {
      if (key == "or") {
        let check = false;
        for (let subKey in filter[key]) {
          let field = Object.keys(filter[key][subKey])[0];
          let condition = filter[key][subKey][field];
          let manualFilterBy = sails.helpers.manualFilterBy( data, field, condition );
          check = check || manualFilterBy;
        }
        isValid = isValid && check;
      } else {
        let manualFilterBy = sails.helpers.manualFilterBy(data, key, filter[key]);
        isValid = isValid && manualFilterBy;
      }
    }

    return exits.success(isValid);
  }

}