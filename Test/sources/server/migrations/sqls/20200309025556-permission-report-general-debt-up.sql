/* Replace with your SQL commands */
INSERT INTO `permission` (`createdAt`,`updatedAt`,`name`, `deletedAt`, `description`) VALUES ('1582179133516', '1582179133516', 'report_general_debt', '0', '');

INSERT INTO `rolepermission` (`createdAt`,`updatedAt`, `type`, `roleId`, `permissionId`) VALUES ('1582179133516', '1582179133516', '2', (SELECT `id` FROM `role` where `name` = 'admin'), (SELECT `id` FROM `permission` where `name` = 'report_general_debt'));