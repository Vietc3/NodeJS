/* Replace with your SQL commands */
ALTER TABLE `exportcardproduct` MODIFY `productName` VARCHAR(255);
ALTER TABLE `importcardproduct` MODIFY `productName` VARCHAR(255);
ALTER TABLE `invoiceproduct` MODIFY `productName` VARCHAR(255);
ALTER TABLE `manufacturingcardfinishedproduct` MODIFY `name` VARCHAR(255);
ALTER TABLE `manufacturingcardmaterial` MODIFY `name` VARCHAR(255);
ALTER TABLE `ordercardproduct` MODIFY `productName` VARCHAR(255);
ALTER TABLE `stockcheckcardproduct` MODIFY `productName` VARCHAR(255);