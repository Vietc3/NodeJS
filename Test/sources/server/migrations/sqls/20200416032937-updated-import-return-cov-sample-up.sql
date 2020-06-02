 /* Replace with your SQL commands */
UPDATE `storeconfig`
SET `value` = '{\"A4\":\"<div style=\\\"margin:20px\\\">\\n    <div style=\\\"width: 100%\\\">\\n    <h1 style=\\\"font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;font-weight: 600\\\">PHIẾU HOÀN TRẢ NHÀ CUNG CẤP</h1>\\n    \\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-weight: 600;font-size:13px\\\">Mã phiếu: {refund_code}</div>\\n    \\n    <div style=\\\"font-family:Arial,sans-serif;text-align: center;font-size:13px\\\">Ngày tạo: {created_on}</div>\\n    </div>\\n    \\n    <table border=\\\"0\\\" cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;\\\">\\n        <tbody>\\n            <tr>\\n                <td>Địa chỉ chi nhánh: {location_address}</td>\\n            </tr>\\n            <tr>\\n                <td>Người tạo: {account_name}</td>\\n            </tr>\\n            <tr>\\n                <td>Nhà cung cấp: {supplier_name}</td>\\n            </tr>\\n            <tr>\\n                <td>Số điện thoại: {supplier_phone_number}</td>\\n            </tr>\\n            <tr>\\n                <td>&nbsp;</td>\\n            </tr>\\n        </tbody>\\n    </table>\\n    \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\\\">\\n        <tbody>\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 12px;font-weight: 600\\\">\\n                <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;\\\"><span>STT </span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Tên sản phẩm </span></td>\\n                <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Mã SKU </span></td>\\n      <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Đơn vị tính </span></td>\\n          <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Số lượng </span></td>\\n       </tr>\\n            <!--<products>-->\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 12px\\\">\\n                <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;\\\"><span>{line_stt}</span></td>\\n                <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_variant_name}</span></td>\\n                <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_variant_sku}</span></td>\\n           <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_unit}</span></td>\\n     <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_quantity}</span></td>\\n           </tr>\\n            <!--</products>-->\\n        </tbody>\\n    </table>\\n  <table border=\\\"0\\\" cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;\\\">\\n        <tbody>\\n            <tr>\\n                <td>Số chứng từ gốc kèm theo:</td>\\n            </tr>\\n      <tr>\\n                <td>&nbsp;</td>\\n            </tr>\\n        </tbody>\\n    </table>\\n        \\n    <table style=\\\"width:100%\\\">\\n        <tbody>\\n            <tr>\\n                <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n                <td style=\\\"text-align: right;\\\">&nbsp;</td>\\n            </tr>\\n    <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">Tổng số lượng<span style=\\\"float: right;font-weight: 400;\\\">{total_quantity}</span></td>\\n            </tr>\\n               <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">Giá trị hàng trả<span style=\\\"float: right;font-weight: 400;\\\">{total_amount}</span></td>\\n            </tr>\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">Chiết khấu<span style=\\\"float: right;font-weight: 400;\\\">{order_discount_value}</span></td>\\n            </tr>\\n            <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">Tổng giá trị hàng trả<span style=\\\"float: right;font-weight: 400;\\\">{total_price}</span></td>\\n            </tr>\\n            <!--<products>-->\\n            <tr>\\n                <td style=\\\"width: 50%;padding:3px\\\">&nbsp;</td>\\n                <td style=\\\"width:50%;padding: 3px;\\\">\\n                <div style=\\\"width:50%;float:left\\\">{transaction_refund_method_name}</div>\\n    \\n                <div style=\\\"width:50%;float:left;text-align:right\\\">{transaction_refund_method_amount}</div>\\n                </td>\\n            </tr>\\n            <!--</products>-->\\n        </tbody>\\n    </table>\\n    \\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người lập phiếu </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người nhận hàng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ kho </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n   \\n    </div>\\n\\n    </div>\\n    \\n    <footer style=\\\"page-break-after: always\\\">.</footer>\\n    \\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n    \",\"A5\":null,\"K57\":null,\"K80\":null,\"default\":\"A4\"}'
WHERE `type` = 'print_template_import_return';
