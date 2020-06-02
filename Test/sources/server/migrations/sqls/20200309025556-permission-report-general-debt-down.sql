/* Replace with your SQL commands */
DELETE FROM `rolepermission` WHERE `roleId` = (SELECT `id` FROM `role` where `name` = 'admin') AND `permissionId` = (SELECT `id` FROM `permission` where `name` = 'report_general_debt');

DELETE FROM `permission` WHERE `name` = 'report_general_debt';