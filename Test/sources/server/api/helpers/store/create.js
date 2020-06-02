var DBMigrate = require(`db-migrate`);
const Datasource = require('mutilTenant/datasource');
const fs = require('fs');

let blockedList = JSON.parse(fs.readFileSync('blocked-url.json')).url;

module.exports = {
  description: 'create new store',

  inputs: {
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let {
      fullName,
      mobile,
      email,
      storeName,
      address,
      isCreatedDataTemplate,
      field,
      recaptchaToken,
      databaseName,
      password
    } = inputs.data;

    let result = null;
    // chuẩn bị data
    let { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, MULTI_TENANT } = process.env;
    let url = new URL(address);
    let dbName = databaseName + '_' + new Date().getTime();
    email = email && email.toLowerCase()
    // Kiểm tra tính năng multi-tenants đã được enable chưa
    if(MULTI_TENANT !== 'Y') {
      return exits.success({
        status: false,
        message: sails.__('Tính năng tạo cửa hàng mới chưa bật.')
      })
    }
    
    // Kiểm tra tên database có hợp lệ không
    let patt = new RegExp("^[a-zA-Z][a-zA-Z0-9_-]{5,32}$");
    let res = patt.test(dbName);

    if(!res) {
      return exits.success({
        status: false,
        message: sails.__('Tên cửa hàng không hợp lệ')
      })
    }
    
    // Kiểm tra địa chỉ cửa hàng có hợp lệ không
    if(blockedList.includes(url.hostname)) {
      return exits.success({
        status: false,
        message: sails.__('Không thể sử dụng địa chỉ cửa hàng này')
      });
    }
    
    // Kiểm tra địa chỉ cửa hàng đã tồn tại chưa
    let foundDatabaseName = await Tenants.find({identity: url.hostname});
    if(foundDatabaseName.length) {
      return exits.success({
        status: false,
        message: sails.__('Địa chỉ cửa hàng đã tồn tại')
      });
    }
    
    // Kiểm tra địa chỉ email đã được sử dụng chưa
    if((await Tenants.find({email})).length) {
      return exits.success({
        status: false,
        message: sails.__('Địa chỉ email đã được sử dụng')
      });
    }
    
    // Kiểm tra số đt đã được sử dụng chưa
    if(!_.isPhoneNumber(mobile)) {
      return exits.success({
        status: false,
        message: sails.__('Số điện thoại không hợp lệ')
      });
    }
    
    if((await Tenants.find({phoneNumber: mobile})).length) {
      return exits.success({
        status: false,
        message: sails.__('Số điện thoại đã được sử dụng')
      });
    }
    
    //tạo record trong bảng tenants
    let datasource = {
      host: DB_HOST,
      port: DB_PORT,
      schema: 1,
      adapter: 'sails-mysql',
      user: DB_USER,
      password: DB_PASSWORD,
      database: dbName,
      identity: url.hostname,
    };
    let newStore = await Tenants.create({
      ...datasource, 
      "email": email,
      "phoneNumber": mobile
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({
        status: false,
        message: sails.__('Thông tin yêu cầu không hợp lệ')
      });
    }).fetch();
    
    // Tạo database
    let createdDatabase = await sails.sendNativeQuery("CREATE DATABASE IF NOT EXISTS `" + dbName + "`");
    
    // chạy db-migrate up
    let newDbMigrate = DBMigrate.getInstance(true, {
      config: {
        dev: {
          "host": DB_HOST,
          "user": DB_USER,
          "password" : DB_PASSWORD,
          "database": dbName,
          "driver": "mysql",
          "multipleStatements": true
        }
      }
    });
    await newDbMigrate.up();
    // data-seeding
    if(isCreatedDataTemplate && field) {
      try{
        let dataSeeding = await sails.helpers.database.seeding(newStore.identity, field);
        if(!dataSeeding.status) {
          result = result || dataSeeding;
        }
      }
      catch(err){
        result = err;
      }
      
    }
    // Lưu thông tin cửa hàng
    let storeInfo = {
      "expirydate": _.moment().add(10, 'days').format('x'),
      "name": storeName,
      "email": email,
      "address": "",
      "tel": mobile,
      "language": "vn",
      "accessaddress": address
    }
    let newDatasource = new Datasource(datasource);
    let updatedStoreConfig = await sails.helpers.storeConfig.update(newDatasource, {
      store_info: JSON.stringify(storeInfo)
    }, false)
    
    if(!updatedStoreConfig.status) {
      result = result || updatedStoreConfig;
    }
    
    // cập nhật thông tin branch "chi nhánh mặc định"
    let updatedBranchInfo = await sails.helpers.branch.update(newDatasource, {
      id: sails.config.constant.BRANCH_DEFAULT,
      email,
      name: sails.config.constant.BRANCH_NAME_DEFAULT,
      address: "",
      phoneNumber: mobile,
    })
    
    if(!updatedBranchInfo.status) {
      result = result || updatedBranchInfo;
    }
    
    // Tạo user
    let createdUser = await User.update(newDatasource, {email: 'admin@ohstore.vn'}).set({
      email,
      password: await sails.helpers.passwords.hashPassword(password),
      fullName,
      phoneNumber: mobile
    });
    
    if (result) {
      await Tenants.destroy({ id: newStore.id })
      await newDbMigrate.dropDatabase(dbName)
        return exits.success(result)
    } else {
    //Gửi email
        let content = sails.config.createStoreMailContent(fullName, email, url);

        let sendMail = await sails.helpers.common.sendMail({ from: process.env.SUPPORT_EMAIL, to: email, subject: content.subject, html: content.html })
        if(!sendMail.status) {
          return exits.success({
            status: false,
            message: sails.__('Gửi email thất bại.'),
            data: sendMail.data
          })
        }

        // Gửi email cho bộ phận SALE
        let contentSale = sails.config.createStoreMailContentReceive({
          fullName,
          mobile,
          email,
          storeName,
          address,
          isCreatedDataTemplate,
          field,
        });

        let sendMailSale = await sails.helpers.common.sendMail({ from: process.env.SUPPORT_EMAIL, to: process.env.REGISTRATION_RECEIVE, subject: contentSale.subject, html: contentSale.html })
        if(!sendMailSale.status) {
          return exits.success({
            status: false,
            message: sails.__('Gửi email về CSKH thất bại.'),
            data: sendMailSale.data
          })
        }
    }

    return exits.success({
      status: true,
      data: ''
    });
  }

}