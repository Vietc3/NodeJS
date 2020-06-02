/* Replace with your SQL commands */
DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'report_import_export');

DELETE FROM `permission` WHERE `name` = 'report_import_export';

DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'report_low_stock');

DELETE FROM `permission` WHERE `name` = 'report_low_stock';

DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'setup_branch');

DELETE FROM `permission` WHERE `name` = 'setup_branch';

DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'setup_stock');

DELETE FROM `permission` WHERE `name` = 'setup_stock';