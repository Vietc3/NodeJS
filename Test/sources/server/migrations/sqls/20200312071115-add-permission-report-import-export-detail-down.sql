/* Replace with your SQL commands */
DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'report_import_export_detail');

DELETE FROM `permission` WHERE `name` = 'report_import_export_detail';