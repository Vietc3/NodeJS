/* Replace with your SQL commands */
UPDATE `storeconfig`
SET `value` = '{\"A4\":\"<div style=\\\"margin:20px\\\">\\n        <div style=\\\"width: 100%;float: left;font-family:Arial,sans-serif;font-size:13px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex\\\">\\n\\n        <div style=\\\"width: 50%;float: left;padding-left:10px\\\">\\n        <div style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_name}</div>\\n\\n        <div style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_address}</div>\\n\\n        <div style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_phone_number}</div>\\n\\n        <div style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_email}</div>\\n        </div>\\n\\n        <div style=\\\"width: 50%;float: right;\\\">\\n        <div style=\\\"text-align: right;padding-bottom: 10px;\\\">Mã phiếu trả hàng: <span style=\\\"font-weight: 600\\\">{order_code}</span></div>\\n\\n        <div style=\\\"text-align: right;padding-bottom: 10px;\\\">Ngày tạo: <span style=\\\"font-weight: 600\\\">{created_on}</span></div>\\n        </div>\\n        </div>\\n\\n        <div style=\\\"width: 100%\\\">\\n        <h1 style=\\\"font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;\\\">ĐƠN TRẢ HÀNG</h1>\\n        </div>\\n\\n        <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\\\">\\n            <tbody>\\n                <tr style=\\\"font-family:Arial,sans-serif;font-size: 12px;font-weight: 600\\\">\\n                    <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;\\\"><span>STT </span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Mã sản phẩm </span></td>\\n                    <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Tên sản phẩm </span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Đơn vị</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Số lượng </span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Giá hàng trả </span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Thành tiền </span></td>\\n                </tr>\\n                <!--<products>-->\\n                <tr style=\\\"font-family:Arial,sans-serif;font-size: 12px\\\">\\n                    <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;\\\"><span>{line_stt}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_variant_code}</span></td>\\n                    <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_variant}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_unit}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_quantity}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_price}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_amount}</span></td>\\n                </tr>\\n                <!--</products>-->\\n            </tbody>\\n        </table>\\n\\n        <table style=\\\"width:100%\\\">\\n            <tbody>\\n                <tr>\\n                    <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n                    <td style=\\\"text-align: right;\\\">&nbsp;</td>\\n                </tr>\\n                <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                    <td style=\\\"width: 50%;padding:1%\\\">&nbsp;</td>\\n                    <td style=\\\"border-bottom: 1px solid #222222; width:50%;padding: 5px;font-weight: 600;\\\">Tổng số lượng<span style=\\\"float: right;font-weight: 400;\\\">{total_quantity}</span></td>\\n                </tr>\\n                <tr style=\\\"font-family:Arial,sans-serif;font-size: 13px;\\\">\\n                    <td style=\\\"width: 50%;padding:1%\\\">&nbsp;</td>\\n                    <td style=\\\"width:50%;padding: 5px;font-weight: 600;\\\">Tổng tiền trả khách<span style=\\\"float: right;font-weight: 400;\\\">{total_amount}</span></td>\\n                </tr>\\n            </tbody>\\n        </table>\\n        <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 35%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người trả </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    <div style=\\\"width: 30%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán trưởng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    <div style=\\\"width: 35%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n\\n   \\n    </div>\\n        </div>\\n\\n        <footer style=\\\"page-break-after: always\\\">.</footer>\\n\\n        <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n        \",\"A5\":\"<div style=\\\"margin:20px\\\">\\n        <div style=\\\"width: 100%;float: left;font-family:Arial,sans-serif;font-size:11px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex\\\">\\n        \\n\\n        <div style=\\\"width: 50%;float: left;padding-left:10px\\\">\\n        <div style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_name}</div>\\n\\n        <div style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_address}</div>\\n\\n        <div style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_phone_number}</div>\\n\\n        <div style=\\\"padding-bottom: 10px;font-weight: 600;\\\">{store_email}</div>\\n        </div>\\n\\n        <div style=\\\"width: 50%;float: right;\\\">\\n        <div style=\\\"text-align: right;padding-bottom: 10px;\\\">Mã phiếu trả hàng: <span style=\\\"font-weight: 600\\\">{order_code}</span></div>\\n\\n        <div style=\\\"text-align: right;padding-bottom: 10px;\\\">Ngày tạo: <span style=\\\"font-weight: 600\\\">{created_on}</span></div>\\n        </div>\\n        </div>\\n\\n        <div style=\\\"width: 100%\\\">\\n        <h1 style=\\\"font-family:Arial,sans-serif;font-size:22px;padding-top: 10px;text-align: center;\\\">ĐƠN TRẢ HÀNG</h1>\\n        </div>\\n\\n        <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\\\">\\n            <tbody>\\n                <tr style=\\\"font-family:Arial,sans-serif;font-size: 10px;font-weight: 600\\\">\\n                    <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;\\\"><span>STT </span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Mã sản phẩm </span></td>\\n                    <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Tên sản phẩm </span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Đơn vị</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Số lượng </span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Giá hàng trả </span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>Thành tiền </span></td>\\n                </tr>\\n                <!--<products>-->\\n                <tr style=\\\"font-family:Arial,sans-serif;font-size: 10px\\\">\\n                    <td style=\\\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 5%;\\\"><span>{line_stt}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_variant_code}</span></td>\\n                    <td style=\\\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_variant}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_unit}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_quantity}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_price}</span></td>\\n                    <td style=\\\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\\\"><span>{line_amount}</span></td>\\n                </tr>\\n                <!--</products>-->\\n            </tbody>\\n        </table>\\n\\n        <table style=\\\"width:100%\\\">\\n            <tbody>\\n                <tr>\\n                    <td style=\\\"width: 50%;\\\">&nbsp;</td>\\n                    <td style=\\\"text-align: right;\\\">&nbsp;</td>\\n                </tr>\\n                <tr style=\\\"font-family:Arial,sans-serif;font-size: 11px;\\\">\\n                    <td style=\\\"width: 50%;padding:1%\\\">&nbsp;</td>\\n                    <td style=\\\"border-bottom: 1px solid #222222; width:50%;padding: 5px;font-weight: 600;\\\">Tổng số lượng<span style=\\\"float: right;font-weight: 400;\\\">{total_quantity}</span></td>\\n                </tr>\\n                <tr style=\\\"font-family:Arial,sans-serif;font-size: 11px;\\\">\\n                    <td style=\\\"width: 50%;padding:1%\\\">&nbsp;</td>\\n                    <td style=\\\"width:50%;padding: 5px;font-weight: 600;\\\">Tổng tiền trả khách<span style=\\\"float: right;font-weight: 400;\\\">{total_amount}</span></td>\\n                </tr>\\n            </tbody>\\n        </table>\\n        <div style=\\\"text-align: right;width: 100%;padding-top: 40px;\\\">Ngày... Tháng... Năm...</div>\\n    \\n    <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 35%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người trả </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    <div style=\\\"width: 30%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán trưởng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    <div style=\\\"width: 35%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n\\n   \\n    </div>\\n        </div>\\n\\n        <footer style=\\\"page-break-after: always\\\">.</footer>\\n\\n        <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n        \",\"K57\":\"<div style=\\\"font-family:Arial,sans-serif;font-size: 9px;margin:0 !important;\\\">\\n        <div style=\\\"width: 100%; text-align: center;\\\">\\n\\n        <div style=\\\"font-family:Arial,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 700;\\\">{store_name}</div>\\n\\n        <div style=\\\"font-family:Arial,sans-serif;margin-bottom: 5px;\\\">{store_address}</div>\\n\\n        <div style=\\\"font-family:Arial,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;\\\">{store_phone_number}</div>\\n\\n        <div style=\\\"font-family:Arial,sans-serif;font-weight: 700;\\\">ĐƠN TRẢ HÀNG</div>\\n\\n        <div style=\\\"width: 100%;float: left;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px solid #222222;margin-top: 10px;\\\">\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;\\\">Mã phiếu trả hàng: {order_code}</div>\\n\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;\\\">Ngày: {created_on}</div>\\n        </div>\\n\\n\\n        <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width:100%;font-size:0.75em\\\">\\n        <tbody>\\n            <tr>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; padding: 1% 0px;\\\"><strong>Tên sản phẩm</strong></td>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\"><strong>SL</strong></td>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\"><strong>Mã</strong></td>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\"><strong>Giá nhập</strong></td>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\"><strong>Thành tiền</strong></td>\\n            </tr>\\n            <!--<products>-->\\n            <tr>\\n                <td style=\\\"border-bottom:1px solid #7a7676;padding:1% 0\\\">{line_variant}</td>\\n                <td style=\\\"border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\">{line_quantity}</td>\\n                <td style=\\\"border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\">{line_variant_code}</td>\\n                <td style=\\\"border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\">{line_price}</td>\\n                <td style=\\\"border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\">{line_amount}</td>\\n            </tr>\\n            <!--</products>-->\\n        </tbody>\\n    </table>\\n\\n        <div style=\\\"width: 100%;float: left;margin-top: 10px;\\\">\\n        \\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;font-size:9px;text-align: left;font-weight: 700;\\\">Tổng số lượng</div>\\n\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;font-size: 9px;text-align: right;\\\">{total_quantity}</div>\\n        </div>\\n\\n        <div style=\\\"width: 100%;float: left;margin-top: 5px;\\\">\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-weight: bold;font-size: 9px;\\\">Khách phải trả</div>\\n\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-weight: bold;font-size: 9px;\\\">{total_amount}</div>\\n        </div>\\n        </div>\\n        </div>\\n        <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 35%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người trả </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    <div style=\\\"width: 30%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán trưởng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    <div style=\\\"width: 35%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n\\n   \\n    </div>\\n        <footer style=\\\"page-break-after: always\\\">.</footer>\\n\\n        <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n        \",\"K80\":\"<div style=\\\"font-family:Arial,sans-serif;font-size: 10px;margin:0 !important;\\\">\\n        <div style=\\\"width: 100%; text-align: center;\\\">\\n\\n        <div style=\\\"font-family:Arial,sans-serif;margin-top:15px;margin-bottom: 5px;font-weight: 700;\\\">{store_name}</div>\\n\\n        <div style=\\\"font-family:Arial,sans-serif;margin-bottom: 5px;\\\">{store_address}</div>\\n\\n        <div style=\\\"font-family:Arial,sans-serif;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px dashed #222222;\\\">{store_phone_number}</div>\\n\\n        <div style=\\\"font-family:Arial,sans-serif;font-weight: 700;\\\">ĐƠN TRẢ HÀNG</div>\\n\\n        <div style=\\\"width: 100%;float: left;padding-bottom: 10px;margin-bottom: 5px;border-bottom: 1px solid #222222;margin-top: 10px;\\\">\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;\\\">Mã phiếu trả hàng: {order_code}</div>\\n\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;\\\">Ngày: {created_on}</div>\\n        </div>\\n\\n        <table cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" style=\\\"width:100%;font-size:0.75em\\\">\\n        <tbody>\\n            <tr>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; padding: 1% 0px;\\\"><strong>Tên sản phẩm</strong></td>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\"><strong>SL</strong></td>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\"><strong>Mã</strong></td>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\"><strong>Giá nhập</strong></td>\\n                <td style=\\\"width: 20%; border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\"><strong>Thành tiền</strong></td>\\n            </tr>\\n            <!--<products>-->\\n            <tr>\\n                <td style=\\\"border-bottom:1px solid #7a7676;padding:1% 0\\\">{line_variant}</td>\\n                <td style=\\\"border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\">{line_quantity}</td>\\n                <td style=\\\"border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\">{line_variant_code}</td>\\n                <td style=\\\"border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\">{line_price}</td>\\n                <td style=\\\"border-bottom:1px solid #7a7676; text-align: center;padding:1% 0\\\">{line_amount}</td>\\n            </tr>\\n            <!--</products>-->\\n        </tbody>\\n    </table>\\n        \\n\\n        <div style=\\\"width: 100%;float: left;margin-top: 5px;\\\">\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: left;font-weight: 700;\\\">Tổng số lượng</div>\\n\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;font-size: 10px;text-align: right;\\\">{total_quantity}</div>\\n        </div>\\n\\n        <div style=\\\"width: 100%;float: left;margin-top: 5px;padding-bottom: 30px;\\\">\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;text-align: left;font-weight: bold;font-size: 10px;\\\">Khách phải trả</div>\\n\\n        <div style=\\\"width: 50%;float:left;font-family:Arial,sans-serif;text-align: right;font-weight: bold;font-size: 10px;\\\">{total_amount}</div>\\n        </div>\\n        </div>\\n        </div>\\n        <div style=\\\"width: 100%;float: left;padding-top: 20px;\\\">\\n    <div style=\\\"width: 35%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Người trả </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    <div style=\\\"width: 30%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Kế toán trưởng </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n    <div style=\\\"width: 35%;float: left;text-align: center;\\\"><span style=\\\"font-weight: 600;padding-bottom: 5px;\\\">Giám đốc </span> <span style=\\\"display: block;\\\"> (ký,ghi rõ họ tên) </span></div>\\n\\n   \\n    </div>\\n        <footer style=\\\"page-break-after: always\\\">.</footer>\\n\\n        <div id=\\\"eJOY__extension_root\\\" style=\\\"all: unset;\\\">&nbsp;</div>\\n        \",\"default\":\"A4\"}'
WHERE `type` = 'print_template_invoice_return';