const nodemailer = require('nodemailer');

module.exports = {
  description: 'update Send email',

  inputs: {
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let {
      from,
      to,
      subject,
      html,
      text,
      attachments
    } = inputs.data;

    let transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    let fail = [];
    if(_.isJson(to)){
      to = JSON.parse(to);
      await Promise.all(_.map(to, item => {
        transport.sendMail({
          from,
          to: item,
          subject,
          html,
          text,
          attachments
        }, function (error, info) {
          if (error) {
            fail.push(error);
          }
        });
        return;
      }))
    }
    else {
      await transport.sendMail({
        from,
        to,
        subject,
        html,
        text,
        attachments
      }, function (error, info) {
        if (error) {
          fail.push(error);
        }
      });
    }

    if(fail.length)
      return exits.success({ status: false, data: fail });
    else
      return exits.success({ status: true });
  }
}