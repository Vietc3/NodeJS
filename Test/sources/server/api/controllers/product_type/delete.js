module.exports = {
  friendlyName: "Delete Product Type",

  description: "Delete Product Type.",

  fn: async function() {
    var deleteProductType = await ProductType.update(this.req, { id: this.req.params.id })
      .set({ deletedAt: new Date().getTime(), updatedBy: this.req.loggedInUser.id })
      .intercept({ name: "UsageError" }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__("Nhóm sản phẩm không tồn tại trong hệ thống")
        });
        return;
      }).fetch();
      
    this.res.json({
      status: true,
      data: deleteProductType[0]
    });
  }
};
