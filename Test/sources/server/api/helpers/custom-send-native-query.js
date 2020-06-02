module.exports = {
  description: "Convert default filter sailjs to sql query string",

  inputs: {
    req: {
      type: "ref"
    },
    options: {
      type: 'json',
      required: true
    },
  },

  fn: async function (inputs) {
    let { options } = inputs;
    let req = inputs.req;
    let count = 0;
    
    let {query, countQuery} = sails.helpers.convertSailsFilterToQuery(options);
    let foundData = await sails.sendNativeQuery(req, query);
    foundData = foundData.rows;
    foundData.map(item => {
      for(let key in item) {
        if(key.includes('_')) {
          let value = {...item}[key];
          _.set(item, key.replace(/\_/g, '.'), value);
        }
      }
      return item;
    })
    
    if(options.count) {
      count = await sails.sendNativeQuery(req, countQuery);
      count = count.rows.length ? count.rows[0].count : 0;
    }
    
    return {foundData, count};
  }
};
  