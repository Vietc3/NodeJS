/**
 * Check branchId on headers 
 */

module.exports = function () {
  return async function (req, res, proceed) {
    if (req.header("branch-id")) {
      let branchId = parseInt(req.header("branch-id"));

      if (req.loggedInUser && req.loggedInUser.id) {
        let getUser = await User.findOne(req, { id: req.loggedInUser.id });

        if (!getUser) {
          return res.status(403).send({ message: sails.__("Tài khoản không tồn tại") })
        }

        let branch = JSON.parse(getUser.branchId);

        let foundBranch = await Branch.findOne(req, { id: branchId, deletedAt: 0, status: sails.config.constant.BRANCH_STATUS.FINISHED });
        
        if (!foundBranch) {
          return res.status(403).send({ message: sails.__("Không có quyền thao tác ở chi nhánh này") })
        }
        return proceed()
      }
      else return res.status(403).send({ message: sails.__("Tài khoản không tồn tại") })
    }
    return res.status(403).send({ message: sails.__("Chưa chọn chi nhánh") });
  }
}