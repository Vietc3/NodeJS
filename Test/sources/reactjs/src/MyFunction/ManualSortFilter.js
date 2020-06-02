import _ from "lodash";
import ExtendFunction from "lib/ExtendFunction";

function ManualSortFilter(data, filter, sort) {
  let _data = data.slice();
  if (filter && Object.keys(filter).length) {
    _data = _data.filter(item => ManualFilter(item, filter ));
  }

  if (sort && sort.sortOrder) {
    _data = _.orderBy(
      _data,
      [(obj) => {
        let arrSortField = sort.sortField.split('.');
        let value = obj;
        for(let key of arrSortField) {
          if(typeof value !== 'object' || value === null) break
          value = value[key];
        }
        
        return value;
      }],
      [sort.sortOrder.toLowerCase()]
    )
  }

  return _data;
}

function ManualFilter(data, filter) {
  let isValid = true;

  for (let key in filter) {
    if (key == "or") {
      let check = false;
      for (let subKey in filter[key]) {
        let field = Object.keys(filter[key][subKey])[0];
        let condition = filter[key][subKey][field];
        let manualFilterBy = ManualFilterBy( data, field, condition );
        check = check || manualFilterBy;
      }
      isValid = isValid && check;
    } else {
      let manualFilterBy = ManualFilterBy(data, key, filter[key]);
      isValid = isValid && manualFilterBy;
    }
  }

  return isValid;
}

function ManualFilterBy(data, field, condition) {
  if (typeof condition == "object") {
    let arrKey = Object.keys(condition);
    if (arrKey.length > 1) {
      let isCheck = true;
      for(let item of arrKey) {
        let check = ManualFilterBy(data, field, { [item]: condition[item] });

        isCheck = isCheck && check;
      }

      return isCheck
    }
    let key = arrKey[0];
    let _value = condition[key];
    let arrFields = field.split(".");
    let temp = data;
    
    for(let item of arrFields) {
      if(typeof temp !== 'object' || temp === null) return false
      temp = temp[item];
    }
    
    switch(key) {
      case "<":
        return temp < _value;
      case "<=":
        return temp <= _value;
      case ">":
        return temp > _value;
      case ">=":
        return temp >= _value;
      case "!=":
        return temp != _value;
      case "in":
        return _value.includes(temp);
      case "nin":
        return !_value.includes(temp);
      case "contains":
        return _.deburr(temp.toLowerCase()).includes(_.deburr(_value.toLowerCase()));
      case "and": {
        let isValid = true;

        for ( let i in _value ) {
          let manualFilterBy = ManualFilterBy( data, field, _value[i] );
          isValid = isValid && manualFilterBy
        }
        return isValid
      }
      default:
        return true;
    }
  
  } else {
    let arrFields = field.split(".");
    let temp = data;
    
    for(let item of arrFields) {
      temp = temp[item];
    }

    return temp == condition;
  }
}

function sortArrayObject(data, field, type) {
  switch(type){
    case "asc":
      return data.sort((a, b) => {
        if (typeof a[field] === "number") {
          return a[field] - b[field]
        } else if (typeof a[field] === "string") {
          let x = ExtendFunction.removeSign(a[field]).toLowerCase();
          let y = ExtendFunction.removeSign(b[field]).toLowerCase();
          if (x < y) return -1;
          if (x > y) return 1;
          return 0;
        }
      })
    case "desc":
      return data.sort((a, b) => {
        if (typeof a[field] === "number") {
          return b[field] - a[field]
        } else if (typeof a[field] === "string") {
          let x = ExtendFunction.removeSign(a[field]).toLowerCase();
          let y = ExtendFunction.removeSign(b[field]).toLowerCase();
          if (x > y) return -1;
          if (x < y) return 1;
          return 0;
        }
      })
  }
}

export default {
  ManualSortFilter,
  sortArrayObject
}