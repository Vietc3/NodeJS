module.exports = {
    friendlyName: "Get Cash Book",
  
    description: "Get a cash book",
  
    fn: async function() {
      var onedataCashBook = await CashBook.find({
        where: { id: this.req.params.id }
      }).intercept({ name: "UsageError" }, () => {
        this.res.json({
          status: false,
          error: sails.__("Sổ quỹ không tồn tại trong hệ thống")
        });
        return;
      });
  
      if (!onedataCashBook) {
        this.res.json({
          status: false,
          error: sails.__("Sổ quỹ không tồn tại trong hệ thống")
        });
        return;
      }
  
      this.res.json({
        status: true,
        data: onedataCashBook
      });
    }
  };
  