/* Replace with your SQL commands */
ALTER TABLE `product` MODIFY `name` VARCHAR(255);
DELETE FROM `storeconfig` WHERE `type` = 'language_product';