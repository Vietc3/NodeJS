module.exports = {
    friendlyName: "Get one data Debt Card",
  
    description: "Get one data Debt Card.",
  
    exits: {
      success: {
        description: "Get one data Debt Card successfully."
      }
    },
  
    fn: async function() {
      var onedataDebtCard = await Debt.find(this.req, {
        where: { id: this.req.params.id }
      }).populate("customerId")
      .intercept({ name: "UsageError" }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__("Công nợ không tồn tại trong hệ thống")
        });
        return;
      });
  
      if (!onedataDebtCard) {
        this.res.status(400).json({
          status: false,
          error: sails.__("Công nợ không tồn tại trong hệ thống")
        });
        return;
      }

      let getUser = await User.find(this.req, {
        select: ["id", "fullName"]
      })

      if ( getUser ) {
        _.forEach(onedataDebtCard, item => {
          _.forEach(getUser, elem => {
            if ( item.createdBy === elem.id ) {
              item.createdBy = {...elem}
            }
          })
        })
      }
  
      this.res.json({
        status: true,
        data: onedataDebtCard
      });
    }
  };
  