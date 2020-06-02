/* Replace with your SQL commands */

DELETE FROM `storeconfig` WHERE `type` = 'stocks_list';

ALTER TABLE `productstock` 
  DROP `stockQuantity2`,
  DROP `stockQuantity3`,
  DROP `stockQuantity4`,
  DROP `stockQuantity5`,
  DROP `stockQuantity6`;
  
-- xóa column stockId trong các table
-- Phiếu kiểm kho
ALTER TABLE `stockcheckcard` DROP `stockId`;
-- Đơn hàng
ALTER TABLE `invoiceproduct` DROP `stockId`;
-- Trả hàng, nhập hàng
ALTER TABLE `importcardproduct` DROP `stockId`;
-- Trả hàng nhập
ALTER TABLE `exportcardproduct` DROP `stockId`;
-- Phiếu chuyển kho
ALTER TABLE `movestockcardproduct` DROP `stockId`;