module.exports = {
  friendlyName: 'Manual sort and filter',

  description: 'Manual sort and filter',

  inputs: {
    data: {
      type: "ref"
    },
    filter: {
      type: "ref"
    },
    sort: {
      type: "ref"
    },
  },

  sync: true,

  fn: function (inputs, exits) {
    let { data, filter, sort } = inputs;
    let _data = data.slice();
    if (filter && Object.keys(filter).length) {
      _data = _data.filter(item => sails.helpers.manualFilter(item, filter ));
    }

    if (sort && sort.sortOrder) {
      _data = _.orderBy(
        _data,
        [(obj) => {
          let arrSortField = sort.sortField.split('.');
          let value = obj;
          for(let key of arrSortField) {
            if(typeof value !== 'object' || value === null) break
            value = value[key];
          }
          
          return value;
        }],
        [sort.sortOrder.toLowerCase()]
      )
    }
  
    return exits.success(_data);
  }
}