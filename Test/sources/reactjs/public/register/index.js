

//load capcha
  var captchaContainer = null;
  var capcha = '';
  var loadCaptcha = function() {
    captchaContainer = grecaptcha.render('captcha_container', {
      'sitekey' : appConfig.CAPCHA_SITE_KEY,
      'callback' : function(response) {
        capcha = response;
      }
    });
  };

  window.onload = function()
  {
    document.getElementById('loading').style.display = "none";
    document.getElementById('success').style.display = "none";
    document.getElementById('error_connect').style.display = "none";

    if(window.innerHeight > window.innerWidth){
      document.getElementById("bg-image").setAttribute('class', "bg-image-small");
    }
  };

  var fullName = '';
  var password = '';
  var mobile = '';
  var email = '';
  var storeName = '';
  var isCreatedDataTemplate = '';
  var field = '';
  var databaseName = '';
  var address = '';

  function reload() {
    location.reload();
  }

function removeSign(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o"); //ò đầu tiên là ký tự đặc biệt
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}

function parseURLParams() {
  var url = window.location.href;
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {}, i, n, v, nv;

  if (query === url || query === "") return;

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=", 2);
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);
    parms[n] = (nv.length === 2 ? v : null);
  }
  return parms;
}

function validateEmail(inputText)
  {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
    if (inputText.match(mailformat)) {
      return true;
    }
    else {
      return false;
    }
  }

  function validateMobile(inputText)
  {
    var phoneno = /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;
    inputText = inputText.toString().trim().replace(/[.()]| |-/g, '').replace('+84', '0');
    if(inputText.match(phoneno) && inputText.length >= 10)
    {
      return inputText;
    } else {
      return false;
    }
  }

  function validateForm() {
    fullName = document.getElementById('fullName').value;
    password = document.getElementById('password').value;
    mobile = document.getElementById('mobile').value;
    email = document.getElementById('email').value;
    storeName = document.getElementById('storeName').value;
    isCreatedDataTemplate = document.getElementById('isCreatedDataTemplate').checked;
    field = document.getElementById('field').value;

    if (fullName == "") {
      alert('Vui lòng nhập Họ và tên');
      return false;
    }
    else if (!validateMobile(mobile)) {
      alert('Vui lòng nhập Số điện thoại đúng định dạng');
      return false;
    }
    else if (!validateEmail(email)) {
      alert('Vui lòng nhập Email đúng định dạng');
      return false;
    }
    else if (password.length < 6) {
      alert('Vui lòng nhập Mật khẩu có độ dài hơn 6 ký tự');
      return false;
    }
    else if (storeName == "") {
      alert('Vui lòng nhập Tên cửa hàng');
      return false;
    }
    else if(isCreatedDataTemplate && field == ''){
      alert('Vui lòng nhập Ngành nghề kinh doanh');
      return false;
    }
    else if (capcha == "") {
      alert('Vui lòng chọn Tôi không phải là người máy');
      return false;
    }
    else {
      mobile = validateMobile(mobile);
      let data = 'fullName='+fullName+'&password='+password+'&mobile='+mobile+'&email='+email+'&storeName='+storeName+'&isCreatedDataTemplate='+isCreatedDataTemplate+'&field='+field+'&databaseName='+databaseName+'&address='+address;
      createStore(data);
      document.getElementById('form').style.display = "none";
      document.getElementById('loading').style.display = "block";
    }
  }

  function setAddress() {
    var storeName = document.getElementById('storeName').value;
    let name = ((removeSign(storeName)).replace(/\s/g, '')).toLowerCase();
    address = appConfig.LINK_STORE.replace("xxx", name);
    document.getElementById('address').value = address;
    databaseName = name;
  }

  function createStore(data) {
    $.ajax({
      headers: {          
        "Accept-Language": "vn"  
      },
      type: "POST",
      url: appConfig.URL_API,
      data: data,
      success: function(result){
        if (result.status) {
          document.getElementById("text-address").innerHTML = address;
          document.getElementById("text-email").innerHTML = email;
          document.getElementById("text-address").setAttribute('href', address);
          document.getElementById("bt-start").setAttribute('href', address);

          document.getElementById('loading').style.display = "none";
          document.getElementById('form').style.display = "block";
          document.getElementById('success').style.display = "block";
          document.getElementById('register').style.display = "none";
          document.getElementById('error_connect').style.display = "none";
        }

        else {
          document.getElementById("text-error").innerHTML = "Lỗi: " + (result.message || "Tạo dữ liệu mẫu thất bại");

          document.getElementById('loading').style.display = "none";
          document.getElementById('form').style.display = "block";
          document.getElementById('register').style.display = "block";
          document.getElementById('error_connect').style.display = "none";
          document.getElementById('success').style.display = "none";
        }
      },
      error: function() {
        document.getElementById('loading').style.display = "none";
        document.getElementById('form').style.display = "block";
        document.getElementById('register').style.display = "none";
        document.getElementById('success').style.display = "none";
        document.getElementById('error_connect').style.display = "block";
      }
    });
  }