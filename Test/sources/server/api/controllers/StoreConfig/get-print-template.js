module.exports = {

  friendlyName: 'Get Config',

  description: 'Get list of config',

  inputs: {
    namePrintTemplate: {
      type: "json"
    },
    printSize: {
      type: "json"
    },
  },

  fn: async function (inputs) {
    let { namePrintTemplate, printSize } = inputs;

    let configCheckCard = await StoreConfig.findOne(this.req, {
      where: { type: namePrintTemplate }
    })
      .intercept({ name: "UsageError" }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__("Thông tin yêu cầu không hợp lệ")
        });
        return;
      });
      
    

    configCheckCard.value = JSON.parse(configCheckCard.value)
    
    this.res.json({
      status: true,
      data: configCheckCard.value[printSize], configCheckCard
    });
  }
};