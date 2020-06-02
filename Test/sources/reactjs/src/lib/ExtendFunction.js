import _ from "lodash";
import React from "react";
import moment from "moment";
import Constants from "variables/Constants/";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import  initFormatNumber  from "./FormatNumber.js"
import OhTrans from "components/Oh/OhTrans.jsx";
import store from "store/Store";

initFormatNumber();
function getOnlyNumber(strNum) {
  let regexp = /[-]{0,1}[\d]+/g;
  if (strNum === "-" || strNum === "" || !isNaN(parseInt(strNum))) {
    let filter = strNum === "-" ? strNum : strNum.match(regexp);
    if (filter !== null && typeof filter === "object") filter = filter.join("");
    return filter || "";
  }
  return null;
}

function FormatNumber(nStr){
  nStr = nStr === undefined ? "" : nStr;
  nStr = Math.round10(nStr,-5);
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
 
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
   x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
 }

function FormatNumberToInt(num) {
  return FormatNumber(Number(num).toFixed(0));
}

function Image2Base64(url, callback) {
  var httpRequest = new XMLHttpRequest();

  httpRequest.onload = function () {
    var fileReader = new FileReader();
    fileReader.onloadend = function () {
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
}

function getFullRef(data) {
  let {
    ref,
    orderByChild,
    childValue,
    orderByKey
  } = data;
  let fullRef = "";
  if (ref) fullRef = ref;
  if (orderByChild) fullRef += "/" + orderByChild;
  if (orderByKey) fullRef += "/orderByKey";
  if (childValue) fullRef += "/" + childValue;
  return fullRef;
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

function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

function unit8ArrayToBase64(unit8Array) {
  let binary = "";

  for (let i = 0; i < unit8Array.byteLength; i++) {
    binary += String.fromCharCode(unit8Array[i]);
  }

  return binary;
}

function getSellPrice(unitPrice, discount, discountType, isPromoted) {
  if (isPromoted === true) return 0;

  if (discountType === Constants.DISCOUNT_TYPES.id.VND) {
    return unitPrice - discount;
  } else if (discountType === Constants.DISCOUNT_TYPES.id.percent) {
    return unitPrice - unitPrice * discount / 100;
  }

  return unitPrice;
}

function filter(data, key, value) {
  if (typeof value === "object") {
    let _key = Object.keys(value)[0];
    let _value = value[_key];

    if (_key === "<") {
      return data[key] < _value;
    }
    if (_key === "<=") {
      return data[key] <= _value;
    }
    if (_key === ">") {
      return data[key] > _value;
    }
    if (_key === ">=") {
      return data[key] >= _value;
    }
    if (_key === "!=") {
      return data[key] !== _value;
    }
    if (_key === "in") {
      return _value.includes(data[key]);
    }
    if (_key === "nin") {
      return !_value.includes(data[key]);
    }
    if (_key === "contains") {
      return data[key].includes(_value);
    }
  } else {
    return data[key] === value;
  }
}

function filterBy(data, obj) {
  let isValid = true;
  for (let i in obj) {
    if (i === "or") {
      for (let j in obj[i]) {
        let key = Object.keys(obj[i][j])[0];
        let value = obj[i][j][key];
        isValid = isValid && filter(data, key, value);
      }
    } else {
      isValid = isValid && filter(data, i, obj[i]);
    }
  }

  return isValid;
}

function exportPrintTemplate(templateContent, data) {
  for (let i in data) {

    if (typeof data[i] === "object") {

      let findStart = templateContent.indexOf(`<!--<${i}>-->`);
      let findEnd = templateContent.indexOf(`<!--</${i}>-->`);
      let sliceStart = templateContent.slice(0, findStart);
      let sliceReplace = templateContent.slice(findStart + `<!--</${i}>-->`.length, findEnd);
      let sliceEnd = templateContent.slice(findEnd + `<!--</${i}>-->`.length, templateContent.length);
      let _html = "";

      _.forEach(data[i], item => {
        let sliceReplace_copy = sliceReplace.slice()

        for (let j in item) {
          sliceReplace_copy = sliceReplace_copy.replace(`{${j}}`, item[j])
        }

        _html += sliceReplace_copy
      })

      templateContent = sliceStart + _html + sliceEnd;

    } else {
      templateContent = templateContent.split(`{${i}}`).join(data[i])
    }

  }

  return templateContent;
}

function FormatDateTime(time) {
  return moment(time).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)
}

const exportToCSV = (csvData, fileName) => {
  let fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let fileExtension = '.xlsx';

  let ws = XLSX.utils.json_to_sheet(csvData);

  let range = XLSX.utils.decode_range(ws['!ref']);
  let fmt = '#,##0';
  let fmtDot = '#,##0.#####';
  for(let R = range.s.r; R <= range.e.r; ++R) {
    for(let C = range.s.c; C <= range.e.c; ++C) {
      let cell_address = {c:C, r:R};
      /* if an A1-style address is needed, encode the address */            
      let cell_ref = XLSX.utils.encode_cell(cell_address);
      if(!ws[cell_ref]) continue;
      if(ws[cell_ref].t !== 'n') continue;
      if(!isNaN(ws[cell_ref].v)) {
        let splitDot = ws[cell_ref] && ws[cell_ref].v.toString().split(".");

        if (splitDot.length >=2) {
          ws[cell_ref].z = fmtDot;
        }
        else ws[cell_ref].z = fmt;
      }
    }
  }

  let wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

  
  let excelBuffer = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array'
  });
  let data = new Blob([excelBuffer], {
    type: fileType
  });
  FileSaver.saveAs(data, fileName + fileExtension);
}

