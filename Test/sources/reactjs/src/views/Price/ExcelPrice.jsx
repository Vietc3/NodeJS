import {trans} from "lib/ExtendFunction";

function getTableExcel(data, t) {
    let dataExcel = [["#", t("Mã sản phẩm"), t("Tên sản phẩm"), t("Giá vốn"), t("Giá vốn nhập cuối"), t("Giá chung")]];
    let count = 0;
    for (let item of data) 
    {
        dataExcel.push(
        [
            ++ count,
            item.code,
            trans(item.name, true),
            item.costUnitPrice ? item.costUnitPrice : 0,
            item.lastImportPrice ? item.lastImportPrice : 0,
            item.saleUnitPrice ? item.saleUnitPrice : 0,
        ]);
    }
    return dataExcel;
}

export default {getTableExcel};