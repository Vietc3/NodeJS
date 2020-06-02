module.exports = {

  friendlyName: 'Get Print Template',

  description: 'Get type of print template',

  inputs: {
    data: {
      type: "json"
    },
    type: {
      type: "string"
    }
  },

  fn: async function (inputs) {
    let { data, type } = inputs;
    let htmlEditor = inputs;
    let branchId = this.req.headers['branch-id'];

    let configStore = await StoreConfig.find(this.req, { where: { type: { in: ["store_logo", `print_template_${type}`] } } })

    if (!configStore) {
      this.res.json({
        status: false,
        error: sails.__("Cửa hàng không có config")
      })
    }

    let branch = await sails.helpers.branch.get(this.req, {id: branchId})

    if (branch.status)
      data = {
        ...data,
        store_name: branch.data.name,
        store_address: branch.data.address || "",
        store_phone_number: branch.data.phoneNumber || "",
        store_email: branch.data.email || "",
        store_logo: ""
      }
    else {
      return branch;
    }
    
    let templateHTMLContent = "";
    
    for (let item of configStore) {

      if (item.type === "store_logo") {
        data = {
          ...data,
          store_logo: `<img style="height: 50px;" alt="Chưa có logo" src=${item.value} />`
        }
      }

      if (item.type === `print_template_${type}`) {
        let template = JSON.parse(item.value);

        templateHTMLContent = template[template.default] || "A4"
      }

    }

    let printContent = sails.helpers.replaceHtmlEditor(data, templateHTMLContent);

    this.res.json({
      status: true,
      data: printContent
    })
  }
};
