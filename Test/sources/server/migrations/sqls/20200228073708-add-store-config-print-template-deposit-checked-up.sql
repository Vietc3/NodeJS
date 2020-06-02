/* Replace with your SQL commands */
INSERT INTO `storeconfig` (`createdAt`,`updatedAt`,`type`,`value`,`createdBy`,`updatedBy`) VALUES (1582179133555,1582179133555,'print_template_deposit_checked','{\"A4\":\"<div style=\\\"margin:50px;font-family:Arial,sans-serif;font-size: 13px;\\\">\\n    <div style=\\\"width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;\\\">\\n    <div style=\\\"width: 50%;float:left;text-align: left;\\\">\\n    <div style=\\\"padding-bottom: 5px;font-weight: 600;\\\">{store_name}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_address}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_phone_number}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_email}</div>\\n    </div>\\n    \\n    <div style=\\\"width: 50%;float:right;text-align: right;\\\">\\n    <div style=\\\"padding-bottom: 5px;\\\">Số: <span style=\\\"font-weight: 600;\\\">{receipt_voucher_code}</span></div>\\n    \\n    <div style=\\\"padding-bottom: 5px;\\\">Ngày ghi nhận: <span style=\\\"font-weight: 600;\\\">{issued_on}</span></div>\\n    </div>\\n    </div>\\n    \\n    <div style=\\\"width: 100%;float: left;margin-bottom: 10px;\\\">\\n    <h2 style=\\\"font-weight: 600;text-align: center;\\\">PHIẾU THU</h2>\\n    </div>\\n    &nbsp;\\n    \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width:100%\\\">\\n        <tbody>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Họ tên người nộp</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {object_name}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Địa chỉ</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {object_address}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Số tiền</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {amount}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Bằng chữ</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {total_text}</td>\\n            </tr>\\n            <tr>\\n            <td style=\\\"padding:5px;width:30%\\\">Lý do</td>\\n            <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {reason}</td>\\n        </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Kèm theo</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">:...............................Chứng từ gốc</td>\\n            </tr>\\n        </tbody>\\n    </table>\\n    \\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người nộp tiền </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ quỹ </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Cửa hàng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    </div>\\n    </div>\\n    \\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>        \\n    \",\"A5\":\"<div style=\\\"margin:50px;font-family:Arial,sans-serif;font-size: 11px;\\\">\\n    <div style=\\\"width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;\\\">\\n    <div style=\\\"width: 50%;float:left;text-align: left;\\\">\\n    <div style=\\\"padding-bottom: 5px;font-weight: 600;\\\">{store_name}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_address}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_phone_number}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_email}</div>\\n    </div>\\n    \\n    <div style=\\\"width: 50%;float:right;text-align: right;\\\">\\n    <div style=\\\"padding-bottom: 5px;\\\">Số: <span style=\\\"font-weight: 600;\\\">{receipt_voucher_code}</span></div>\\n    \\n    <div style=\\\"padding-bottom: 5px;\\\">Ngày ghi nhận: <span style=\\\"font-weight: 600;\\\">{issued_on}</span></div>\\n    </div>\\n    </div>\\n    \\n    <div style=\\\"width: 100%;float: left;margin-bottom: 10px;\\\">\\n    <h2 style=\\\"font-weight: 600;text-align: center;\\\">PHIẾU THU</h2>\\n    </div>\\n    &nbsp;\\n    \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width:100%\\\">\\n        <tbody>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Họ tên người nộp</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {object_name}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Địa chỉ</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {object_address}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Số tiền</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {amount}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Bằng chữ</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {total_text}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Lý do</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {reason}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Kèm theo</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">:...............................Chứng từ gốc</td>\\n            </tr>\\n        </tbody>\\n    </table>\\n    \\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người nộp tiền </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ quỹ </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Cửa hàng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    </div>\\n    </div>\\n    \\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>        \\n    \",\"K57\":null,\"K80\":null,\"default\":\"A4\"}',NULL,NULL);
INSERT INTO `storeconfig` (`createdAt`,`updatedAt`,`type`,`value`,`createdBy`,`updatedBy`) VALUES (1582179133555,1582179133555,'print_template_deposit_checked_default','{\"A4\":\"<div style=\\\"margin:50px;font-family:Arial,sans-serif;font-size: 13px;\\\">\\n    <div style=\\\"width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;\\\">\\n    <div style=\\\"width: 50%;float:left;text-align: left;\\\">\\n    <div style=\\\"padding-bottom: 5px;font-weight: 600;\\\">{store_name}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_address}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_phone_number}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_email}</div>\\n    </div>\\n    \\n    <div style=\\\"width: 50%;float:right;text-align: right;\\\">\\n    <div style=\\\"padding-bottom: 5px;\\\">Số: <span style=\\\"font-weight: 600;\\\">{receipt_voucher_code}</span></div>\\n    \\n    <div style=\\\"padding-bottom: 5px;\\\">Ngày ghi nhận: <span style=\\\"font-weight: 600;\\\">{issued_on}</span></div>\\n    </div>\\n    </div>\\n    \\n    <div style=\\\"width: 100%;float: left;margin-bottom: 10px;\\\">\\n    <h2 style=\\\"font-weight: 600;text-align: center;\\\">PHIẾU THU</h2>\\n    </div>\\n    &nbsp;\\n    \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width:100%\\\">\\n        <tbody>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Họ tên người nộp</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {object_name}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Địa chỉ</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {object_address}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Số tiền</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {amount}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Bằng chữ</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {total_text}</td>\\n            </tr>\\n            <tr>\\n            <td style=\\\"padding:5px;width:30%\\\">Lý do</td>\\n            <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {reason}</td>\\n        </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Kèm theo</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">:...............................Chứng từ gốc</td>\\n            </tr>\\n        </tbody>\\n    </table>\\n    \\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người nộp tiền </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ quỹ </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Cửa hàng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    </div>\\n    </div>\\n    \\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>        \\n    \",\"A5\":\"<div style=\\\"margin:50px;font-family:Arial,sans-serif;font-size: 11px;\\\">\\n    <div style=\\\"width: 100%;float: left;padding-bottom: 20px;margin-bottom: 20px;border-bottom: 1px solid #222222;\\\">\\n    <div style=\\\"width: 50%;float:left;text-align: left;\\\">\\n    <div style=\\\"padding-bottom: 5px;font-weight: 600;\\\">{store_name}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_address}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_phone_number}</div>\\n    \\n    <div style=\\\"font-weight: 600;padding-bottom: 5px;\\\">{store_email}</div>\\n    </div>\\n    \\n    <div style=\\\"width: 50%;float:right;text-align: right;\\\">\\n    <div style=\\\"padding-bottom: 5px;\\\">Số: <span style=\\\"font-weight: 600;\\\">{receipt_voucher_code}</span></div>\\n    \\n    <div style=\\\"padding-bottom: 5px;\\\">Ngày ghi nhận: <span style=\\\"font-weight: 600;\\\">{issued_on}</span></div>\\n    </div>\\n    </div>\\n    \\n    <div style=\\\"width: 100%;float: left;margin-bottom: 10px;\\\">\\n    <h2 style=\\\"font-weight: 600;text-align: center;\\\">PHIẾU THU</h2>\\n    </div>\\n    &nbsp;\\n    \\n    <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width:100%\\\">\\n        <tbody>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Họ tên người nộp</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {object_name}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Địa chỉ</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {object_address}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Số tiền</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {amount}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Bằng chữ</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {total_text}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Lý do</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">: {reason}</td>\\n            </tr>\\n            <tr>\\n                <td style=\\\"padding:5px;width:30%\\\">Kèm theo</td>\\n                <td style=\\\"padding:5px;width:70%;font-weight: 600\\\">:...............................Chứng từ gốc</td>\\n            </tr>\\n        </tbody>\\n    </table>\\n    \\n    <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người nộp tiền </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Thủ quỹ </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    \\n    <div style=\\\"width: 25%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Cửa hàng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    </div>\\n    </div>\\n    \\n    <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>        \\n    \",\"K57\":null,\"K80\":null,\"default\":\"A4\"}',NULL,NULL);