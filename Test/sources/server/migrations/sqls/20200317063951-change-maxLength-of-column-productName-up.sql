/* Replace with your SQL commands */
ALTER TABLE `exportcardproduct` MODIFY `productName` LONGTEXT;
ALTER TABLE `importcardproduct` MODIFY `productName` LONGTEXT;
ALTER TABLE `invoiceproduct` MODIFY `productName` LONGTEXT;
ALTER TABLE `manufacturingcardfinishedproduct` MODIFY `name` LONGTEXT;
ALTER TABLE `manufacturingcardmaterial` MODIFY `name` LONGTEXT;
ALTER TABLE `ordercardproduct` MODIFY `productName` LONGTEXT;
ALTER TABLE `stockcheckcardproduct` MODIFY `productName` LONGTEXT;