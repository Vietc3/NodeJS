function FormatNumber(num) {
  num = num || 0;
  num = num.toString();
  while (num.indexOf(",") > -1) num = num.replace(",", "");
  num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num;
}

function Image2Base64(url, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    var fileReader = new FileReader();
    fileReader.onloadend = function() {
      callback(fileReader.result);
    };
    fileReader.readAsDataURL(httpRequest.response);
  };
  httpRequest.open("GET", url);
  httpRequest.responseType = "blob";
  httpRequest.send();
}

function UndoFormatNumber(num) {
  num = num || "";
  num = num.toString();

  return num.split(",").join("");
  // return num;
}

export default {
  FormatNumber,
  UndoFormatNumber,
  Image2Base64
};
