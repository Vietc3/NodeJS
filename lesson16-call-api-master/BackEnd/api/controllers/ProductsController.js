/**
 * ProductsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    create: function (req, res) {
        Products.create({ name: req.body.name, price: req.body.price, status: req.body.status}).exec(function (err, user) {
          if(err) return res.json({ err: err }, 500);
          else res.json(user);
        });}
};

