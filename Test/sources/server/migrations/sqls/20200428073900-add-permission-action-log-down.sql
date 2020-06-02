/* Replace with your SQL commands */
DELETE FROM `rolepermission` WHERE `permissionId` = (SELECT `id` FROM `permission` where `name` = 'action_log');

DELETE FROM `permission` WHERE `name` = 'action_log';