async function ImportExcelToJSON(data, fields) {
  var dataJSON = [];
  var object = [];
  var requires = [];
  var err = [];
  data.forEach((item, index) => {
    if (index === 0) {
      for (let i in item) {
        requires.push(item[i].includes("(*)") ? i : null );
        fields.find(row => {
          return (row.name === item[i] ? object.push(row.field) : null)
        });;
      }
    } else if (item.length > 0) {
      let rowData = {};
      for (let i in object) {

        if(requires[i] && item[i] === null && !err.includes(item)){
          if(!err.includes(data[0]))
          {
            err.push(data[0]);
          }
          err.push(item);
        }
        else {
          item[i] = UndoFormatNumber(item[i])
          rowData = {
            ...rowData,
            [object[i]]: item[i] ? item[i] : ""
          }
        }
      }

      dataJSON.push(rowData)
    }
  })

  if (object.length === fields.length && err.length === 0)
    return {status: true, data: JSON.stringify(dataJSON)}
  else return {status: false, err: err}
}

async function ImportExcelToArray(data, fields) {
  var dataJSON = [];
  var object = [];
  data.forEach((item, index) => {
    if (index === 0) {
      for (let i in item) {
        fields.find(row => {
          return (row.name === item[i] ? object.push(row.field) : null)
        });;
      }
    } else if (item.length > 0) {
      let rowData = {};
      for (let i in object) {
          item[i] = UndoFormatNumber(item[i])
          rowData = {
            ...rowData,
            [object[i]]: item[i] ? item[i] : ""
          }
      }

      dataJSON.push(rowData)
    }
  })

  return dataJSON
}

function importAll(r) {
  let obj = {};
  
  r.keys().map(item => {
    let arr = item.split('/');
    obj[arr[arr.length - 1].split('.')[0]] = r(item)
  });
  
  return obj;
}

JSON.isJson = function(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return typeof JSON.parse(str) === "object";
}

function trans(name, isString) {
  if(isString) {
    let language = store.getState().languageReducer.language;
    if (!name) return "";
    
    let isJson = JSON.isJson(name);
    let obj = {};
  
    if (isJson){
      obj = JSON.parse(name);
    } 

    return isJson ? (obj[language] || obj["vn"]) : name;
  } 
  return <OhTrans value= {name}/>
}

function languageName(name) {
  let language = Constants.NAME_FLAG;
  let obj = {};
  
  if (JSON.isJson(name)){
    obj = JSON.parse(name);
    
  } else {
      _.forEach(language, item => {
        obj[item.key] = name
      })
  }
  return  obj;
}

function getSelectStockList(stockList, isData, isId){
  let listStock = [];
  
  let value = typeof(isData) !== "object" ? "id" : "value";
  let title = typeof(isData) !== "object" ? "name" : "title";

  if (isData === true || isData && isData.length || isId === true ){        
    listStock = Object.values(stockList).map(item => ({[value]: Number(item.id), [title]: item.name}))
  } else {          
    listStock = Object.values(stockList).filter(item => item.deletedAt === 0).map(item => ({[value]: Number(item.id), [title]: item.name}))
  }

  return listStock;
}

export default {
  getOnlyNumber,
  FormatNumber,
  FormatNumberToInt,
  UndoFormatNumber,
  Image2Base64,
  removeSign,
  getFullRef,
  debounce,
  unit8ArrayToBase64,
  filterBy,
  exportPrintTemplate,
  FormatDateTime,
  getSellPrice,
  exportToCSV,
  ImportExcelToJSON,
  ImportExcelToArray,
  importAll,
  languageName,
  getSelectStockList
};
export {
  trans
}
