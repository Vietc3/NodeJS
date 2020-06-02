/* Replace with your SQL commands */
UPDATE `storeconfig`
SET `value` = '{\"A4\":\"<div style=\\\"margin:20px\\\">\\n    <div style=\\\"width: 100%\\\">\\n    <h1 style=\\\"font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;font-weight: 600\\\">PHIẾU HOÀN TRẢ NHÀ CUNG CẤP</h1>\\n    \\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px\\\">Mã phiếu: {refund_code}</div>\\n    \\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-size:13px\\\">Ngày tạo: {created_on}</div>\\n    </div>\\n    \\n    <table border=\\\"0\\\" cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;\\\">\\n        <tbody>\\n            <tr>\\n                <td>Địa chỉ chi nhánh: {location_address}</td>\\n            </tr>\\n            <tr>\\n                <td>Người tạo: {account_name}</td>\\n            </tr>\\n            <tr>\\n                <td>Nhà cung cấp: {supplier_name}</td>\\n            </tr>\\n            <tr>\\n                <td>Số điện thoại: {supplier_phone_number}</td>\\n            </tr>\\n            <tr>\\n                <td>&nbsp;</td>\\n            </tr>\\n        </tbody>\\n    </table>\\n    \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\\\">\\n        <tbody>\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 12px;font-weight: 600\\\">\\n                <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;\\\"><span>STT </span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Mã SKU </span></td>\\n                <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Tên sản phẩm </span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Số lượng </span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Giá nhập </span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Chiết khấu</span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Thành tiền </span></td>\\n            </tr>\\n            <!--<products>-->\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 12px\\\">\\n                <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;\\\"><span>{line_stt}</span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_variant_sku}</span></td>\\n                <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_variant_name}</span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_quantity}</span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_price}</span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_discount_amount}</span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_amount}</span></td>\\n            </tr>\\n            <!--</products>-->\\n        </tbody>\\n    </table>\\n    \\n    <table style=\\\"width:100%\\\">\\n        <tbody>\\n            <tr>\\n                <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n                <td style=\\\"text-align: right;\\\">&nbsp;</td>\\n            </tr>\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">Giá trị hàng trả<span style=\\\"float: right;font-weight: 400;\\\">{total_amount}</span></td>\\n            </tr>\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">Chiết khấu<span style=\\\"float: right;font-weight: 400;\\\">{order_discount_value}</span></td>\\n            </tr>\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">Tổng giá trị hàng trả<span style=\\\"float: right;font-weight: 400;\\\">{total_price}</span></td>\\n            </tr>\\n            <!--<products>-->\\n            <tr>\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">\\n                <div style=\\\"width:50%;float:left\\\">{transaction_refund_method_name}</div>\\n    \\n                <div style=\\\"width:50%;float:left;text-align:right\\\">{transaction_refund_method_amount}</div>\\n                </td>\\n            </tr>\\n            <!--</products>-->\\n        </tbody>\\n    </table>\\n    \\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người trả </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ kho </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Trưởng bộ phận </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n   \\n    </div>\\n\\n    </div>\\n    \\n    <footer style=\\\"page-break-after: always\\\">.</footer>\\n    \\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n    \",\"A5\":null,\"K57\":null,\"K80\":null,\"default\":\"A4\"}'
WHERE `type` = 'print_template_import_return';
UPDATE `storeconfig`
SET `value` = '{\"A4\":\"<div style=\\\"margin:20px\\\">\\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"border-bottom: 1px solid #ffff; width:100%\\\">\\n      <tbody style=\\\"width:100%\\\">\\n        <tr>\\n          <td style=\\\"width: 40%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 20%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 40%;\\\">&nbsp;</td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_name}</td>\\n          \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td style=\\\"padding-bottom: 10px;\\\"><span style=\\\"font-weight: 600\\\">{store_address}</span></td>\\n          \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td style=\\\"padding-bottom: 10px;\\\"><span style=\\\"font-weight: 600\\\">{store_phone_number}</span></td>\\n         \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td><span style=\\\"font-weight: 600;\\\">{store_email}</span></td>\\n          <td>&nbsp;</td>\\n          <td>&nbsp;</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n    \\n    <div style=\\\"width: 100%; padding-bottom:20px\\\">\\n    <h1 style=\\\"font-family:Helvetica,sans-serif;font-size:22px;text-align: center;padding-top: 10px;padding-bottom: 10px\\\">PHIẾU KIỂM KHO</h1>\\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px\\\">Mã phiếu: {code}</div>\\n    \\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-size:13px\\\">Ngày tạo: {created_on}</div>\\n    </div>\\n    \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\\\">\\n      <tbody>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 12px;font-weight: 600\\\">\\n          <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\\\"><span>STT </span></td>\\n          <td style=\\\"padding: 1%; width: 20%; text-align: center; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Mã sản phẩm </span></td>\\n          <td style=\\\"padding: 1%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Tên sản phẩm </span></td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\"><span>SL sau kiểm</span></td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">SL chênh lệch</td>\\n          <td style=\\\"padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">Lý do</td>\\n        </tr>\\n        <!--<stockCheckCardProducts>-->\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 12px\\\">\\n          <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\\\">{line_stt}</td>\\n          <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\">{line_variant_code}</td>\\n          <td style=\\\"padding: 1%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\">{line_variant_name}</td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_after_quantity}</td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_change_quantity}</td>\\n          <td style=\\\"padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_reason}</td>\\n        </tr>\\n        <!--</stockCheckCardProducts>-->\\n      </tbody>\\n    </table>\\n    \\n    <table style=\\\"width:100%\\\">\\n      <tbody>\\n        <tr>\\n          <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td style=\\\"width: 50%;padding:1%\\\">&nbsp;</td>\\n          <td style=\\\"border-bottom: 1px solid #7a7676; width:25%;padding: 5px;font-weight: 600;\\\">Tổng số lượng <span style=\\\"float: right;\\\">{total_quantity}</span></td>\\n        </tr>\\n      </tbody>\\n    </table>\\n\\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán trưởng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ kho </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Trưởng ban kiểm kê </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n   \\n    </div>\\n\\n    </div>\\n\\n    </div>\\n    <footer style=\\\"page-break-after: always\\\">.</footer>\\n    \\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n    \",\"A5\":\"<div style=\\\"margin:20px\\\">\\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"border-bottom: 1px solid #7a7676; width:100%\\\">\\n      <tbody style=\\\"width:100%\\\">\\n        <tr>\\n          <td style=\\\"width: 40%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 20%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 40%;\\\">&nbsp;</td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_name}</td>\\n         \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td style=\\\"padding-bottom: 10px;\\\"><span style=\\\"font-weight: 600\\\">{store_address}</span></td>\\n          \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td style=\\\"padding-bottom: 10px;\\\"><span style=\\\"font-weight: 600\\\">{store_phone_number}</span></td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td><span style=\\\"font-weight: 600;\\\">{store_email}</span></td>\\n          <td>&nbsp;</td>\\n          <td>&nbsp;</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n    \\n    <div style=\\\"width: 100%\\\">\\n    <h1 style=\\\"font-family:Helvetica,sans-serif;font-size:22px;text-align: center;padding-top: 10px;\\\">PHIẾU KIỂM KHO</h1>\\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px\\\">Mã phiếu: {code}</div>\\n    \\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-size:13px\\\">Ngày tạo: {created_on}</div>\\n    </div>   \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\\\">\\n      <tbody>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 10px;font-weight: 600\\\">\\n          <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\\\"><span>STT </span></td>\\n          <td style=\\\"padding: 1%; width: 20%; text-align: center; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Mã sản phẩm </span></td>\\n          <td style=\\\"padding: 1%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Tên sản phẩm </span></td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\"><span>SL sau kiểm</span></td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">SL chênh lệch</td>\\n          <td style=\\\"padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">Lý do</td>\\n        </tr>\\n        <!--<stockCheckCardProducts>-->\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 10px\\\">\\n          <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\\\">{line_stt}</td>\\n          <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\">{line_variant_code}</td>\\n          <td style=\\\"padding: 1%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\">{line_variant_name}</td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_after_quantity}</td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_change_quantity}</td>\\n          <td style=\\\"padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_reason}</td>\\n        </tr>\\n        <!--</stockCheckCardProducts>-->\\n      </tbody>\\n    </table>\\n    \\n    <table style=\\\"width:100%\\\">\\n      <tbody>\\n        <tr>\\n          <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td style=\\\"width: 50%;padding:1%\\\">&nbsp;</td>\\n          <td style=\\\"border-bottom: 1px solid #7a7676; width:50%;padding: 5px;font-weight: 600;\\\">Tổng số lượng <span style=\\\"float: right;\\\">{total_quantity}</span></td>\\n        </tr>\\n      </tbody>\\n    </table>\\n\\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán trưởng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ kho </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Trưởng ban kiểm kê </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    </div>\\n    </div>\\n\\n    </div>\\n    \\n    <footer style=\\\"page-break-after: always\\\">.</footer>\\n\\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n    \",\"K57\":null,\"K80\":null,\"default\":\"A4\"}'
WHERE `type` = 'print_template_stock_take';
UPDATE `storeconfig`
SET `value` = '{\"A4\":\"<div style=\\\"margin:20px\\\">\\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"border-bottom: 1px solid #ffff; width:100%\\\">\\n      <tbody style=\\\"width:100%\\\">\\n        <tr>\\n          <td style=\\\"width: 40%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 20%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 40%;\\\">&nbsp;</td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_name}</td>\\n          \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td style=\\\"padding-bottom: 10px;\\\"><span style=\\\"font-weight: 600\\\">{store_address}</span></td>\\n          \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td style=\\\"padding-bottom: 10px;\\\"><span style=\\\"font-weight: 600\\\">{store_phone_number}</span></td>\\n         \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td><span style=\\\"font-weight: 600;\\\">{store_email}</span></td>\\n          <td>&nbsp;</td>\\n          <td>&nbsp;</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n    \\n    <div style=\\\"width: 100%; padding-bottom:20px\\\">\\n    <h1 style=\\\"font-family:Helvetica,sans-serif;font-size:22px;text-align: center;padding-top: 10px;padding-bottom: 10px\\\">PHIẾU KIỂM KHO</h1>\\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px\\\">Mã phiếu: {code}</div>\\n    \\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-size:13px\\\">Ngày tạo: {created_on}</div>\\n    </div>\\n    \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\\\">\\n      <tbody>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 12px;font-weight: 600\\\">\\n          <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\\\"><span>STT </span></td>\\n          <td style=\\\"padding: 1%; width: 20%; text-align: center; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Mã sản phẩm </span></td>\\n          <td style=\\\"padding: 1%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Tên sản phẩm </span></td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\"><span>SL sau kiểm</span></td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">SL chênh lệch</td>\\n          <td style=\\\"padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">Lý do</td>\\n        </tr>\\n        <!--<stockCheckCardProducts>-->\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 12px\\\">\\n          <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\\\">{line_stt}</td>\\n          <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\">{line_variant_code}</td>\\n          <td style=\\\"padding: 1%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\">{line_variant_name}</td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_after_quantity}</td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_change_quantity}</td>\\n          <td style=\\\"padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_reason}</td>\\n        </tr>\\n        <!--</stockCheckCardProducts>-->\\n      </tbody>\\n    </table>\\n    \\n    <table style=\\\"width:100%\\\">\\n      <tbody>\\n        <tr>\\n          <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 13px;\\\">\\n          <td style=\\\"width: 50%;padding:1%\\\">&nbsp;</td>\\n          <td style=\\\"border-bottom: 1px solid #7a7676; width:25%;padding: 5px;font-weight: 600;\\\">Tổng số lượng <span style=\\\"float: right;\\\">{total_quantity}</span></td>\\n        </tr>\\n      </tbody>\\n    </table>\\n\\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán trưởng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ kho </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Trưởng ban kiểm kê </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n   \\n    </div>\\n\\n    </div>\\n\\n    </div>\\n    <footer style=\\\"page-break-after: always\\\">.</footer>\\n    \\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n    \",\"A5\":\"<div style=\\\"margin:20px\\\">\\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"border-bottom: 1px solid #7a7676; width:100%\\\">\\n      <tbody style=\\\"width:100%\\\">\\n        <tr>\\n          <td style=\\\"width: 40%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 20%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 40%;\\\">&nbsp;</td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_name}</td>\\n         \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td style=\\\"padding-bottom: 10px;\\\"><span style=\\\"font-weight: 600\\\">{store_address}</span></td>\\n          \\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td style=\\\"padding-bottom: 10px;\\\"><span style=\\\"font-weight: 600\\\">{store_phone_number}</span></td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td><span style=\\\"font-weight: 600;\\\">{store_email}</span></td>\\n          <td>&nbsp;</td>\\n          <td>&nbsp;</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n    \\n    <div style=\\\"width: 100%\\\">\\n    <h1 style=\\\"font-family:Helvetica,sans-serif;font-size:22px;text-align: center;padding-top: 10px;\\\">PHIẾU KIỂM KHO</h1>\\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px\\\">Mã phiếu: {code}</div>\\n    \\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-size:13px\\\">Ngày tạo: {created_on}</div>\\n    </div>   \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\\\">\\n      <tbody>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 10px;font-weight: 600\\\">\\n          <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\\\"><span>STT </span></td>\\n          <td style=\\\"padding: 1%; width: 20%; text-align: center; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Mã sản phẩm </span></td>\\n          <td style=\\\"padding: 1%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Tên sản phẩm </span></td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\"><span>SL sau kiểm</span></td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">SL chênh lệch</td>\\n          <td style=\\\"padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">Lý do</td>\\n        </tr>\\n        <!--<stockCheckCardProducts>-->\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 10px\\\">\\n          <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\\\">{line_stt}</td>\\n          <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\">{line_variant_code}</td>\\n          <td style=\\\"padding: 1%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\">{line_variant_name}</td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_after_quantity}</td>\\n          <td style=\\\"padding: 1%; width: 15%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_change_quantity}</td>\\n          <td style=\\\"padding: 1%; width: 10%; border-bottom: 1px solid rgb(122, 118, 118); border-right: 1px solid rgb(122, 118, 118); text-align: center;\\\">{line_reason}</td>\\n        </tr>\\n        <!--</stockCheckCardProducts>-->\\n      </tbody>\\n    </table>\\n    \\n    <table style=\\\"width:100%\\\">\\n      <tbody>\\n        <tr>\\n          <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n          <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n        </tr>\\n        <tr style=\\\"font-family:Helvetica,sans-serif;font-size: 11px;\\\">\\n          <td style=\\\"width: 50%;padding:1%\\\">&nbsp;</td>\\n          <td style=\\\"border-bottom: 1px solid #7a7676; width:50%;padding: 5px;font-weight: 600;\\\">Tổng số lượng <span style=\\\"float: right;\\\">{total_quantity}</span></td>\\n        </tr>\\n      </tbody>\\n    </table>\\n\\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán trưởng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ kho </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Trưởng ban kiểm kê </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    </div>\\n    </div>\\n\\n    </div>\\n    \\n    <footer style=\\\"page-break-after: always\\\">.</footer>\\n\\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n    \",\"K57\":null,\"K80\":null,\"default\":\"A4\"}'
WHERE `type` = 'print_template_stock_take_default';