module.exports = {
  description: "Convert default filter sailjs to sql query string",

  inputs: {
    data: {
      type: 'json',
      required: true
    },
  },
  
  sync: true,

  fn: function (inputs) {
    let {
      filter,
      model,
      populates,
      customPopulates,
      select,
      customSelect,
      limit, 
      skip,
      sort,
      groupBy,
      selectArrayId,
      customFilterField,
      count
    } = inputs.data;
    customFilterField = customFilterField || {};
    
    let selectQueryStr = "select ";
    let conditionQueryStr = "";
    let countQueryStr = "";
    let tempColName = {};

    if(select){
      select.map(item => {
        item = item.trim().replace(/\s\s+/g, ' ');
        if(item.includes(' as ')) {
          let arrSplit = item.split(' ');
          selectQueryStr += item + ', ';
          tempColName[arrSplit[arrSplit.length - 1]] = arrSplit[arrSplit.length - 1];
        }
        else {
          selectQueryStr += (item.includes('.') ? '' : 'm.') + item + (item.includes('.') ? (' as ' + item.replace(/\./g, '_')) : '') + ', ';
          tempColName[item.replace(/\./g, '_')] = item.replace(/\./g, '_');
        }
      })
    } else selectQueryStr += 'm' + (populates ? ('.*, ' + populates.join('.*, ')) : '') + '.*, '
    
    if(customSelect) {
      selectQueryStr += customSelect + ', '
    }
    
    
    selectQueryStr = selectQueryStr.slice(0, -2);
    countQueryStr = selectQueryStr;
    countQueryStr += ', count(*) as count';
    
    let modelName = Object.keys(model.waterline.collections).find(item => typeof model.waterline.collections[item] === 'string');
    conditionQueryStr += ' from ' + modelName + ' m ';
    
    if(populates) {
      populates.map(field => {
        let foundTableName = model.associations.find(item => item.alias === field && item.type === 'model').model
        conditionQueryStr += 'left join ' + foundTableName + ' ' + field + ' on ' + field + '.id = m.' + field + ' '
      })
    } 
    
    if(customPopulates) {
      conditionQueryStr += customPopulates + ' '
    } 
    
    conditionQueryStr += 'where '

    for (let key in filter) {
      if (key == "or") {
        conditionQueryStr += '(';
        for (let subKey in filter[key]) {
          conditionQueryStr += '(';
          for(field in filter[key][subKey]) {
            if(customFilterField[field]){
              conditionQueryStr += '(';
              for(let _field of customFilterField[field]){
                conditionQueryStr += filterBy( _field, filter[key][subKey][field] ) + ' and ';
              }
              conditionQueryStr = conditionQueryStr.slice(0, -5) + ')';
            } else conditionQueryStr += filterBy( field, filter[key][subKey][field] ) + ' and ';
          }
          
          conditionQueryStr = conditionQueryStr.slice(0, -5) + ') or ';
        }
        
        conditionQueryStr = conditionQueryStr.slice(0, -4) + ') and ';
      } else {
        if(customFilterField[key]){
          conditionQueryStr += '(';
          for(let _field of customFilterField[key]){
            conditionQueryStr += filterBy( _field, filter[key] ) + ' or ';
          }
          conditionQueryStr = conditionQueryStr.slice(0, -4) + ') and ';
        } else {
          let filterStr = filterBy(key, filter[key]);          
          if(filterStr.length) conditionQueryStr += '(' + filterStr + ') and ';
        }
      }
    }
    
    let sortStr = '';
    if(sort){
      if(typeof sort === 'string') {
        let arrSort = sort.trim().replace(/\s+/g,' ').split(" ");
        if(arrSort.length === 2) sort = [{[arrSort[0]]: arrSort[1]}];
      }
      
      sortStr += ' order by '
      sort.map(item => {
        let key = Object.keys(item)[0];        
        let value = item[key];
        sortStr += (tempColName[key] ? '' : ((key.replace(/\_/g, '.').includes('.') || customFilterField[key]) ? '' : 'm.')) + key + ' ' + value + ', '
      })
      sortStr = sortStr.slice(0, -2);
    }

    let groupStr = '';
    if(groupBy){
      groupStr += ' group by '
      let key = groupBy ;
      groupStr += (tempColName[key] ? '' : ((key.replace(/\_/g, '.').includes('.') ||customFilterField[key]) ? '' : 'm.')) + key + ', '
      groupStr = groupStr.slice(0, -2);
    }

    let listIdStr = '';
    if (selectArrayId) {
        let filterStr = filterBy(key, filter[key]); 

        selectArrayId.map((item) => {
          let nameCol = Object.keys(item);
          let arrId = item[nameCol];
          if (arrId.length){
            listIdStr += ( filterStr.length ? ` and` : '' ) + ` (`+ nameCol[0] + ` in (${arrId.join(',')}))`
          }
        })
    }
    
    conditionQueryStr = conditionQueryStr.slice(0, -5) + listIdStr + groupStr + sortStr;
    
    return {
      query: selectQueryStr + conditionQueryStr + (limit !== undefined ? (' limit ' + limit) : '') + (skip !== undefined ? (' offset ' + skip) : ''),
      countQuery: countQueryStr + conditionQueryStr
    };
  }
};

function filterBy(field, condition) {
  let str = '';
  field = field.replace(/\_/g, '.');
  let isPopulated = field.includes('.');
  if (typeof condition == "object") {
    for(let key in condition) {
      let value = condition[key];
      switch(key) {
        case "<":
          str += `${isPopulated ? '' : 'm.'}${field} < ${value}`;
          break;
        case "<=":
          str += `${isPopulated ? '' : 'm.'}${field} <= ${value}`;
          break;
        case ">":
          str += `${isPopulated ? '' : 'm.'}${field} > ${value}`;
          break;
        case ">=":
          str += `${isPopulated ? '' : 'm.'}${field} >= ${value}`;
          break;
        case "!=":
          if(value === null || value === 'null') str += `${isPopulated ? '' : 'm.'}${field} is not null`
          else str += `${isPopulated ? '' : 'm.'}${field} <> ${value}`
          break;
        case "in":
          str += `${isPopulated ? '' : 'm.'}${field} in ('${value.join("','")}')`;
          break;
        case "nin":
          str += `${isPopulated ? '' : 'm.'}${field} not in ('${value.join("','")}')`;
          break;
        case "contains":
          str += `lower(${isPopulated ? '' : 'm.'}${field}) like '%${value.toLowerCase()}%'`;
          break;
        case "and": {
          str += '(';

          for ( let i in value ) {
            str += filterBy( field, value[i] ) + ' and ';
          }
          
          str += str.slice(0, -5) + ') and '
        }
        default:
          str += '';
      }
      
      str += ' and '
    }
    str = str.slice(0, -5);
  } else {
    if(condition === null || condition === 'null') {
      str = `${isPopulated ? '' : 'm.'}${field} is null`;
    } else str = `${isPopulated ? '' : 'm.'}${field} = '${condition}'`;
  }
    
  return str
}
  