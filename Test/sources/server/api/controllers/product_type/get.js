module.exports = {
  friendlyName: "Get one data Product Type",

  description: "Get one data Product Type.",

  exits: {
    success: {
      description: "Get one data Product Type successfully."
    }
  },

  fn: async function() {
    var onedataProductType = await ProductType.find(this.req, {
      where: { id: this.req.params.id }
    }).intercept({ name: "UsageError" }, () => {
      this.res.status(400).json({
        status: false,
        error: sails.__("Nhóm sản phẩm không tồn tại trong hệ thống")
      });
      return;
    });

    if (!onedataProductType) {
      this.res.status(400).json({
        status: false,
        error: sails.__("Nhóm sản phẩm không tồn tại trong hệ thống")
      });
      return;
    }

    this.res.json({
      status: true,
      data: onedataProductType
    });
  }
};
