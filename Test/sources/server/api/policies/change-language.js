/**
 * Change language for current user
 */
 
module.exports = function(permissionName, type) {
  return async function (req, res, proceed) {
    
    sails.hooks.i18n.setLocale(req.getLocale());

    return proceed();
  }
}