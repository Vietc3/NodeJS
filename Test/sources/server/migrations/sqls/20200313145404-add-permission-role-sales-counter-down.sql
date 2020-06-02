/* Replace with your SQL commands */
DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'sales_counter');

DELETE FROM `permission` WHERE `name` = 'sales_counter';