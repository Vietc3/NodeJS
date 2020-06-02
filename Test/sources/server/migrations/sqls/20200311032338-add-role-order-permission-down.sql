/* Replace with your SQL commands */
DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'invoice_order_card') OR `permissionId` = (SELECT `id` FROM `permission` where `name` = 'import_order_card') ;

DELETE FROM `permission` WHERE `name` = 'invoice_order_card' OR  `name` = 'import_order_card' ;
