module.exports = {
    description: 'create new a action log',
  
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
      let {
        userId,
        functionNumber,
        action,
        objectId,
        objectContentOld,
        objectContentNew,
        deviceInfo,
        branchId
      } = inputs.data;

      let { req } = inputs;
      
      if (objectContentOld && typeof objectContentOld !== "string") {
        objectContentOld = JSON.stringify(objectContentOld)
      }

      if (objectContentNew && typeof objectContentNew !== "string") {
        objectContentNew = JSON.stringify(objectContentNew)
      }

      if (deviceInfo && typeof deviceInfo !== "string") {
        deviceInfo = JSON.stringify(deviceInfo)
      }

      let createAction = await ActionLog.create(req, {
        userId,
        function: functionNumber,
        action,
        objectId,
        objectContentOld,
        objectContentNew,
        deviceInfo,
        branchId
      }).intercept({ name: "UsageError" }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();

      return exits.success({
        status: true,
        data: createAction
      });
    }
  
  }