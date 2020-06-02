module.exports = {
  description: 'list action log',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select } = inputs.data;

    let { req } = inputs;

    let options = {
      select: select || [
        'id',
        'function',
        'action',
        'objectContentNew',
        'deviceInfo',
        'createdAt',
        "user.id as userId",
        "user.fullName as userName",
        "branch.id as branchId",
        "branch.name as branchName"
      ],
      model: ActionLog, 
      filter: {...filter, ...manualFilter},
      customPopulates: `left join user on user.id = m.userId left join branch on branch.id = m.branchId`,
      limit,
      skip,
      sort: sort || 'createdAt DESC',
      count: true
    };

    let {foundData, count} = await sails.helpers.customSendNativeQuery(req, options);

    foundData.map(item => {
      if (_.isJson(item.objectContentNew)) {
        let dataJSON = JSON.parse(item.objectContentNew);

        if(!dataJSON.length) {
          item.code = (dataJSON.code || dataJSON.fullName) || "";
          item.codeId = dataJSON.id;
        }

      }
      if (item.deviceInfo && _.isJson(item.deviceInfo)) {
        item.deviceInfo = JSON.parse(item.deviceInfo)["ip"] || ""
      }
    })

    return exits.success({ status: true, data: foundData, count});
  }

}