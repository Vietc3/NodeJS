-- phpMyAdmin SQL Dump
-- version 2.11.11.3
-- http://www.phpmyadmin.net
--
-- Host: 118.139.179.8
-- Generation Time: Dec 20, 2014 at 04:55 AM
-- Server version: 5.0.96
-- PHP Version: 5.1.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sissue`
--

-- --------------------------------------------------------

--
-- Table structure for table `functions`
--

CREATE TABLE `functions` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(50) NOT NULL,
  `description` varchar(256) NOT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=55 ;

--
-- Dumping data for table `functions`
--

INSERT INTO `functions` VALUES(1, 'CREATE_USER', 'Create user', 'User');
INSERT INTO `functions` VALUES(2, 'EDIT_USER', 'Edit user', 'User');
INSERT INTO `functions` VALUES(3, 'UPDATE_USER', 'Update user', 'User');
INSERT INTO `functions` VALUES(4, 'DELETE_USER', 'Delete user', 'User');
INSERT INTO `functions` VALUES(5, 'VIEW_USER', 'View user', 'User');
INSERT INTO `functions` VALUES(6, 'CREATE_PROJECT', 'Create project', 'Project');
INSERT INTO `functions` VALUES(7, 'EDIT_PROJECT', 'Edit project', 'Project');
INSERT INTO `functions` VALUES(8, 'UPDATE_PROJECT', 'Update project', 'Project');
INSERT INTO `functions` VALUES(9, 'DELETE_PROJECT', 'Delete project', 'Project');
INSERT INTO `functions` VALUES(10, 'VIEW_PROJECT', 'View project', 'Project');
INSERT INTO `functions` VALUES(11, 'CREATE_ISSUE', 'Create issue', 'Issue');
INSERT INTO `functions` VALUES(12, 'EDIT_ISSUE', 'Edit issue', 'Issue');
INSERT INTO `functions` VALUES(13, 'UPDATE_ISSUE', 'Update issue', 'Issue');
INSERT INTO `functions` VALUES(14, 'DELETE_ISSUE', 'Delete issue', 'Issue');
INSERT INTO `functions` VALUES(15, 'VIEW_ISSUE', 'View issue', 'Issue');
INSERT INTO `functions` VALUES(17, 'CREATE_PROJECTSTATUS', 'Create project status', 'Project Status');
INSERT INTO `functions` VALUES(18, 'EDIT_PROJECTSTATUS', 'Edit project status', 'Project Status');
INSERT INTO `functions` VALUES(19, 'UPDATE_PROJECTSTATUS', 'Update project status', 'Project Status');
INSERT INTO `functions` VALUES(20, 'DELETE_PROJECTSTATUS', 'Delete project status', 'Project Status');
INSERT INTO `functions` VALUES(21, 'VIEW_PROJECTSTATUS', 'View project status', 'Project Status');
INSERT INTO `functions` VALUES(22, 'CREATE_ISSUESTATUS', 'Create issue status', 'Issue Status');
INSERT INTO `functions` VALUES(23, 'EDIT_ISSUESTATUS', 'Edit issue status', 'Issue Status');
INSERT INTO `functions` VALUES(24, 'UPDATE_ISSUESTATUS', 'Update issue status', 'Issue Status');
INSERT INTO `functions` VALUES(25, 'DELETE_ISSUESTATUS', 'Delete issue status', 'Issue Status');
INSERT INTO `functions` VALUES(26, 'VIEW_ISSUESTATUS', 'View issue status', 'Issue Status');
INSERT INTO `functions` VALUES(27, 'CREATE_ISSUETYPE', 'Create issue type', 'Issue Type');
INSERT INTO `functions` VALUES(28, 'EDIT_ISSUETYPE', 'Edit issue type', 'Issue Type');
INSERT INTO `functions` VALUES(29, 'UPDATE_ISSUETYPE', 'Update issue type', 'Issue Type');
INSERT INTO `functions` VALUES(30, 'DELETE_ISSUETYPE', 'Delete issue type', 'Issue Type');
INSERT INTO `functions` VALUES(31, 'VIEW_ISSUETYPE', 'View issue type', 'Issue Type');
INSERT INTO `functions` VALUES(32, 'CREATE_ROLE', 'Create role', 'Role');
INSERT INTO `functions` VALUES(33, 'EDIT_ROLE', 'Edit role', 'Role');
INSERT INTO `functions` VALUES(34, 'UPDATE_ROLE', 'Update role', 'Role');
INSERT INTO `functions` VALUES(35, 'DELETE_ROLE', 'Delete role', 'Role');
INSERT INTO `functions` VALUES(36, 'VIEW_ROLE', 'View role', 'Role');
INSERT INTO `functions` VALUES(37, 'VIEW_FUNCTIONS', 'View function', 'Function');
INSERT INTO `functions` VALUES(38, 'ASSIGNROLE_USER', 'Assign roles for user', 'User');
INSERT INTO `functions` VALUES(39, 'ASSIGNFUNCTION_ROLE', 'Assign functions for role', 'Role');
INSERT INTO `functions` VALUES(40, 'VIEW_NOTIFICATIONS', 'View Notifications', 'Notifications');
INSERT INTO `functions` VALUES(41, 'LISTMYISSUE_ISSUE', 'List my issue', 'My Issue');
INSERT INTO `functions` VALUES(42, 'INVISIBLE_NOTIFICATIONS', 'Invisible notifications', 'Notifications');
INSERT INTO `functions` VALUES(43, 'EDIT_ISSUETIME', 'Edit issue time', 'Issue Time');
INSERT INTO `functions` VALUES(44, 'VIEW_USERROLE', 'List all users of a project', 'User Role');
INSERT INTO `functions` VALUES(45, 'EDIT_USERROLE', 'Remove an user from project', 'User Role');
INSERT INTO `functions` VALUES(46, 'CREATE_USERROLE', 'Add an user to project', 'User Role');
INSERT INTO `functions` VALUES(47, 'EDITHISTORY_ISSUE', 'Edit the infor that you updated on this issue', 'Issue');
INSERT INTO `functions` VALUES(48, 'DELETEHISTORY_ISSUE', 'Delete the update you did', 'Issue');
INSERT INTO `functions` VALUES(49, 'VIEWBILLHOURS_ISSUE', 'Can view bill hours', 'Issue');
INSERT INTO `functions` VALUES(50, 'VIEW_PAYMENT', 'User can view list of payments', 'Payment');
INSERT INTO `functions` VALUES(51, 'FILTER_PAYMENT', 'Filter to create payment', 'Payment');
INSERT INTO `functions` VALUES(52, 'EDIT_PAYMENT', 'Edit payment', 'Payment');
INSERT INTO `functions` VALUES(53, 'DELETE_PAYMENT', 'Delete payment', 'Payment');
INSERT INTO `functions` VALUES(54, 'CHECKOUT_PAYMENT', 'Check out payment', 'Payment');

-- --------------------------------------------------------

--
-- Table structure for table `issue`
--

CREATE TABLE `issue` (
  `id` int(11) NOT NULL auto_increment,
  `code` int(3) NOT NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `description` longtext collate utf8_unicode_ci NOT NULL,
  `project_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `assignee_id` int(11) default NULL,
  `creator_id` int(11) NOT NULL,
  `priority` tinyint(4) NOT NULL,
  `parent_issue_id` int(11) NOT NULL,
  `child_ids` varchar(256) collate utf8_unicode_ci NOT NULL,
  `order_id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `complete_percent` tinyint(4) NOT NULL,
  `attachment` varchar(255) collate utf8_unicode_ci NOT NULL,
  `created_at` datetime default NULL,
  `modified` datetime NOT NULL,
  `watchers` varchar(50) collate utf8_unicode_ci default NULL,
  `hours` float default NULL,
  `bill_hours` float default NULL,
  `is_paid` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1047 ;

--
-- Dumping data for table `issue`
--

INSERT INTO `issue` VALUES(137, 7, 'Display wrong order in the child issue list', '<p>\r\n	<input alt="" src="/sIssue/uploads/userfiles/Untitled.png" style="width: 1366px; height: 768px;" type="image" /></p>\r\n', 75, 4, 6, 25, 25, 3, 0, '', 137, 0, '2012-08-19', '2012-08-19', 100, '', '2012-08-19 00:00:00', '2012-08-22 14:13:32', '', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `issue_backup`
--

CREATE TABLE `issue_backup` (
  `id` int(11) NOT NULL auto_increment,
  `issue_id` int(3) default NULL,
  `code` int(3) NOT NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `description` text collate utf8_unicode_ci NOT NULL,
  `project_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `assignee_id` int(11) default NULL,
  `creator_id` int(11) NOT NULL,
  `priority` tinyint(4) NOT NULL,
  `parent_issue_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `complete_percent` tinyint(4) NOT NULL,
  `attachment` varchar(255) collate utf8_unicode_ci NOT NULL,
  `created_at` datetime default NULL,
  `modified` datetime NOT NULL,
  `comment` text collate utf8_unicode_ci NOT NULL,
  `modifier` int(11) NOT NULL,
  `watchers` varchar(50) collate utf8_unicode_ci default NULL,
  `hours` float default NULL,
  `bill_hours` float default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3992 ;

--
-- Dumping data for table `issue_backup`
--

INSERT INTO `issue_backup` VALUES(169, 125, 3, 'What is the time zone used in the create issue page?', '<p>\r\n	Try to create a issue and take a look at start date and end date</p>\r\n<p>\r\n	Please anwser with comment at below</p>\r\n', 75, 6, 1, 22, 25, 3, 0, '2012-08-19', '2012-08-19', 0, '', '2012-08-19 00:00:00', '2012-08-19 23:08:46', '', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `issue_status`
--

CREATE TABLE `issue_status` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(125) collate utf8_unicode_ci NOT NULL,
  `description` text collate utf8_unicode_ci NOT NULL,
  `color` varchar(15) collate utf8_unicode_ci default NULL,
  `order_id` int(11) NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=15 ;

--
-- Dumping data for table `issue_status`
--

INSERT INTO `issue_status` VALUES(1, 'New', 'This issue has just been created', '#EBEBEB', 1);
INSERT INTO `issue_status` VALUES(2, 'In progress', 'Developer is working on this task', '#E8E8BA', 4);
INSERT INTO `issue_status` VALUES(3, 'Need Information', 'Developer does not understand it totally', '#E0E000', 2);
INSERT INTO `issue_status` VALUES(4, 'Resolved', 'Developer fixed, built, wrote this issue. Please check and give me your feedback', '#E3B6E3', 5);
INSERT INTO `issue_status` VALUES(5, 'Answered', 'Client answered developer''s question.', '#E0A8A8', 6);
INSERT INTO `issue_status` VALUES(6, 'Closed', 'This issue has been completed', '#00C2C2', 9);
INSERT INTO `issue_status` VALUES(7, 'Rejected', 'This issue is not done yet', '#E3B600', 10);
INSERT INTO `issue_status` VALUES(8, 'Reopened', 'Client reopened this issue because it is not done yet', '#EBEBEB	', 11);
INSERT INTO `issue_status` VALUES(9, 'Duplicated', 'This issue is duplicated with another one', NULL, 12);
INSERT INTO `issue_status` VALUES(10, 'Researching', 'Developer is doing a research about this task', '#D4C0F0', 3);
INSERT INTO `issue_status` VALUES(11, 'Impossible', 'Developer can not resolve this issue', '#D67F93', 13);
INSERT INTO `issue_status` VALUES(12, 'Feedbacked', 'Client give a feedback to developer.', '#E0A8A8', 7);
INSERT INTO `issue_status` VALUES(13, 'More Requirement', 'Client give more requirement', '#EBEBEB	', 8);
INSERT INTO `issue_status` VALUES(14, 'Upcoming', 'This issue is not start yet, not ready to fix now, it should be fixed in future', '#FFFF36', 14);

-- --------------------------------------------------------

--
-- Table structure for table `issue_time`
--

CREATE TABLE `issue_time` (
  `id` int(11) NOT NULL auto_increment,
  `issue_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `hours` float NOT NULL,
  `description` text collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=12 ;

--
-- Dumping data for table `issue_time`
--

INSERT INTO `issue_time` VALUES(10, 65, '2012-07-07 00:00:00', 1, '<p>\r\n	asdsd</p>\r\n');
INSERT INTO `issue_time` VALUES(9, 65, '2012-07-06 00:00:00', 1, '<p>\r\n	sagsadg</p>\r\n');
INSERT INTO `issue_time` VALUES(8, 65, '2012-07-07 00:00:00', 23, '<p>\r\n	asdgsdg</p>\r\n');
INSERT INTO `issue_time` VALUES(7, 65, '2012-07-06 00:00:00', 23, '<p>\r\n	sdgsdg</p>\r\n');
INSERT INTO `issue_time` VALUES(11, 175, '2012-09-05 00:00:00', 8, '');

-- --------------------------------------------------------

--
-- Table structure for table `issue_type`
--

CREATE TABLE `issue_type` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(125) collate utf8_unicode_ci NOT NULL,
  `description` text collate utf8_unicode_ci NOT NULL,
  `color` varchar(10) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=8 ;

--
-- Dumping data for table `issue_type`
--

INSERT INTO `issue_type` VALUES(2, 'Support', 'This issue is a support', '#FFFFE6');
INSERT INTO `issue_type` VALUES(3, 'Feature', 'This issue is a new feature', '#A3F0FF');
INSERT INTO `issue_type` VALUES(4, 'Bug', 'This issue is a bug', '#FFCBB5');
INSERT INTO `issue_type` VALUES(6, 'Task', 'This issue is a task', '#F1FFC4');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL auto_increment,
  `email_address` varchar(50) character set utf8 collate utf8_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL default '0',
  `subject` varchar(1000) character set utf8 collate utf8_unicode_ci NOT NULL,
  `content` varchar(10000) NOT NULL,
  `project_id` int(11) default NULL,
  `issue_id` int(11) default NULL,
  `is_visible` tinyint(1) NOT NULL default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1744 ;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` VALUES(1, 'ety@tamcsolutions.info', 1, '[Task #97 - New] Please add this to the website: tamc365.com', '<body style="margin: 10px;">\n        <div style="width: 640px; font-family: Arial, Helvetica, sans-serif; font-size: 13px;">\n        <div><div style="margin:10px">\r\n    <div style="width:640px;font-family:Arial,Helvetica,sans-serif;font-size:13px">\r\n        <div class="adM">\r\n        </div>\r\n        <div>\r\n            <h3><a target="_blank" href="">Project: THEWISE</a></h3>\r\n            <div>Task #97 has been reported by Aaron.\r\n                <hr>\r\n                <a target="_blank" href="http://issue.sionvn.net/?m=issue&a=view&id=907">Task #97: Please add this to the website: tamc365.com</a>\r\n                <ul>\r\n                    <li>Creator: Aaron</li>\r\n                    <li>Status: New</li>\r\n                    <li>Priority: Immediate</li>\r\n                    <li>Assignee: DEV_T</li>\r\n                </ul>\r\n                <hr>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n</div></body>', 126, 907, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL auto_increment,
  `project_id` int(11) NOT NULL,
  `bill_hours` float NOT NULL,
  `rate` float NOT NULL,
  `amount` float NOT NULL,
  `client_id` int(11) default NULL,
  `is_paid` tinyint(1) NOT NULL default '0',
  `date` datetime NOT NULL,
  `secret_key` varchar(100) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` VALUES(7, 137, 20.4, 12, 245, NULL, 1, '2014-08-26 21:31:23', NULL);
INSERT INTO `payment` VALUES(10, 126, 25, 25, 625, NULL, 1, '2014-09-05 08:34:51', NULL);
INSERT INTO `payment` VALUES(11, 137, 89.8, 12, 1078, NULL, 1, '2014-10-16 12:02:46', NULL);
INSERT INTO `payment` VALUES(12, 137, 58.6, 16, 938, NULL, 0, '2014-12-15 23:35:53', '');

-- --------------------------------------------------------

--
-- Table structure for table `payment_issue`
--

CREATE TABLE `payment_issue` (
  `id` int(11) NOT NULL auto_increment,
  `payment_id` int(11) NOT NULL,
  `issue_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=709 ;

--
-- Dumping data for table `payment_issue`
--

INSERT INTO `payment_issue` VALUES(1, 1, 923);
INSERT INTO `payment_issue` VALUES(2, 1, 922);
INSERT INTO `payment_issue` VALUES(3, 1, 921);
INSERT INTO `payment_issue` VALUES(4, 1, 920);
INSERT INTO `payment_issue` VALUES(5, 1, 919);
INSERT INTO `payment_issue` VALUES(6, 1, 918);
INSERT INTO `payment_issue` VALUES(7, 1, 916);
INSERT INTO `payment_issue` VALUES(8, 1, 915);
INSERT INTO `payment_issue` VALUES(9, 1, 914);
INSERT INTO `payment_issue` VALUES(10, 1, 913);
INSERT INTO `payment_issue` VALUES(11, 1, 912);
INSERT INTO `payment_issue` VALUES(12, 1, 911);
INSERT INTO `payment_issue` VALUES(13, 1, 906);
INSERT INTO `payment_issue` VALUES(14, 1, 905);
INSERT INTO `payment_issue` VALUES(15, 1, 904);
INSERT INTO `payment_issue` VALUES(16, 1, 903);
INSERT INTO `payment_issue` VALUES(17, 1, 902);
INSERT INTO `payment_issue` VALUES(18, 1, 901);
INSERT INTO `payment_issue` VALUES(19, 1, 900);
INSERT INTO `payment_issue` VALUES(20, 1, 899);
INSERT INTO `payment_issue` VALUES(21, 1, 898);
INSERT INTO `payment_issue` VALUES(22, 1, 896);
INSERT INTO `payment_issue` VALUES(23, 1, 893);
INSERT INTO `payment_issue` VALUES(24, 1, 892);
INSERT INTO `payment_issue` VALUES(25, 1, 891);
INSERT INTO `payment_issue` VALUES(26, 1, 890);
INSERT INTO `payment_issue` VALUES(27, 1, 885);
INSERT INTO `payment_issue` VALUES(28, 1, 884);
INSERT INTO `payment_issue` VALUES(29, 1, 880);
INSERT INTO `payment_issue` VALUES(30, 1, 879);
INSERT INTO `payment_issue` VALUES(31, 1, 878);
INSERT INTO `payment_issue` VALUES(32, 1, 877);
INSERT INTO `payment_issue` VALUES(33, 1, 876);
INSERT INTO `payment_issue` VALUES(34, 1, 875);
INSERT INTO `payment_issue` VALUES(35, 1, 873);
INSERT INTO `payment_issue` VALUES(36, 1, 872);
INSERT INTO `payment_issue` VALUES(37, 1, 865);
INSERT INTO `payment_issue` VALUES(38, 1, 862);
INSERT INTO `payment_issue` VALUES(39, 1, 860);
INSERT INTO `payment_issue` VALUES(40, 1, 859);
INSERT INTO `payment_issue` VALUES(41, 1, 857);
INSERT INTO `payment_issue` VALUES(42, 1, 856);
INSERT INTO `payment_issue` VALUES(43, 1, 850);
INSERT INTO `payment_issue` VALUES(44, 1, 847);
INSERT INTO `payment_issue` VALUES(45, 1, 846);
INSERT INTO `payment_issue` VALUES(46, 1, 845);
INSERT INTO `payment_issue` VALUES(47, 1, 844);
INSERT INTO `payment_issue` VALUES(48, 1, 839);
INSERT INTO `payment_issue` VALUES(49, 1, 838);
INSERT INTO `payment_issue` VALUES(50, 1, 837);
INSERT INTO `payment_issue` VALUES(51, 1, 836);
INSERT INTO `payment_issue` VALUES(52, 1, 835);
INSERT INTO `payment_issue` VALUES(53, 1, 834);
INSERT INTO `payment_issue` VALUES(54, 1, 833);
INSERT INTO `payment_issue` VALUES(55, 1, 832);
INSERT INTO `payment_issue` VALUES(56, 1, 831);
INSERT INTO `payment_issue` VALUES(57, 1, 830);
INSERT INTO `payment_issue` VALUES(58, 1, 829);
INSERT INTO `payment_issue` VALUES(59, 1, 828);
INSERT INTO `payment_issue` VALUES(60, 1, 827);
INSERT INTO `payment_issue` VALUES(61, 1, 826);
INSERT INTO `payment_issue` VALUES(62, 1, 825);
INSERT INTO `payment_issue` VALUES(63, 1, 824);
INSERT INTO `payment_issue` VALUES(64, 1, 823);
INSERT INTO `payment_issue` VALUES(65, 1, 822);
INSERT INTO `payment_issue` VALUES(66, 1, 821);
INSERT INTO `payment_issue` VALUES(67, 1, 819);
INSERT INTO `payment_issue` VALUES(68, 1, 818);
INSERT INTO `payment_issue` VALUES(69, 1, 817);
INSERT INTO `payment_issue` VALUES(70, 1, 816);
INSERT INTO `payment_issue` VALUES(71, 1, 815);
INSERT INTO `payment_issue` VALUES(72, 1, 810);
INSERT INTO `payment_issue` VALUES(73, 1, 809);
INSERT INTO `payment_issue` VALUES(74, 1, 808);
INSERT INTO `payment_issue` VALUES(75, 1, 807);
INSERT INTO `payment_issue` VALUES(76, 1, 806);
INSERT INTO `payment_issue` VALUES(77, 1, 805);
INSERT INTO `payment_issue` VALUES(78, 1, 804);
INSERT INTO `payment_issue` VALUES(79, 1, 803);
INSERT INTO `payment_issue` VALUES(80, 1, 802);
INSERT INTO `payment_issue` VALUES(81, 1, 801);
INSERT INTO `payment_issue` VALUES(82, 1, 800);
INSERT INTO `payment_issue` VALUES(83, 2, 923);
INSERT INTO `payment_issue` VALUES(84, 2, 922);
INSERT INTO `payment_issue` VALUES(85, 2, 921);
INSERT INTO `payment_issue` VALUES(86, 2, 920);
INSERT INTO `payment_issue` VALUES(87, 2, 918);
INSERT INTO `payment_issue` VALUES(88, 2, 915);
INSERT INTO `payment_issue` VALUES(89, 2, 913);
INSERT INTO `payment_issue` VALUES(90, 2, 912);
INSERT INTO `payment_issue` VALUES(91, 2, 911);
INSERT INTO `payment_issue` VALUES(92, 2, 906);
INSERT INTO `payment_issue` VALUES(93, 2, 905);
INSERT INTO `payment_issue` VALUES(94, 2, 904);
INSERT INTO `payment_issue` VALUES(95, 2, 903);
INSERT INTO `payment_issue` VALUES(96, 2, 902);
INSERT INTO `payment_issue` VALUES(97, 2, 901);
INSERT INTO `payment_issue` VALUES(98, 2, 900);
INSERT INTO `payment_issue` VALUES(99, 2, 899);
INSERT INTO `payment_issue` VALUES(100, 2, 898);
INSERT INTO `payment_issue` VALUES(101, 2, 896);
INSERT INTO `payment_issue` VALUES(102, 2, 893);
INSERT INTO `payment_issue` VALUES(103, 2, 892);
INSERT INTO `payment_issue` VALUES(104, 2, 891);
INSERT INTO `payment_issue` VALUES(105, 2, 890);
INSERT INTO `payment_issue` VALUES(106, 2, 885);
INSERT INTO `payment_issue` VALUES(107, 2, 884);
INSERT INTO `payment_issue` VALUES(108, 2, 880);
INSERT INTO `payment_issue` VALUES(109, 2, 879);
INSERT INTO `payment_issue` VALUES(110, 2, 878);
INSERT INTO `payment_issue` VALUES(111, 2, 877);
INSERT INTO `payment_issue` VALUES(112, 2, 876);
INSERT INTO `payment_issue` VALUES(113, 2, 875);
INSERT INTO `payment_issue` VALUES(114, 2, 873);
INSERT INTO `payment_issue` VALUES(115, 2, 872);
INSERT INTO `payment_issue` VALUES(116, 2, 865);
INSERT INTO `payment_issue` VALUES(117, 2, 862);
INSERT INTO `payment_issue` VALUES(118, 2, 860);
INSERT INTO `payment_issue` VALUES(119, 2, 859);
INSERT INTO `payment_issue` VALUES(120, 2, 857);
INSERT INTO `payment_issue` VALUES(121, 2, 856);
INSERT INTO `payment_issue` VALUES(122, 2, 850);
INSERT INTO `payment_issue` VALUES(123, 2, 847);
INSERT INTO `payment_issue` VALUES(124, 2, 846);
INSERT INTO `payment_issue` VALUES(125, 2, 845);
INSERT INTO `payment_issue` VALUES(126, 2, 844);
INSERT INTO `payment_issue` VALUES(127, 2, 839);
INSERT INTO `payment_issue` VALUES(128, 2, 838);
INSERT INTO `payment_issue` VALUES(129, 2, 837);
INSERT INTO `payment_issue` VALUES(130, 2, 836);
INSERT INTO `payment_issue` VALUES(131, 2, 835);
INSERT INTO `payment_issue` VALUES(132, 2, 834);
INSERT INTO `payment_issue` VALUES(133, 2, 833);
INSERT INTO `payment_issue` VALUES(134, 2, 832);
INSERT INTO `payment_issue` VALUES(135, 2, 831);
INSERT INTO `payment_issue` VALUES(136, 2, 830);
INSERT INTO `payment_issue` VALUES(137, 2, 829);
INSERT INTO `payment_issue` VALUES(138, 2, 828);
INSERT INTO `payment_issue` VALUES(139, 2, 827);
INSERT INTO `payment_issue` VALUES(140, 2, 826);
INSERT INTO `payment_issue` VALUES(141, 2, 825);
INSERT INTO `payment_issue` VALUES(142, 2, 824);
INSERT INTO `payment_issue` VALUES(143, 2, 823);
INSERT INTO `payment_issue` VALUES(144, 2, 822);
INSERT INTO `payment_issue` VALUES(145, 2, 821);
INSERT INTO `payment_issue` VALUES(146, 2, 819);
INSERT INTO `payment_issue` VALUES(147, 2, 818);
INSERT INTO `payment_issue` VALUES(148, 2, 817);
INSERT INTO `payment_issue` VALUES(149, 2, 816);
INSERT INTO `payment_issue` VALUES(150, 2, 815);
INSERT INTO `payment_issue` VALUES(151, 2, 810);
INSERT INTO `payment_issue` VALUES(152, 2, 809);
INSERT INTO `payment_issue` VALUES(153, 2, 808);
INSERT INTO `payment_issue` VALUES(154, 2, 807);
INSERT INTO `payment_issue` VALUES(155, 2, 806);
INSERT INTO `payment_issue` VALUES(156, 2, 805);
INSERT INTO `payment_issue` VALUES(157, 2, 804);
INSERT INTO `payment_issue` VALUES(158, 2, 803);
INSERT INTO `payment_issue` VALUES(159, 2, 802);
INSERT INTO `payment_issue` VALUES(160, 2, 801);
INSERT INTO `payment_issue` VALUES(161, 2, 800);
INSERT INTO `payment_issue` VALUES(269, 4, 923);
INSERT INTO `payment_issue` VALUES(268, 3, 800);
INSERT INTO `payment_issue` VALUES(267, 3, 801);
INSERT INTO `payment_issue` VALUES(266, 3, 802);
INSERT INTO `payment_issue` VALUES(265, 3, 803);
INSERT INTO `payment_issue` VALUES(264, 3, 804);
INSERT INTO `payment_issue` VALUES(263, 3, 806);
INSERT INTO `payment_issue` VALUES(262, 3, 807);
INSERT INTO `payment_issue` VALUES(261, 3, 808);
INSERT INTO `payment_issue` VALUES(260, 3, 809);
INSERT INTO `payment_issue` VALUES(259, 3, 810);
INSERT INTO `payment_issue` VALUES(258, 3, 815);
INSERT INTO `payment_issue` VALUES(257, 3, 816);
INSERT INTO `payment_issue` VALUES(256, 3, 818);
INSERT INTO `payment_issue` VALUES(255, 3, 819);
INSERT INTO `payment_issue` VALUES(254, 3, 822);
INSERT INTO `payment_issue` VALUES(253, 3, 823);
INSERT INTO `payment_issue` VALUES(252, 3, 825);
INSERT INTO `payment_issue` VALUES(251, 3, 826);
INSERT INTO `payment_issue` VALUES(250, 3, 828);
INSERT INTO `payment_issue` VALUES(249, 3, 830);
INSERT INTO `payment_issue` VALUES(248, 3, 831);
INSERT INTO `payment_issue` VALUES(247, 3, 832);
INSERT INTO `payment_issue` VALUES(246, 3, 834);
INSERT INTO `payment_issue` VALUES(245, 3, 835);
INSERT INTO `payment_issue` VALUES(244, 3, 837);
INSERT INTO `payment_issue` VALUES(243, 3, 838);
INSERT INTO `payment_issue` VALUES(242, 3, 839);
INSERT INTO `payment_issue` VALUES(241, 3, 845);
INSERT INTO `payment_issue` VALUES(240, 3, 846);
INSERT INTO `payment_issue` VALUES(239, 3, 847);
INSERT INTO `payment_issue` VALUES(238, 3, 850);
INSERT INTO `payment_issue` VALUES(237, 3, 856);
INSERT INTO `payment_issue` VALUES(236, 3, 857);
INSERT INTO `payment_issue` VALUES(235, 3, 859);
INSERT INTO `payment_issue` VALUES(234, 3, 860);
INSERT INTO `payment_issue` VALUES(233, 3, 862);
INSERT INTO `payment_issue` VALUES(232, 3, 865);
INSERT INTO `payment_issue` VALUES(231, 3, 875);
INSERT INTO `payment_issue` VALUES(230, 3, 876);
INSERT INTO `payment_issue` VALUES(229, 3, 878);
INSERT INTO `payment_issue` VALUES(228, 3, 879);
INSERT INTO `payment_issue` VALUES(227, 3, 884);
INSERT INTO `payment_issue` VALUES(226, 3, 885);
INSERT INTO `payment_issue` VALUES(225, 3, 891);
INSERT INTO `payment_issue` VALUES(224, 3, 896);
INSERT INTO `payment_issue` VALUES(223, 3, 898);
INSERT INTO `payment_issue` VALUES(222, 3, 899);
INSERT INTO `payment_issue` VALUES(221, 3, 900);
INSERT INTO `payment_issue` VALUES(220, 3, 902);
INSERT INTO `payment_issue` VALUES(219, 3, 903);
INSERT INTO `payment_issue` VALUES(218, 3, 906);
INSERT INTO `payment_issue` VALUES(217, 3, 912);
INSERT INTO `payment_issue` VALUES(216, 3, 913);
INSERT INTO `payment_issue` VALUES(270, 4, 922);
INSERT INTO `payment_issue` VALUES(271, 4, 921);
INSERT INTO `payment_issue` VALUES(272, 4, 920);
INSERT INTO `payment_issue` VALUES(273, 4, 919);
INSERT INTO `payment_issue` VALUES(274, 4, 918);
INSERT INTO `payment_issue` VALUES(275, 4, 916);
INSERT INTO `payment_issue` VALUES(276, 4, 915);
INSERT INTO `payment_issue` VALUES(277, 4, 914);
INSERT INTO `payment_issue` VALUES(278, 4, 913);
INSERT INTO `payment_issue` VALUES(279, 4, 912);
INSERT INTO `payment_issue` VALUES(280, 4, 911);
INSERT INTO `payment_issue` VALUES(281, 4, 906);
INSERT INTO `payment_issue` VALUES(282, 4, 905);
INSERT INTO `payment_issue` VALUES(283, 4, 904);
INSERT INTO `payment_issue` VALUES(284, 4, 903);
INSERT INTO `payment_issue` VALUES(285, 4, 902);
INSERT INTO `payment_issue` VALUES(286, 4, 901);
INSERT INTO `payment_issue` VALUES(287, 4, 900);
INSERT INTO `payment_issue` VALUES(288, 4, 899);
INSERT INTO `payment_issue` VALUES(289, 4, 898);
INSERT INTO `payment_issue` VALUES(290, 4, 896);
INSERT INTO `payment_issue` VALUES(291, 4, 893);
INSERT INTO `payment_issue` VALUES(292, 4, 892);
INSERT INTO `payment_issue` VALUES(293, 4, 891);
INSERT INTO `payment_issue` VALUES(294, 4, 890);
INSERT INTO `payment_issue` VALUES(295, 4, 885);
INSERT INTO `payment_issue` VALUES(296, 4, 884);
INSERT INTO `payment_issue` VALUES(297, 4, 880);
INSERT INTO `payment_issue` VALUES(298, 4, 879);
INSERT INTO `payment_issue` VALUES(299, 4, 878);
INSERT INTO `payment_issue` VALUES(300, 4, 877);
INSERT INTO `payment_issue` VALUES(301, 4, 876);
INSERT INTO `payment_issue` VALUES(302, 4, 875);
INSERT INTO `payment_issue` VALUES(303, 4, 873);
INSERT INTO `payment_issue` VALUES(304, 4, 872);
INSERT INTO `payment_issue` VALUES(305, 4, 865);
INSERT INTO `payment_issue` VALUES(306, 4, 862);
INSERT INTO `payment_issue` VALUES(307, 4, 860);
INSERT INTO `payment_issue` VALUES(308, 4, 859);
INSERT INTO `payment_issue` VALUES(309, 4, 857);
INSERT INTO `payment_issue` VALUES(310, 4, 856);
INSERT INTO `payment_issue` VALUES(311, 4, 850);
INSERT INTO `payment_issue` VALUES(312, 4, 847);
INSERT INTO `payment_issue` VALUES(313, 4, 846);
INSERT INTO `payment_issue` VALUES(314, 4, 845);
INSERT INTO `payment_issue` VALUES(315, 4, 844);
INSERT INTO `payment_issue` VALUES(316, 4, 839);
INSERT INTO `payment_issue` VALUES(317, 4, 838);
INSERT INTO `payment_issue` VALUES(318, 4, 837);
INSERT INTO `payment_issue` VALUES(319, 4, 836);
INSERT INTO `payment_issue` VALUES(320, 4, 835);
INSERT INTO `payment_issue` VALUES(321, 4, 834);
INSERT INTO `payment_issue` VALUES(322, 4, 833);
INSERT INTO `payment_issue` VALUES(323, 4, 832);
INSERT INTO `payment_issue` VALUES(324, 4, 831);
INSERT INTO `payment_issue` VALUES(325, 4, 830);
INSERT INTO `payment_issue` VALUES(326, 4, 829);
INSERT INTO `payment_issue` VALUES(327, 4, 828);
INSERT INTO `payment_issue` VALUES(328, 4, 827);
INSERT INTO `payment_issue` VALUES(329, 4, 826);
INSERT INTO `payment_issue` VALUES(330, 4, 825);
INSERT INTO `payment_issue` VALUES(331, 4, 824);
INSERT INTO `payment_issue` VALUES(332, 4, 823);
INSERT INTO `payment_issue` VALUES(333, 4, 822);
INSERT INTO `payment_issue` VALUES(334, 4, 821);
INSERT INTO `payment_issue` VALUES(335, 4, 819);
INSERT INTO `payment_issue` VALUES(336, 4, 818);
INSERT INTO `payment_issue` VALUES(337, 4, 817);
INSERT INTO `payment_issue` VALUES(338, 4, 816);
INSERT INTO `payment_issue` VALUES(339, 4, 815);
INSERT INTO `payment_issue` VALUES(340, 4, 810);
INSERT INTO `payment_issue` VALUES(341, 4, 809);
INSERT INTO `payment_issue` VALUES(342, 4, 808);
INSERT INTO `payment_issue` VALUES(343, 4, 807);
INSERT INTO `payment_issue` VALUES(344, 4, 806);
INSERT INTO `payment_issue` VALUES(345, 4, 805);
INSERT INTO `payment_issue` VALUES(346, 4, 804);
INSERT INTO `payment_issue` VALUES(347, 4, 803);
INSERT INTO `payment_issue` VALUES(348, 4, 802);
INSERT INTO `payment_issue` VALUES(349, 4, 801);
INSERT INTO `payment_issue` VALUES(350, 4, 800);
INSERT INTO `payment_issue` VALUES(351, 5, 923);
INSERT INTO `payment_issue` VALUES(352, 5, 922);
INSERT INTO `payment_issue` VALUES(353, 5, 921);
INSERT INTO `payment_issue` VALUES(354, 5, 920);
INSERT INTO `payment_issue` VALUES(355, 5, 919);
INSERT INTO `payment_issue` VALUES(356, 5, 918);
INSERT INTO `payment_issue` VALUES(357, 5, 915);
INSERT INTO `payment_issue` VALUES(358, 5, 914);
INSERT INTO `payment_issue` VALUES(359, 5, 913);
INSERT INTO `payment_issue` VALUES(360, 5, 912);
INSERT INTO `payment_issue` VALUES(361, 5, 911);
INSERT INTO `payment_issue` VALUES(362, 5, 906);
INSERT INTO `payment_issue` VALUES(363, 5, 905);
INSERT INTO `payment_issue` VALUES(364, 5, 904);
INSERT INTO `payment_issue` VALUES(365, 5, 903);
INSERT INTO `payment_issue` VALUES(366, 5, 902);
INSERT INTO `payment_issue` VALUES(367, 5, 901);
INSERT INTO `payment_issue` VALUES(368, 5, 900);
INSERT INTO `payment_issue` VALUES(369, 5, 899);
INSERT INTO `payment_issue` VALUES(370, 5, 898);
INSERT INTO `payment_issue` VALUES(371, 5, 896);
INSERT INTO `payment_issue` VALUES(372, 5, 893);
INSERT INTO `payment_issue` VALUES(373, 5, 892);
INSERT INTO `payment_issue` VALUES(374, 5, 891);
INSERT INTO `payment_issue` VALUES(375, 5, 890);
INSERT INTO `payment_issue` VALUES(376, 5, 885);
INSERT INTO `payment_issue` VALUES(377, 5, 884);
INSERT INTO `payment_issue` VALUES(378, 5, 880);
INSERT INTO `payment_issue` VALUES(379, 5, 879);
INSERT INTO `payment_issue` VALUES(380, 5, 878);
INSERT INTO `payment_issue` VALUES(381, 5, 877);
INSERT INTO `payment_issue` VALUES(382, 5, 876);
INSERT INTO `payment_issue` VALUES(383, 5, 875);
INSERT INTO `payment_issue` VALUES(384, 5, 873);
INSERT INTO `payment_issue` VALUES(385, 5, 872);
INSERT INTO `payment_issue` VALUES(386, 5, 865);
INSERT INTO `payment_issue` VALUES(387, 5, 862);
INSERT INTO `payment_issue` VALUES(388, 5, 860);
INSERT INTO `payment_issue` VALUES(389, 5, 859);
INSERT INTO `payment_issue` VALUES(390, 5, 857);
INSERT INTO `payment_issue` VALUES(391, 5, 856);
INSERT INTO `payment_issue` VALUES(392, 5, 850);
INSERT INTO `payment_issue` VALUES(393, 5, 847);
INSERT INTO `payment_issue` VALUES(394, 5, 846);
INSERT INTO `payment_issue` VALUES(395, 5, 845);
INSERT INTO `payment_issue` VALUES(396, 5, 844);
INSERT INTO `payment_issue` VALUES(397, 5, 839);
INSERT INTO `payment_issue` VALUES(398, 5, 838);
INSERT INTO `payment_issue` VALUES(399, 5, 837);
INSERT INTO `payment_issue` VALUES(400, 5, 836);
INSERT INTO `payment_issue` VALUES(401, 5, 835);
INSERT INTO `payment_issue` VALUES(402, 5, 834);
INSERT INTO `payment_issue` VALUES(403, 5, 833);
INSERT INTO `payment_issue` VALUES(404, 5, 832);
INSERT INTO `payment_issue` VALUES(405, 5, 831);
INSERT INTO `payment_issue` VALUES(406, 5, 830);
INSERT INTO `payment_issue` VALUES(407, 5, 829);
INSERT INTO `payment_issue` VALUES(408, 5, 828);
INSERT INTO `payment_issue` VALUES(409, 5, 827);
INSERT INTO `payment_issue` VALUES(410, 5, 826);
INSERT INTO `payment_issue` VALUES(411, 5, 825);
INSERT INTO `payment_issue` VALUES(412, 5, 824);
INSERT INTO `payment_issue` VALUES(413, 5, 823);
INSERT INTO `payment_issue` VALUES(414, 5, 822);
INSERT INTO `payment_issue` VALUES(415, 5, 821);
INSERT INTO `payment_issue` VALUES(416, 5, 819);
INSERT INTO `payment_issue` VALUES(417, 5, 818);
INSERT INTO `payment_issue` VALUES(418, 5, 817);
INSERT INTO `payment_issue` VALUES(419, 5, 816);
INSERT INTO `payment_issue` VALUES(420, 5, 815);
INSERT INTO `payment_issue` VALUES(421, 5, 810);
INSERT INTO `payment_issue` VALUES(422, 5, 809);
INSERT INTO `payment_issue` VALUES(423, 5, 808);
INSERT INTO `payment_issue` VALUES(424, 5, 807);
INSERT INTO `payment_issue` VALUES(425, 5, 806);
INSERT INTO `payment_issue` VALUES(426, 5, 805);
INSERT INTO `payment_issue` VALUES(427, 5, 804);
INSERT INTO `payment_issue` VALUES(428, 5, 803);
INSERT INTO `payment_issue` VALUES(429, 5, 802);
INSERT INTO `payment_issue` VALUES(430, 5, 801);
INSERT INTO `payment_issue` VALUES(431, 5, 800);
INSERT INTO `payment_issue` VALUES(432, 6, 923);
INSERT INTO `payment_issue` VALUES(433, 6, 922);
INSERT INTO `payment_issue` VALUES(434, 6, 921);
INSERT INTO `payment_issue` VALUES(435, 6, 920);
INSERT INTO `payment_issue` VALUES(436, 6, 919);
INSERT INTO `payment_issue` VALUES(437, 6, 918);
INSERT INTO `payment_issue` VALUES(438, 6, 916);
INSERT INTO `payment_issue` VALUES(439, 6, 915);
INSERT INTO `payment_issue` VALUES(440, 6, 914);
INSERT INTO `payment_issue` VALUES(441, 6, 913);
INSERT INTO `payment_issue` VALUES(442, 6, 912);
INSERT INTO `payment_issue` VALUES(443, 6, 911);
INSERT INTO `payment_issue` VALUES(444, 6, 906);
INSERT INTO `payment_issue` VALUES(445, 6, 905);
INSERT INTO `payment_issue` VALUES(446, 6, 904);
INSERT INTO `payment_issue` VALUES(447, 6, 903);
INSERT INTO `payment_issue` VALUES(448, 6, 902);
INSERT INTO `payment_issue` VALUES(449, 6, 901);
INSERT INTO `payment_issue` VALUES(450, 6, 900);
INSERT INTO `payment_issue` VALUES(451, 6, 899);
INSERT INTO `payment_issue` VALUES(452, 6, 898);
INSERT INTO `payment_issue` VALUES(453, 6, 896);
INSERT INTO `payment_issue` VALUES(454, 6, 893);
INSERT INTO `payment_issue` VALUES(455, 6, 892);
INSERT INTO `payment_issue` VALUES(456, 6, 891);
INSERT INTO `payment_issue` VALUES(457, 6, 890);
INSERT INTO `payment_issue` VALUES(458, 6, 885);
INSERT INTO `payment_issue` VALUES(459, 6, 884);
INSERT INTO `payment_issue` VALUES(460, 6, 880);
INSERT INTO `payment_issue` VALUES(461, 6, 879);
INSERT INTO `payment_issue` VALUES(462, 6, 878);
INSERT INTO `payment_issue` VALUES(463, 6, 877);
INSERT INTO `payment_issue` VALUES(464, 6, 876);
INSERT INTO `payment_issue` VALUES(465, 6, 875);
INSERT INTO `payment_issue` VALUES(466, 6, 873);
INSERT INTO `payment_issue` VALUES(467, 6, 872);
INSERT INTO `payment_issue` VALUES(468, 6, 865);
INSERT INTO `payment_issue` VALUES(469, 6, 862);
INSERT INTO `payment_issue` VALUES(470, 6, 860);
INSERT INTO `payment_issue` VALUES(471, 6, 859);
INSERT INTO `payment_issue` VALUES(472, 6, 857);
INSERT INTO `payment_issue` VALUES(473, 6, 856);
INSERT INTO `payment_issue` VALUES(474, 6, 850);
INSERT INTO `payment_issue` VALUES(475, 6, 847);
INSERT INTO `payment_issue` VALUES(476, 6, 846);
INSERT INTO `payment_issue` VALUES(477, 6, 845);
INSERT INTO `payment_issue` VALUES(478, 6, 844);
INSERT INTO `payment_issue` VALUES(479, 6, 839);
INSERT INTO `payment_issue` VALUES(480, 6, 838);
INSERT INTO `payment_issue` VALUES(481, 6, 837);
INSERT INTO `payment_issue` VALUES(482, 6, 836);
INSERT INTO `payment_issue` VALUES(483, 6, 835);
INSERT INTO `payment_issue` VALUES(484, 6, 834);
INSERT INTO `payment_issue` VALUES(485, 6, 833);
INSERT INTO `payment_issue` VALUES(486, 6, 832);
INSERT INTO `payment_issue` VALUES(487, 6, 831);
INSERT INTO `payment_issue` VALUES(488, 6, 830);
INSERT INTO `payment_issue` VALUES(489, 6, 829);
INSERT INTO `payment_issue` VALUES(490, 6, 828);
INSERT INTO `payment_issue` VALUES(491, 6, 827);
INSERT INTO `payment_issue` VALUES(492, 6, 826);
INSERT INTO `payment_issue` VALUES(493, 6, 825);
INSERT INTO `payment_issue` VALUES(494, 6, 824);
INSERT INTO `payment_issue` VALUES(495, 6, 823);
INSERT INTO `payment_issue` VALUES(496, 6, 822);
INSERT INTO `payment_issue` VALUES(497, 6, 821);
INSERT INTO `payment_issue` VALUES(498, 6, 819);
INSERT INTO `payment_issue` VALUES(499, 6, 818);
INSERT INTO `payment_issue` VALUES(500, 6, 817);
INSERT INTO `payment_issue` VALUES(501, 6, 816);
INSERT INTO `payment_issue` VALUES(502, 6, 815);
INSERT INTO `payment_issue` VALUES(503, 6, 810);
INSERT INTO `payment_issue` VALUES(504, 6, 809);
INSERT INTO `payment_issue` VALUES(505, 6, 808);
INSERT INTO `payment_issue` VALUES(506, 6, 807);
INSERT INTO `payment_issue` VALUES(507, 6, 806);
INSERT INTO `payment_issue` VALUES(508, 6, 805);
INSERT INTO `payment_issue` VALUES(509, 6, 804);
INSERT INTO `payment_issue` VALUES(510, 6, 803);
INSERT INTO `payment_issue` VALUES(511, 6, 802);
INSERT INTO `payment_issue` VALUES(512, 6, 801);
INSERT INTO `payment_issue` VALUES(513, 6, 800);
INSERT INTO `payment_issue` VALUES(514, 7, 810);
INSERT INTO `payment_issue` VALUES(515, 7, 809);
INSERT INTO `payment_issue` VALUES(516, 7, 808);
INSERT INTO `payment_issue` VALUES(517, 7, 807);
INSERT INTO `payment_issue` VALUES(518, 7, 806);
INSERT INTO `payment_issue` VALUES(519, 7, 804);
INSERT INTO `payment_issue` VALUES(520, 7, 803);
INSERT INTO `payment_issue` VALUES(521, 7, 802);
INSERT INTO `payment_issue` VALUES(522, 7, 801);
INSERT INTO `payment_issue` VALUES(523, 7, 800);
INSERT INTO `payment_issue` VALUES(524, 8, 871);
INSERT INTO `payment_issue` VALUES(525, 8, 866);
INSERT INTO `payment_issue` VALUES(526, 8, 864);
INSERT INTO `payment_issue` VALUES(527, 8, 863);
INSERT INTO `payment_issue` VALUES(528, 8, 861);
INSERT INTO `payment_issue` VALUES(529, 8, 858);
INSERT INTO `payment_issue` VALUES(530, 8, 820);
INSERT INTO `payment_issue` VALUES(531, 9, 907);
INSERT INTO `payment_issue` VALUES(532, 9, 897);
INSERT INTO `payment_issue` VALUES(533, 9, 871);
INSERT INTO `payment_issue` VALUES(534, 9, 866);
INSERT INTO `payment_issue` VALUES(535, 9, 864);
INSERT INTO `payment_issue` VALUES(536, 9, 863);
INSERT INTO `payment_issue` VALUES(537, 9, 861);
INSERT INTO `payment_issue` VALUES(538, 9, 858);
INSERT INTO `payment_issue` VALUES(539, 9, 820);
INSERT INTO `payment_issue` VALUES(540, 10, 917);
INSERT INTO `payment_issue` VALUES(541, 10, 910);
INSERT INTO `payment_issue` VALUES(542, 10, 907);
INSERT INTO `payment_issue` VALUES(543, 10, 897);
INSERT INTO `payment_issue` VALUES(544, 10, 871);
INSERT INTO `payment_issue` VALUES(545, 10, 866);
INSERT INTO `payment_issue` VALUES(546, 10, 864);
INSERT INTO `payment_issue` VALUES(547, 10, 863);
INSERT INTO `payment_issue` VALUES(548, 10, 861);
INSERT INTO `payment_issue` VALUES(549, 10, 858);
INSERT INTO `payment_issue` VALUES(550, 10, 820);
INSERT INTO `payment_issue` VALUES(698, 12, 916);
INSERT INTO `payment_issue` VALUES(697, 12, 920);
INSERT INTO `payment_issue` VALUES(696, 12, 921);
INSERT INTO `payment_issue` VALUES(695, 12, 922);
INSERT INTO `payment_issue` VALUES(694, 12, 924);
INSERT INTO `payment_issue` VALUES(693, 12, 929);
INSERT INTO `payment_issue` VALUES(692, 12, 935);
INSERT INTO `payment_issue` VALUES(691, 12, 939);
INSERT INTO `payment_issue` VALUES(690, 12, 948);
INSERT INTO `payment_issue` VALUES(689, 12, 949);
INSERT INTO `payment_issue` VALUES(688, 12, 952);
INSERT INTO `payment_issue` VALUES(687, 12, 987);
INSERT INTO `payment_issue` VALUES(686, 12, 990);
INSERT INTO `payment_issue` VALUES(685, 12, 991);
INSERT INTO `payment_issue` VALUES(684, 12, 992);
INSERT INTO `payment_issue` VALUES(683, 12, 1002);
INSERT INTO `payment_issue` VALUES(682, 12, 1003);
INSERT INTO `payment_issue` VALUES(681, 12, 1005);
INSERT INTO `payment_issue` VALUES(680, 12, 1006);
INSERT INTO `payment_issue` VALUES(679, 12, 1007);
INSERT INTO `payment_issue` VALUES(678, 12, 1022);
INSERT INTO `payment_issue` VALUES(677, 12, 1023);
INSERT INTO `payment_issue` VALUES(676, 12, 1025);
INSERT INTO `payment_issue` VALUES(675, 12, 1026);
INSERT INTO `payment_issue` VALUES(674, 12, 1027);
INSERT INTO `payment_issue` VALUES(673, 12, 1029);
INSERT INTO `payment_issue` VALUES(672, 12, 1038);
INSERT INTO `payment_issue` VALUES(671, 11, 815);
INSERT INTO `payment_issue` VALUES(670, 11, 816);
INSERT INTO `payment_issue` VALUES(669, 11, 818);
INSERT INTO `payment_issue` VALUES(668, 11, 819);
INSERT INTO `payment_issue` VALUES(667, 11, 822);
INSERT INTO `payment_issue` VALUES(666, 11, 823);
INSERT INTO `payment_issue` VALUES(665, 11, 825);
INSERT INTO `payment_issue` VALUES(664, 11, 826);
INSERT INTO `payment_issue` VALUES(663, 11, 828);
INSERT INTO `payment_issue` VALUES(662, 11, 830);
INSERT INTO `payment_issue` VALUES(661, 11, 831);
INSERT INTO `payment_issue` VALUES(660, 11, 832);
INSERT INTO `payment_issue` VALUES(659, 11, 834);
INSERT INTO `payment_issue` VALUES(658, 11, 835);
INSERT INTO `payment_issue` VALUES(657, 11, 837);
INSERT INTO `payment_issue` VALUES(656, 11, 838);
INSERT INTO `payment_issue` VALUES(655, 11, 839);
INSERT INTO `payment_issue` VALUES(654, 11, 844);
INSERT INTO `payment_issue` VALUES(653, 11, 845);
INSERT INTO `payment_issue` VALUES(652, 11, 846);
INSERT INTO `payment_issue` VALUES(651, 11, 847);
INSERT INTO `payment_issue` VALUES(650, 11, 850);
INSERT INTO `payment_issue` VALUES(649, 11, 856);
INSERT INTO `payment_issue` VALUES(648, 11, 857);
INSERT INTO `payment_issue` VALUES(647, 11, 859);
INSERT INTO `payment_issue` VALUES(646, 11, 860);
INSERT INTO `payment_issue` VALUES(645, 11, 862);
INSERT INTO `payment_issue` VALUES(644, 11, 865);
INSERT INTO `payment_issue` VALUES(643, 11, 875);
INSERT INTO `payment_issue` VALUES(642, 11, 876);
INSERT INTO `payment_issue` VALUES(641, 11, 878);
INSERT INTO `payment_issue` VALUES(640, 11, 879);
INSERT INTO `payment_issue` VALUES(639, 11, 884);
INSERT INTO `payment_issue` VALUES(638, 11, 885);
INSERT INTO `payment_issue` VALUES(637, 11, 891);
INSERT INTO `payment_issue` VALUES(636, 11, 896);
INSERT INTO `payment_issue` VALUES(635, 11, 898);
INSERT INTO `payment_issue` VALUES(634, 11, 899);
INSERT INTO `payment_issue` VALUES(633, 11, 900);
INSERT INTO `payment_issue` VALUES(632, 11, 902);
INSERT INTO `payment_issue` VALUES(631, 11, 903);
INSERT INTO `payment_issue` VALUES(630, 11, 906);
INSERT INTO `payment_issue` VALUES(629, 11, 912);
INSERT INTO `payment_issue` VALUES(628, 11, 913);
INSERT INTO `payment_issue` VALUES(627, 11, 914);
INSERT INTO `payment_issue` VALUES(626, 11, 918);
INSERT INTO `payment_issue` VALUES(625, 11, 919);
INSERT INTO `payment_issue` VALUES(699, 12, 911);
INSERT INTO `payment_issue` VALUES(700, 12, 905);
INSERT INTO `payment_issue` VALUES(701, 12, 901);
INSERT INTO `payment_issue` VALUES(702, 12, 893);
INSERT INTO `payment_issue` VALUES(703, 12, 892);
INSERT INTO `payment_issue` VALUES(704, 12, 880);
INSERT INTO `payment_issue` VALUES(705, 12, 877);
INSERT INTO `payment_issue` VALUES(706, 12, 827);
INSERT INTO `payment_issue` VALUES(707, 12, 817);
INSERT INTO `payment_issue` VALUES(708, 12, 805);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(125) collate utf8_unicode_ci NOT NULL,
  `description` longtext collate utf8_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `complete_percent` tinyint(2) NOT NULL,
  `project_status_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `creator_id` int(11) NOT NULL,
  `modified` datetime NOT NULL,
  `rate` float default NULL,
  `support_time` float default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=153 ;

--
-- Dumping data for table `project`
--

INSERT INTO `project` VALUES(75, 'SISSUE', '<p>\r\n	<strong>sIssue </strong>is a project management system that provide the easy way to manage all your projects.</p>\r\n<p>\r\n	&nbsp;</p>\r\n<p>\r\n	svn://50.23.201.244/projects/sissue</p>\r\n', '2012-07-30', '2012-07-30', 72, 2, '2012-07-30 00:00:00', 25, '2012-10-31 10:12:59', NULL, NULL);
INSERT INTO `project` VALUES(86, 'SNDMobile', '', '2012-08-20', '2012-09-20', 95, 2, '2012-08-20 00:00:00', 25, '2012-08-20 11:45:19', NULL, NULL);
INSERT INTO `project` VALUES(87, 'IPROFIT', '<p>\r\n	<strong>What iProfit is:</strong></p>\r\n<p>\r\n	iProfit is a reporting system that connects to a business existing accounting package, imports the data and then presents a series of financial reports.</p>\r\n<p>\r\n	The business owner can then do a number of things based on this data.</p>\r\n<p>\r\n	1.&nbsp;&nbsp;&nbsp; They can set KPI&rsquo;s (key performance indicators) for different financial reports</p>\r\n<p>\r\n	2.&nbsp;&nbsp;&nbsp; They can receive alerts when this KPI&rsquo;s are not met</p>\r\n<p>\r\n	3.&nbsp;&nbsp;&nbsp; They can do &ldquo;What if scenarios&rdquo;</p>\r\n', '2012-08-27', '2012-09-27', 100, 2, '2012-08-27 00:00:00', 25, '2012-10-16 08:34:56', NULL, NULL);
INSERT INTO `project` VALUES(89, 'KUDUBIDS', '', '2012-09-17', '2013-09-17', 95, 2, '2012-09-17 00:00:00', 25, '2012-09-17 10:17:01', NULL, NULL);
INSERT INTO `project` VALUES(90, 'INNERDEVIANT', '', '2012-10-15', '2013-01-15', 67, 2, '2012-10-15 00:00:00', 25, '2012-10-15 10:06:04', NULL, NULL);
INSERT INTO `project` VALUES(99, 'MARK', '<p>\r\n	small projects from Mark</p>\r\n', '2012-10-25', '2012-10-31', 60, 2, '2012-10-25 00:00:00', 25, '2012-12-31 10:51:41', NULL, NULL);
INSERT INTO `project` VALUES(101, 'ROB SILVA', '<p>\r\n	Some urgent tasks of rob silva</p>\r\n', '2012-10-25', '2013-11-15', 78, 2, '2012-10-25 00:00:00', 25, '2012-10-25 20:48:32', NULL, NULL);
INSERT INTO `project` VALUES(93, 'TASTEGURU', '', '2012-10-17', '2012-12-06', 85, 2, '2012-10-17 00:00:00', 34, '2012-10-17 07:57:34', NULL, NULL);
INSERT INTO `project` VALUES(102, 'FREEARABS', '<p>\r\n	<strong>Cpanel:</strong><br />\r\n	<br />\r\n	freearabs.com/cpanel<br />\r\n	username: freearabs.com<br />\r\n	pass: 1Free2Arabs3Soon!<br />\r\n	<br />\r\n	<strong>Ftp:</strong><br />\r\n	<br />\r\n	url: freearabs.com<br />\r\n	username: vectra@freearabs.com<br />\r\n	pass: 1freearabs2<br />\r\n	<br />\r\n	<br />\r\n	<strong>Admin:</strong><br />\r\n	<br />\r\n	username: tien<br />\r\n	password: trinhcongson</p>\r\n', '2012-10-28', '2014-03-19', 87, 1, '2012-10-28 00:00:00', 25, '2013-09-24 15:24:36', NULL, NULL);
INSERT INTO `project` VALUES(104, 'FUNDS', '<p>\r\n	http://fundsforyourprojects.com</p>\r\n<p>\r\n	svn://50.23.201.244/projects/funds</p>\r\n<div id="cke_pastebin">\r\n	cpanel:</div>\r\n<div id="cke_pastebin">\r\n	&nbsp;</div>\r\n<div id="cke_pastebin">\r\n	http://fundsforyourprojects.com/cpanel</div>\r\n<div id="cke_pastebin">\r\n	user: funds&nbsp;</div>\r\n<div id="cke_pastebin">\r\n	password: 123qweasd/.</div>\r\n<div id="cke_pastebin">\r\n	&nbsp;</div>\r\n<div id="cke_pastebin">\r\n	ftp:</div>\r\n<div id="cke_pastebin">\r\n	&nbsp;</div>\r\n<div id="cke_pastebin">\r\n	ftp.fundsforyourprojects.com</div>\r\n<div id="cke_pastebin">\r\n	user: funds&nbsp;</div>\r\n<div id="cke_pastebin">\r\n	password: 123qweasd/.</div>\r\n', '2012-10-29', '2013-10-29', 94, 2, '2012-10-29 00:00:00', 25, '2012-10-31 15:07:53', NULL, NULL);
INSERT INTO `project` VALUES(111, 'THEME', '', '2012-11-29', '2013-11-29', 0, 2, '2012-11-29 00:00:00', 25, '2012-11-29 08:47:54', NULL, NULL);
INSERT INTO `project` VALUES(131, 'NEIGHBORHOOD', '<p>\r\n	FTP:</p>\r\n<p>\r\n	Host: perambulator.com</p>\r\n<p>\r\n	Username: ambul</p>\r\n<p>\r\n	Password: p@rcel</p>\r\n<p>\r\n	&nbsp;</p>\r\n<p>\r\n	ADMIN SITE:</p>\r\n<p>\r\n	<a href="http://perambulator.com/wp-admin/">http://perambulator.com/wp-admin/</a></p>\r\n<p>\r\n	User name: admin</p>\r\n<p>\r\n	Password: pl@ce</p>\r\n', '2013-12-15', '2014-12-15', 83, 1, '2013-12-15 00:00:00', 25, '2013-12-15 17:34:23', NULL, NULL);
INSERT INTO `project` VALUES(113, 'THE KRYPT', '<p>\r\n	CPANEL:</p>\r\n<p>\r\n	url: https://rsb21.rhostbh.com:2083</p>\r\n<p>\r\n	username: thekryp1</p>\r\n<p>\r\n	pass: u@s[{fz#4K#;</p>\r\n<p>\r\n	DATABASE:</p>\r\n<p>\r\n	database name: thekryp1_db</p>\r\n<p>\r\n	username: thekryp1_user</p>\r\n<p>\r\n	pass: J^]f~&amp;]VTXg$</p>\r\n<p>\r\n	&nbsp;</p>\r\n<p style="color: rgb(34, 34, 34); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px;">\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">The development environment is setup here:</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<a href="http://50.87.52.97/~thekryp1/" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">http://50.87.52.97/~thekryp1/</a></p>\r\n<p style="color: rgb(34, 34, 34); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px;">\r\n	svn://50.23.201.244/projects2/thekrypt</p>\r\n', '2012-12-28', '2013-12-28', 13, 2, '2012-12-28 00:00:00', 25, '2012-12-28 09:58:16', NULL, NULL);
INSERT INTO `project` VALUES(119, 'ESTORE', '<p>\r\n	Phan mem quan ly ban hang dien dan dung</p>\r\n', '2013-09-10', '2014-09-10', 81, 2, '2013-09-10 00:00:00', 25, '2013-09-18 21:54:05', NULL, NULL);
INSERT INTO `project` VALUES(121, 'GREATCHEFS', '<p>\r\n	greatchefs.com/administrator<br />\r\n	tien<br />\r\n	1Temporary2<br />\r\n	<br />\r\n	MediaTemple:<br />\r\n	7756-c6w5.accessdomain.com<br />\r\n	shoup@greatchefs.com<br />\r\n	Web4You3<br />\r\n	<br />\r\n	Plesk<br />\r\n	https://205.186.138.207:8443/login_up.php3<br />\r\n	admin<br />\r\n	toUrney_13!<br />\r\n	<br />\r\n	FTP<br />\r\n	rob<br />\r\n	toUrney_13!<br />\r\n	<br />\r\n	Layout changes:<br />\r\n	If you need to change anything in the CSS, know that I use LESS.<br />\r\n	Attached please find the less files. You only need to change gantry-custom.less (the other two get imported automatically -- make sure they are in the same folder.)<br />\r\n	I use crunch to compile the .less file into gantry-custom.css<br />\r\n	http://crunchapp.net/<br />\r\n	<br />\r\n	Root password:<br />\r\n	root<br />\r\n	1Temporary2!<br />\r\n	<br />\r\n	The shopping cart used on the site is MijoShop (Open Cart) - We bought it.<br />\r\n	I wouldn&#39;t update it. We have customized the upload plugin to allow multiple uploads. I am afraid updating it will break things.<br />\r\n	If you need access to the support / guides:<br />\r\n	http://mijosoft.com/downloads/my-downloads<br />\r\n	user: vectracreative<br />\r\n	pass: 6aebe2c9b6</p>\r\n', '2013-09-12', '2014-09-12', 61, 2, '2013-09-12 00:00:00', 25, '2013-09-12 20:41:19', NULL, NULL);
INSERT INTO `project` VALUES(122, 'NYAPP', '<p>\r\n	LOGIN INFORS:</p>\r\n<p>\r\n	login to the wordpress control panel for nyappsales is at nyappsales.com/wp-login.php<br />\r\n	admin<br />\r\n	my3sons</p>\r\n<p>\r\n	<br />\r\n	leading into recurly payment pages<br />\r\n	Recurly login for this company<br />\r\n	info@nyappsales.com<br />\r\n	Donna1130!</p>\r\n<p>\r\n	<br />\r\n	https://nyappsales.signin.aws.amazon.com/console<br />\r\n	Username: Tien<br />\r\n	Pass:<br />\r\n	YR8lBNnYnLpe</p>\r\n<p>\r\n	salesforce.com<br />\r\n	User: mario@nyappsales.com<br />\r\n	Pass: Donna1130</p>\r\n', '2013-09-13', '2014-09-13', 92, 2, '2013-09-13 00:00:00', 25, '2013-09-13 12:57:00', NULL, NULL);
INSERT INTO `project` VALUES(123, 'CARNISM', '<div id="cke_pastebin">\r\n	<div id="cke_pastebin">\r\n		Admin site: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; http://www.carnism.org/administrator/</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; user: tien</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; pass: 1Temporary2</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		Cpanel:</div>\r\n	<div id="cke_pastebin">\r\n		home2 for .com</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; https://rsb21.rhostbh.com:2083</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; carnismc</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; v6T(uSW.o34M</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		home6: current site for .org</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		https://rsb21.rhostbh.com:2083</div>\r\n	<div id="cke_pastebin">\r\n		carnismo</div>\r\n	<div id="cke_pastebin">\r\n		a~#}CM=-QP({</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div>\r\n		home5 for .eu</div>\r\n	<div>\r\n		&nbsp;</div>\r\n	<div>\r\n		https://rsb21.rhostbh.com:2083</div>\r\n	<div>\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">user:&nbsp;carnisme</span>\r\n		<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n			pass:&nbsp;nnoD!8^]H~5-</div>\r\n	</div>\r\n	<div>\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		Database:</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; public $user = &#39;carnismc_juser&#39;;</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; public $password = &#39;H[!)F8fEKib.&#39;;</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; public $db = &#39;carnismc_joomla&#39;;</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp; &nbsp; &nbsp; &nbsp; public $dbprefix = &#39;dlpx8_&#39;;</div>\r\n</div>\r\n', '2013-09-13', '2014-09-13', 64, 2, '2013-09-13 00:00:00', 25, '2013-10-10 22:42:59', NULL, NULL);
INSERT INTO `project` VALUES(127, 'NEWTON', '<p>\r\n	Opennewtonschools.org/<wbr>administrator</wbr></p>\r\n<p>\r\n	<wbr>\r\n	<p>\r\n		Cj</p>\r\n	<p>\r\n		Brothers28</p>\r\n	<p>\r\n		&nbsp;</p>\r\n	<p>\r\n		Server is:</p>\r\n	<p>\r\n		&nbsp;</p>\r\n	<p>\r\n		<a href="https://d147.3essentials.com:8443/" target="_blank">https://d147.3essentials.com:<wbr>8443</wbr></a></p>\r\n	<wbr>\r\n	<p>\r\n		user: cp29189</p>\r\n	<p>\r\n		<wbr><wbr><wbr><wbr></wbr></wbr></wbr></wbr></p>\r\n	<wbr><wbr><wbr><wbr>\r\n	<p>\r\n		pass: Brothers</p>\r\n	</wbr></wbr></wbr></wbr></wbr></wbr></p>\r\n', '2013-10-23', '2014-10-23', 70, 2, '2013-10-23 00:00:00', 25, '2013-10-23 23:13:51', NULL, NULL);
INSERT INTO `project` VALUES(128, 'PAT', '<p>\r\n	http://peaceandtolerance.org/</p>\r\n<p>\r\n	User: ilya</p>\r\n<p>\r\n	Pass: Brothers28</p>\r\n', '2013-10-24', '2014-10-24', 90, 2, '2013-10-24 00:00:00', 25, '2013-10-24 07:17:31', NULL, NULL);
INSERT INTO `project` VALUES(129, 'MYCOMEUP', '<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n	<span style="font-family: sans-serif; background-color: rgb(235, 245, 251);">Your Domain:&nbsp;</span><a href="http://mycomeup.com/" style="color: rgb(17, 85, 204); font-family: sans-serif; background-color: rgb(235, 245, 251);" target="_blank">mycomeup.com</a></div>\r\n<p>\r\n	<span style="font-size: 13px; font-family: sans-serif; background-color: rgb(235, 245, 251);">Your Username: root</span><br style="font-size: 13px; font-family: sans-serif; background-color: rgb(235, 245, 251);" />\r\n	<span style="font-size: 13px; font-family: sans-serif; background-color: rgb(235, 245, 251);">Your Password: 8tAEM3GDonlHqiMBPrRv</span><br style="font-size: 13px; font-family: sans-serif; background-color: rgb(235, 245, 251);" />\r\n	<span style="font-size: 13px; font-family: sans-serif; background-color: rgb(235, 245, 251);">Your Server IP Address: 162.144.39.146</span></p>\r\n<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n	<font face="sans-serif"><span style="background-color: rgb(235, 245, 251);"><br />\r\n	</span></font></div>\r\n<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n	<font face="sans-serif"><span style="background-color: rgb(235, 245, 251);">please use link to get to Cpanel below</span></font></div>\r\n<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n	<font face="sans-serif"><span style="background-color: rgb(235, 245, 251);"><br />\r\n	</span></font></div>\r\n<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n	<a href="https://162.144.39.146:2087/" style="color: rgb(17, 85, 204); font-family: sans-serif; background-color: rgb(235, 245, 251);" target="_blank">https://162.144.39.146:2087</a></div>\r\n', '2013-10-29', '2014-10-29', 69, 2, '2013-10-29 00:00:00', 25, '2013-11-06 08:00:52', NULL, NULL);
INSERT INTO `project` VALUES(130, 'SHUFING', '<p>\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">Bluehost CPanel</span></p>\r\n<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n	&nbsp;</div>\r\n<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n	<p>\r\n		<a href="https://rsb21.rhostbh.com:2083/logout/?locale=en" style="color: rgb(17, 85, 204);" target="_blank">https://rsb21.rhostbh.com:<wbr>2083</wbr></a></p>\r\n	<p>\r\n		UN:&nbsp;shurfing</p>\r\n	<div>\r\n		PW:&nbsp;Amsterdam1</div>\r\n</div>\r\n<p>\r\n	<wbr>\r\n	<p>\r\n		<wbr></wbr></p>\r\n	<wbr>\r\n	<p>\r\n		<wbr> </wbr></p>\r\n	<wbr><wbr>\r\n	<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n		&nbsp;</div>\r\n	<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n		Please create db for the site in there.</div>\r\n	<p>\r\n		<wbr></wbr></p>\r\n	<wbr><wbr><wbr>\r\n	<div style="font-family: arial, sans-serif; font-size: 13px;">\r\n		Don&#39;t delete the DB that is there now. I am using it for a project management software at<a href="http://shurfing.com/pms" style="color: rgb(17, 85, 204);" target="_blank">shurfing.com/pms</a>&nbsp;:)</div>\r\n	<p>\r\n		&nbsp;</p>\r\n	<p>\r\n		&nbsp;</p>\r\n	</wbr></wbr></wbr></wbr></wbr></wbr></wbr></p>\r\n', '2013-10-30', '2014-10-30', 0, 2, '2013-10-30 00:00:00', 25, '2013-10-30 08:08:30', NULL, NULL);
INSERT INTO `project` VALUES(125, 'NOWFORCE', '<div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255);">\r\n	The idea is similar to this website<span class="Apple-converted-space">&nbsp;</span><a href="http://nowforce.com/" style="color: rgb(17, 85, 204);" target="_blank">nowforce.com</a></div>\r\n<div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255);">\r\n	We want to integrate tracking of personnel and clients into the portal. In essence to have a service that includes the portal and gps tracking in one. If a client is in a particular location then he will get relevant intel as well as us being able to monitor his movement for safety.</div>\r\n', '2013-09-22', '2014-09-22', 0, 1, '2013-09-22 00:00:00', 25, '2013-09-22 18:35:57', NULL, NULL);
INSERT INTO `project` VALUES(126, 'TAM-C', '<div id="cke_pastebin">\r\n	<div>\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">FTP:</span></div>\r\n	<div>\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">host:&nbsp;</span><a href="http://www.tamcglobal.com/" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">www.tamcglobal.com</a><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">user: wisegeneral</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">pass: SFsAuyQ#</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">host:&nbsp;</span><a href="http://www.tamc365.com/" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">www.tamc365.com</a><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">user: tamc365wp</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">pass: vg#58xXK</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">phpMyAdmin:</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<a href="http://www.tamc365.com/dbadmin" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">http://www.tamc365.com/dbadmin</a><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">user: tamc365</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">pass: feDe#VzU</span></div>\r\n	<div>\r\n		&nbsp;</div>\r\n	<div>\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">host:&nbsp;</span><a href="http://quartz.onyxlight.net/" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">quartz.onyxlight.net</a><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">user: onlineepi</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">pass: h$wG5n3g</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">The database login is:</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">host: localhost</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">user: onlineepi</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">pass: ZGzA8eQN</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">dbname: onlineepi</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">I also added a phpMyAdmin for you:</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<a href="http://www.onlineepi.com/dbadmin" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">http://www.onlineepi.com/<wbr>dbadmin</wbr></a><wbr><wbr><wbr><wbr><wbr><wbr><wbr><wbr><wbr><wbr><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">user: onlineepi</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">pass: ZGzA8eQN</span></wbr></wbr></wbr></wbr></wbr></wbr></wbr></wbr></wbr></wbr></div>\r\n	<div>\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		FTP:</div>\r\n	<div id="cke_pastebin">\r\n		host: the-wise-general-2004.com</div>\r\n	<div id="cke_pastebin">\r\n		user: wisegeneral</div>\r\n	<div id="cke_pastebin">\r\n		pass: pQnyHar#</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		PHPMYADMIN</div>\r\n	<div id="cke_pastebin">\r\n		http://dbadmin.the-wise-general-2004.com</div>\r\n	<div id="cke_pastebin">\r\n		user: wisegeneral</div>\r\n	<div id="cke_pastebin">\r\n		pass: $7LUStkn</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		admin account:</div>\r\n	<div id="cke_pastebin">\r\n		user: tien</div>\r\n	<div id="cke_pastebin">\r\n		pass: 1Temporary2</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		DRUPAL:</div>\r\n	<div>\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">&nbsp;</span><a href="http://imsdev.tamcglobal.com/" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">http://imsdev.tamcglobal.com</a><span style="font-family: arial, sans-serif; font-size: 13px;">&nbsp;</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">The FTP login is:</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">host:&nbsp;</span><a href="http://quartz.onyxlight.net/" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">quartz.onyxlight.net</a><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">user: imsdev</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n		<span style="font-family: arial, sans-serif; font-size: 13px;">pass: sdnLEnQr</span></div>\r\n	<div>\r\n		&nbsp;</div>\r\n	<div>\r\n		phpmyadmin</div>\r\n	<div>\r\n		<a href="http://imsdev.tamcglobal.com/dbadmin" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">http://imsdev.tamcglobal.com/<wbr><wbr><wbr><wbr><wbr><wbr><wbr><wbr><wbr><wbr><wbr>dbadmin</wbr></wbr></wbr></wbr></wbr></wbr></wbr></wbr></wbr></wbr></wbr></a></div>\r\n</div>\r\n', '2013-09-25', '2014-09-25', 59, 2, '2013-09-25 00:00:00', 25, '2014-12-03 07:47:00', 25, 15);
INSERT INTO `project` VALUES(132, 'BGDEMOS', '<div id="cke_pastebin">\r\n	FTP username: tfs@bgdemos.com</div>\r\n<div id="cke_pastebin">\r\n	FTP server: ftp.bgdemos.com</div>\r\n<div id="cke_pastebin">\r\n	FTP &amp; explicit FTPS port: 21</div>\r\n<div>\r\n	password: +59MpRNKV98i</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	http://tfs.bgdemos.com</div>\r\n<div>\r\n	preview</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	<div id="cke_pastebin">\r\n		http://tfs.bgdemos.com/wp-admin/</div>\r\n	<div id="cke_pastebin">\r\n		superadmin1</div>\r\n	<div id="cke_pastebin">\r\n		06PQt&amp;kd!!</div>\r\n	<div>\r\n		&nbsp;</div>\r\n	<div>\r\n		<div id="cke_pastebin">\r\n			http://mobilemercury.com/</div>\r\n		<div id="cke_pastebin">\r\n			user: TheFloorstore</div>\r\n		<div id="cke_pastebin">\r\n			password: thefloorstore</div>\r\n	</div>\r\n</div>\r\n', '2014-02-27', '2015-02-27', 0, 1, '2014-02-27 00:00:00', 25, '2014-02-27 09:14:33', NULL, NULL);
INSERT INTO `project` VALUES(133, 'BEACHHOUSE', '<p>\r\n	website:&nbsp;isabellesbeachhouse.com</p>\r\n<p>\r\n	cpanel login:</p>\r\n<p>\r\n	https://rsb21.rhostbh.com:2083/?locale=en</p>\r\n<p>\r\n	<span style="font-family: arial, sans-serif; font-size: 13.333333969116211px;">isabelq6</span></p>\r\n<p>\r\n	<span style="font-family: arial, sans-serif; font-size: 13.333333969116211px;">BYMoNW2WZs</span></p>\r\n<p>\r\n	&nbsp;</p>\r\n<div id="cke_pastebin">\r\n	http://isabellesbeachhouse.com/administrator</div>\r\n<div id="cke_pastebin">\r\n	acc: adminT</div>\r\n<p>\r\n	&nbsp;</p>\r\n<div id="cke_pastebin">\r\n	pass: trinhcongson</div>\r\n', '2014-03-05', '2015-03-05', 90, 1, '2014-03-05 00:00:00', 25, '2014-05-22 11:09:58', 0, 0);
INSERT INTO `project` VALUES(134, 'EBAVIATOR', '<div>\r\n	ftp login:&nbsp;</div>\r\n<div id="cke_pastebin">\r\n	site: dev.ebaviator.com</div>\r\n<div id="cke_pastebin">\r\n	u/p: ceditor / ceditor</div>\r\n<div>\r\n	port: 22</div>\r\n<div>\r\n	path:&nbsp;&nbsp;/var/www/html/dev_aviator</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	https://pl3.projectlocker.com/EBSolutions/aviator_php/svn/trunk</div>\r\n<div>\r\n	u/p: sion.vn@gmail.com tienNguyen</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	dev.ebaviator.com admin admin123</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	test.ebaviator.com &nbsp; practice: msw001 &nbsp;ID: user2@chetu.com PW: Password321</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	The application is for doctors and nurses to document patient encounters or office visits or hospital visits and to archive all medical history. &nbsp;The system is an end-to-end from making an appointment to getting a diagnosis and prescription, education, etc. Very important is to help improve doctors workflow and make documentation easier than using paper.</div>\r\n', '2014-03-05', '2015-03-05', 9, 1, '2014-03-05 00:00:00', 25, '2014-03-05 11:04:02', NULL, NULL);
INSERT INTO `project` VALUES(135, 'HONESTEYES', '<div id="cke_pastebin">\r\n	Codeigniter site... http://honesteyesonline.com/</div>\r\n<div id="cke_pastebin">\r\n	http://www.honesteyesonline.com/admin</div>\r\n<div id="cke_pastebin">\r\n	user: admin</div>\r\n<div id="cke_pastebin">\r\n	pass: admin</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	FTP:</div>\r\n<div>\r\n	<div id="cke_pastebin">\r\n		97.74.215.181</div>\r\n	<div id="cke_pastebin">\r\n		username: buntingdev</div>\r\n	<div id="cke_pastebin">\r\n		password: vHY8V4SRQDMw!</div>\r\n</div>\r\n', '2014-03-11', '2015-03-11', 90, 1, '2014-03-11 00:00:00', 25, '2014-03-11 07:57:11', NULL, NULL);
INSERT INTO `project` VALUES(136, 'BILL_PROJECTS', '', '2014-03-11', '2015-03-11', 0, 1, '2014-03-11 00:00:00', 64, '2014-03-11 10:22:41', NULL, NULL);
INSERT INTO `project` VALUES(137, 'Mallcrush - Website', '<p>\r\n	HOSTGATOR CPANEL:</p>\r\n<p>\r\n	https://gator1233.hostgator.com:2083/</p>\r\n<p>\r\n	username: mbs2010</p>\r\n<div id="cke_pastebin">\r\n	password: Vietnam2015x</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	GODADDY:</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	<div id="cke_pastebin">\r\n		username: 47930935</div>\r\n	<div>\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		password: Freedom1776</div>\r\n</div>\r\n', '2014-07-12', '2015-07-12', 62, 1, '2014-07-12 00:00:00', 25, '2014-07-21 20:58:23', 16, 10);
INSERT INTO `project` VALUES(138, 'REDBUOY', '<div id="cke_pastebin">\r\n	Redbuoy.com CPANEL:</div>\r\n<div id="cke_pastebin">\r\n	https://192.138.20.40:2083</div>\r\n<div id="cke_pastebin">\r\n	user: redbuoy</div>\r\n<div id="cke_pastebin">\r\n	pass: 0f&amp;D0MocR0Li</div>\r\n<div id="cke_pastebin">\r\n	&nbsp;</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	<div id="cke_pastebin">\r\n		Purpose<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Username<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Password<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Other Info</div>\r\n	<div id="cke_pastebin">\r\n		WiredTree Cpanel Acct<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp;&nbsp;rbdb062<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;wiz57Dom_4<span class="Apple-tab-span" style="white-space:pre"> </span></div>\r\n	<div id="cke_pastebin">\r\n		&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		AdManager<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;redbuoy<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;redbuoy12<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;http://docksidemanager.com/admin</div>\r\n	<div id="cke_pastebin">\r\n		AdManager TEST<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;redbuoy<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;redbuoy12<span class="Apple-tab-span" style="white-space:pre"> </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;http://admintest.docksidemanager.com or http://docksidemanager.com/admintest</div>\r\n	<div>\r\n		&nbsp;</div>\r\n	<div>\r\n		&nbsp;</div>\r\n</div>\r\n<div>\r\n	<div id="cke_pastebin">\r\n		WHM:&nbsp;</div>\r\n	<div id="cke_pastebin">\r\n		https://192.138.20.40:2087</div>\r\n	<div id="cke_pastebin">\r\n		user: redbuoy</div>\r\n	<div id="cke_pastebin">\r\n		pass: gvamFBy&amp;aoZl</div>\r\n	<div>\r\n		&nbsp;</div>\r\n</div>\r\n<div id="cke_pastebin">\r\n	Redbuoymedia.com CPANEL:</div>\r\n<div id="cke_pastebin">\r\n	https://192.138.20.40:2083</div>\r\n<div id="cke_pastebin">\r\n	user: rbuser3</div>\r\n<div id="cke_pastebin">\r\n	pass: [vBrPbQRe3%~</div>\r\n', '2014-07-15', '2015-09-30', 0, 1, '2014-07-15 00:00:00', 25, '2014-10-22 17:22:05', 0, 0);
INSERT INTO `project` VALUES(139, 'Mallcrush.com - City fixes', '<p>\r\n	This project will be a list of City setup errors, flash map errors, HMTL home page and Google Maps fixes that I need to go back and correct later.<br />\r\n	&nbsp;</p>\r\n<p>\r\n	All items assigned in this projects will be done by me.</p>\r\n', '2014-07-16', '2015-07-16', 0, 1, '2014-07-16 00:00:00', 33, '2014-08-24 11:23:49', 0, 0);
INSERT INTO `project` VALUES(140, 'Mallcrush - Droid App', '<p>\r\n	All features, bugs and support tickets for the Mallcrush Droid App project will be placed here.</p>\r\n', '2014-07-21', '2015-07-21', 0, 1, '2014-07-21 00:00:00', 33, '2014-07-21 21:07:07', NULL, NULL);
INSERT INTO `project` VALUES(141, 'Mallcrush - Apple App', '', '2014-07-21', '2015-07-21', 0, 1, '2014-07-21 00:00:00', 33, '2014-07-21 20:57:46', NULL, NULL);
INSERT INTO `project` VALUES(142, 'sIssue improvement', '<p>\r\n	This project is dedicated to making improvements and fixes to the sIssue Ticket Tracker system.</p>\r\n<p>\r\n	It&#39;s a great system with lots of potential for enabling others to amazing things and any tips I share are only with the sincere intent of making it better.</p>\r\n<p>\r\n	(I&#39;m looking forward to buying a version of this tracker in 2015 for use with JustHired.com)</p>\r\n', '2014-07-24', '2015-07-24', 0, 1, '2014-07-24 00:00:00', 33, '2014-08-24 11:22:40', 0, 0);
INSERT INTO `project` VALUES(143, 'ONLINE_EPI', '<p>\r\n	FTP:</p>\r\n<p>\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">host:&nbsp;</span><a href="http://quartz.onyxlight.net/" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">quartz.onyxlight.net</a><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">user: onlineepi</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">pass: h$wG5n3g</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">The database login is:</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">host: localhost</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">user: onlineepi</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">pass: ZGzA8eQN</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">dbname: onlineepi</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">I also added a phpMyAdmin for you:</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<a href="http://www.onlineepi.com/dbadmin" style="color: rgb(17, 85, 204); font-family: arial, sans-serif; font-size: 13px;" target="_blank">http://www.onlineepi.com/<wbr>dbadmin</wbr></a><wbr><wbr><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">user: onlineepi</span><br style="font-family: arial, sans-serif; font-size: 13px;" />\r\n	<span style="font-family: arial, sans-serif; font-size: 13px;">pass: ZGzA8eQN</span></wbr></wbr></p>\r\n', '2014-07-31', '2015-07-31', 0, 1, '2014-07-31 00:00:00', 25, '2014-07-31 23:08:37', NULL, NULL);
INSERT INTO `project` VALUES(149, 'Mallcrush - Deal Site', '                                                                            ', '2014-09-03', '2015-09-03', 0, 1, '2014-09-03 00:00:00', 33, '2014-09-03 02:03:06', 0, 0);
INSERT INTO `project` VALUES(150, 'SION', '<p>\r\n	The common tasks</p>\r\n', '2014-09-04', '2015-09-04', 64, 1, '2014-09-04 00:00:00', 1, '2014-09-04 08:02:49', 0, 0);
INSERT INTO `project` VALUES(151, 'JustHired.com Full Functionality List', '<p>\r\n	Full list of all required functionality for the completely new JustHired.com. Each user type will be shown as a primary category within Sissue with each feature and function desired showing as a subcategory. &nbsp;Here are the designated user types:</p>\r\n<p>\r\n	1. GUESTS</p>\r\n<p>\r\n	2. CLIENTS</p>\r\n<p>\r\n	3. CONTRACTORS</p>\r\n<p>\r\n	4. ADMINS</p>\r\n<p>\r\n	5. BANNER ADVERTISERS</p>\r\n<p>\r\n	6. BANNER ADMINS</p>\r\n<p>\r\n	More info will be added as time progresses.</p>\r\n<p>\r\n	&nbsp;</p>', '2014-09-10', '2015-04-01', 0, 1, '2014-09-10 00:00:00', 33, '2014-09-10 20:26:57', 0, 0);
INSERT INTO `project` VALUES(152, 'ApotheCaring', '<div>\r\n	Site:&nbsp;http://apothecaring.com/</div>\r\n<div>\r\n	&nbsp;</div>\r\n<div>\r\n	CPANEL</div>\r\n<div id="cke_pastebin">\r\n	https://rsb21.rhostbh.com:2083</div>\r\n<div id="cke_pastebin">\r\n	user: apothec4</div>\r\n<div id="cke_pastebin">\r\n	pass: 1Temporary2!</div>\r\n', '2014-11-10', '2015-11-10', 50, 2, '2014-11-10 00:00:00', 1, '2014-11-10 22:20:53', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `project_status`
--

CREATE TABLE `project_status` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(50) collate utf8_unicode_ci NOT NULL,
  `description` text collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=12 ;

--
-- Dumping data for table `project_status`
--

INSERT INTO `project_status` VALUES(1, 'New', 'Project new');
INSERT INTO `project_status` VALUES(3, 'Pending', 'Project pending');
INSERT INTO `project_status` VALUES(4, 'Finish', 'Project finished');
INSERT INTO `project_status` VALUES(2, 'In progress', 'Project in progress');
INSERT INTO `project_status` VALUES(5, 'Cancelled', 'Project cancelled');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(125) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Dumping data for table `role`
--

INSERT INTO `role` VALUES(2, 'Project Manager');
INSERT INTO `role` VALUES(3, 'Developer');
INSERT INTO `role` VALUES(4, 'Designer');
INSERT INTO `role` VALUES(5, 'Tester');
INSERT INTO `role` VALUES(6, 'Client');

-- --------------------------------------------------------

--
-- Table structure for table `role_function`
--

CREATE TABLE `role_function` (
  `id` int(11) NOT NULL auto_increment,
  `role_id` int(11) NOT NULL,
  `function_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=155 ;

--
-- Dumping data for table `role_function`
--

INSERT INTO `role_function` VALUES(92, 3, 10);
INSERT INTO `role_function` VALUES(93, 5, 10);
INSERT INTO `role_function` VALUES(68, 4, 15);
INSERT INTO `role_function` VALUES(67, 4, 13);
INSERT INTO `role_function` VALUES(66, 3, 15);
INSERT INTO `role_function` VALUES(65, 3, 14);
INSERT INTO `role_function` VALUES(64, 3, 13);
INSERT INTO `role_function` VALUES(63, 3, 12);
INSERT INTO `role_function` VALUES(62, 3, 11);
INSERT INTO `role_function` VALUES(61, 2, 10);
INSERT INTO `role_function` VALUES(60, 2, 9);
INSERT INTO `role_function` VALUES(59, 2, 8);
INSERT INTO `role_function` VALUES(58, 2, 7);
INSERT INTO `role_function` VALUES(57, 2, 6);
INSERT INTO `role_function` VALUES(71, 2, 11);
INSERT INTO `role_function` VALUES(72, 2, 12);
INSERT INTO `role_function` VALUES(73, 2, 13);
INSERT INTO `role_function` VALUES(74, 2, 14);
INSERT INTO `role_function` VALUES(75, 2, 15);
INSERT INTO `role_function` VALUES(76, 4, 10);
INSERT INTO `role_function` VALUES(154, 6, 54);
INSERT INTO `role_function` VALUES(153, 6, 53);
INSERT INTO `role_function` VALUES(152, 6, 52);
INSERT INTO `role_function` VALUES(151, 6, 51);
INSERT INTO `role_function` VALUES(81, 6, 10);
INSERT INTO `role_function` VALUES(82, 6, 11);
INSERT INTO `role_function` VALUES(83, 6, 12);
INSERT INTO `role_function` VALUES(84, 6, 13);
INSERT INTO `role_function` VALUES(85, 6, 14);
INSERT INTO `role_function` VALUES(86, 6, 15);
INSERT INTO `role_function` VALUES(87, 5, 11);
INSERT INTO `role_function` VALUES(88, 5, 12);
INSERT INTO `role_function` VALUES(89, 5, 13);
INSERT INTO `role_function` VALUES(90, 5, 14);
INSERT INTO `role_function` VALUES(91, 5, 15);
INSERT INTO `role_function` VALUES(94, 6, 40);
INSERT INTO `role_function` VALUES(95, 5, 40);
INSERT INTO `role_function` VALUES(96, 4, 40);
INSERT INTO `role_function` VALUES(97, 3, 40);
INSERT INTO `role_function` VALUES(98, 2, 40);
INSERT INTO `role_function` VALUES(99, 3, 41);
INSERT INTO `role_function` VALUES(100, 2, 41);
INSERT INTO `role_function` VALUES(101, 4, 41);
INSERT INTO `role_function` VALUES(102, 5, 41);
INSERT INTO `role_function` VALUES(103, 6, 41);
INSERT INTO `role_function` VALUES(104, 6, 42);
INSERT INTO `role_function` VALUES(105, 5, 42);
INSERT INTO `role_function` VALUES(106, 4, 42);
INSERT INTO `role_function` VALUES(107, 3, 42);
INSERT INTO `role_function` VALUES(108, 2, 42);
INSERT INTO `role_function` VALUES(149, 6, 49);
INSERT INTO `role_function` VALUES(143, 3, 47);
INSERT INTO `role_function` VALUES(134, 4, 11);
INSERT INTO `role_function` VALUES(129, 5, 48);
INSERT INTO `role_function` VALUES(113, 6, 44);
INSERT INTO `role_function` VALUES(128, 5, 47);
INSERT INTO `role_function` VALUES(115, 2, 44);
INSERT INTO `role_function` VALUES(116, 2, 45);
INSERT INTO `role_function` VALUES(117, 2, 46);
INSERT INTO `role_function` VALUES(118, 2, 47);
INSERT INTO `role_function` VALUES(119, 2, 48);
INSERT INTO `role_function` VALUES(120, 2, 21);
INSERT INTO `role_function` VALUES(121, 2, 26);
INSERT INTO `role_function` VALUES(122, 2, 31);
INSERT INTO `role_function` VALUES(123, 6, 47);
INSERT INTO `role_function` VALUES(124, 6, 48);
INSERT INTO `role_function` VALUES(125, 6, 21);
INSERT INTO `role_function` VALUES(126, 6, 26);
INSERT INTO `role_function` VALUES(127, 6, 31);
INSERT INTO `role_function` VALUES(130, 5, 21);
INSERT INTO `role_function` VALUES(131, 5, 26);
INSERT INTO `role_function` VALUES(132, 5, 31);
INSERT INTO `role_function` VALUES(133, 5, 44);
INSERT INTO `role_function` VALUES(135, 4, 12);
INSERT INTO `role_function` VALUES(136, 4, 14);
INSERT INTO `role_function` VALUES(137, 4, 47);
INSERT INTO `role_function` VALUES(138, 4, 48);
INSERT INTO `role_function` VALUES(139, 4, 21);
INSERT INTO `role_function` VALUES(140, 4, 26);
INSERT INTO `role_function` VALUES(141, 4, 31);
INSERT INTO `role_function` VALUES(142, 4, 44);
INSERT INTO `role_function` VALUES(144, 3, 48);
INSERT INTO `role_function` VALUES(145, 3, 21);
INSERT INTO `role_function` VALUES(146, 3, 26);
INSERT INTO `role_function` VALUES(147, 3, 31);
INSERT INTO `role_function` VALUES(148, 3, 44);
INSERT INTO `role_function` VALUES(150, 6, 50);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL auto_increment,
  `email_address` varchar(50) collate utf8_unicode_ci NOT NULL,
  `password` varchar(255) collate utf8_unicode_ci NOT NULL,
  `full_name` varchar(150) collate utf8_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL default '0',
  `token` varchar(125) collate utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL default CURRENT_TIMESTAMP,
  `is_admin` tinyint(1) NOT NULL default '0',
  `modified` datetime NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `email_address` (`email_address`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=80 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` VALUES(24, 'ngophuocthien85@gmail.com', 'e779e5e6d09a300485016b042a78e3cd', 'Thien Ngo', 0, '', '2012-07-31 22:33:44', 0, '2012-11-29 15:51:20');
INSERT INTO `user` VALUES(1, 'sion.vn@gmail.com', 'e702acce68a9a10940a78c6da3de9d99', 'Administrator', 1, '', '2012-07-27 12:41:02', 1, '2014-07-16 23:25:50');
INSERT INTO `user` VALUES(20, 'hatieuphong@gmail.com', 'e788463ca4ea2073b85f3487c9aabf30', 'Tien Kieu', 0, '', '2012-07-27 12:50:12', 0, '2012-11-29 15:51:54');
INSERT INTO `user` VALUES(25, 'sion3.vn@gmail.com', 'e702acce68a9a10940a78c6da3de9d99', 'SION Nguyen', 1, '', '2012-08-08 00:53:29', 1, '2014-07-12 13:59:09');
INSERT INTO `user` VALUES(30, 'christopher.ashe@gmail.com', '581e398819512ab190d449d810cdfe52', 'Christopher Ashe', 0, '', '2012-08-29 08:54:19', 0, '2012-08-29 08:54:19');
INSERT INTO `user` VALUES(32, 'kudubids@gmail.com', '445c07afbc8a8ec1d48eab9fda5d8ef2', 'Adrian', 1, '', '2012-09-17 10:21:50', 0, '2012-09-17 10:21:50');
INSERT INTO `user` VALUES(33, 'paul.paige@mallcrush.com', 'c0294fbcf40693faa7e3d301bdb4efc8', 'Paul Paige', 1, '', '2012-10-15 12:25:39', 0, '2012-10-15 12:25:39');
INSERT INTO `user` VALUES(62, 'tam.vir89@gmail.com', '427edd1df0eb5f0bdc1aae20063085c7', 'DEV_T', 1, '', '2013-09-13 08:11:40', 0, '2013-09-24 16:10:17');
INSERT INTO `user` VALUES(50, 'bob@fundsforyourprojects.com', 'a34bfc8ceffd968f1eeaef6d2dbb2a8e', 'Bob Cappel', 0, '', '2012-11-13 00:02:02', 0, '2012-11-13 00:02:02');
INSERT INTO `user` VALUES(58, 'vanchung.tk07@gmail.com', '9b8f08e430bc5be879756131c44e838a', 'DEV_C', 0, '', '2013-03-04 22:51:53', 0, '2013-09-24 16:10:35');
INSERT INTO `user` VALUES(78, 'ety@tamcsolutions.info', 'e779e5e6d09a300485016b042a78e3cd', 'Ety', 1, '', '2014-08-08 11:31:45', 0, '2014-08-08 11:31:45');
INSERT INTO `user` VALUES(63, 'tranthemybs@gmail.com', '5bbccbcaf34479a3b4f9bcb0115cf339', 'DEV_M', 0, '', '2013-12-15 06:03:39', 0, '0000-00-00 00:00:00');
INSERT INTO `user` VALUES(77, 'arichman@tamcintel.com', '2134383e83661e18cc104833fb0e0dda', 'Aaron', 1, '', '2014-08-08 11:30:38', 0, '2014-08-08 11:30:38');
INSERT INTO `user` VALUES(76, 'sion2.vn@gmail.com', '9a9145ff967058ddf321584e3ef312b3', 'Sion Nguyen', 1, '', '2014-08-08 10:28:34', 0, '2014-08-08 10:28:34');
INSERT INTO `user` VALUES(74, 'caner.bk@gmail.com', 'f612b406465912f8b3fd4596fceda712', 'DEV_TU', 1, '', '2014-07-15 17:14:02', 0, '2014-07-15 17:14:02');
INSERT INTO `user` VALUES(79, 'gndoumit@gmail.com', '1cb4f4fa810713522d33833a417091a4', 'Gretchen', 1, '', '2014-11-10 22:22:57', 0, '2014-11-10 22:22:57');

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `id` int(11) NOT NULL auto_increment,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `is_project_default` tinyint(1) NOT NULL,
  `page` int(11) NOT NULL default '1',
  `rows` int(11) NOT NULL default '10',
  `closed_hide` tinyint(1) NOT NULL default '0',
  `orderby` varchar(50) NOT NULL default 'order_id',
  `sort` varchar(50) NOT NULL default 'asc',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=753 ;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` VALUES(253, 0, 21, 4, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(252, 0, 20, 5, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(254, 0, 22, 3, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(258, 0, 21, 0, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(259, 0, 22, 0, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(260, 0, 22, 0, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(261, 0, 21, 0, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(262, 0, 21, 0, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(263, 0, 22, 0, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(669, 134, 63, 3, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(326, 87, 28, 6, 1, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(607, 123, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(366, 87, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(400, 75, 1, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(435, 75, 1, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(279, 0, 24, 2, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(480, 104, 24, 3, 0, 1, 50, 0, 'status', 'ASC');
INSERT INTO `user_role` VALUES(316, 86, 25, 2, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(434, 75, 25, 2, 0, 1, 50, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(642, 128, 58, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(641, 128, 62, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(482, 90, 20, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(335, 75, 1, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(338, 86, 1, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(339, 87, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(657, 123, 63, 3, 1, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(342, 86, 1, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(343, 87, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(385, 0, 35, 6, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(345, 89, 25, 2, 0, 1, 10, 0, 'order_id', 'asc');
INSERT INTO `user_role` VALUES(346, 89, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(347, 89, 32, 6, 1, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(640, 128, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(468, 86, 20, 3, 0, 1, 30, 0, 'complete_percent', 'DESC');
INSERT INTO `user_role` VALUES(350, 90, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(351, 90, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(638, 127, 58, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(639, 128, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(539, 99, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(737, 149, 33, 2, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(359, 87, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(361, 87, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(363, 87, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(365, 87, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(367, 87, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(371, 93, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(372, 93, 25, 2, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(739, 149, 1, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(738, 149, 25, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(540, 99, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(394, 99, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(405, 101, 1, 0, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(404, 101, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(467, 104, 50, 6, 1, 1, 50, 0, 'priority', 'DESC');
INSERT INTO `user_role` VALUES(680, 137, 25, 2, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(627, 102, 25, 2, 0, 1, 10, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(409, 102, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(448, 104, 25, 2, 0, 1, 50, 0, 'assignee', 'ASC');
INSERT INTO `user_role` VALUES(414, 104, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(415, 104, 36, 3, 1, 3, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(651, 131, 1, 0, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(418, 104, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(636, 127, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(635, 127, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(654, 131, 62, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(650, 131, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(436, 75, 39, 3, 0, 1, 50, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(733, 0, 32, 6, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(645, 129, 58, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(644, 129, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(643, 129, 25, 2, 0, 0, 0, 0, 'undefined', 'ASC');
INSERT INTO `user_role` VALUES(461, 101, 24, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(449, 104, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(453, 104, 45, 3, 0, 1, 10, 0, '', '');
INSERT INTO `user_role` VALUES(484, 75, 24, 3, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(622, 102, 62, 3, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(605, 123, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(656, 102, 63, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(483, 86, 24, 3, 1, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(648, 130, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(488, 104, 20, 3, 1, 1, 20, 0, 'complete_percent', 'DESC');
INSERT INTO `user_role` VALUES(647, 130, 25, 2, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(628, 102, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(637, 127, 62, 3, 0, 1, 10, 0, 'undefined', 'DESC');
INSERT INTO `user_role` VALUES(652, 131, 45, 2, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(649, 99, 62, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(646, 122, 62, 3, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(661, 132, 57, 3, 1, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(515, 104, 54, 5, 1, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(516, 104, 43, 3, 0, 2, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(562, 0, 58, 3, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(659, 132, 25, 2, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(681, 137, 1, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(563, 89, 58, 3, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(520, 86, 43, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(653, 131, 63, 3, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(523, 101, 38, 3, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(525, 113, 1, 0, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(527, 113, 1, 0, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(534, 113, 1, 0, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(530, 113, 20, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(532, 113, 1, 0, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(533, 113, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(543, 113, 56, 3, 1, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(624, 102, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(564, 101, 58, 3, 0, 1, 10, 0, 'name', 'DESC');
INSERT INTO `user_role` VALUES(567, 119, 1, 0, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(569, 119, 59, 5, 1, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(570, 119, 61, 3, 1, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(600, 119, 1, 0, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(665, 134, 25, 2, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(664, 133, 62, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(663, 133, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(626, 125, 58, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(662, 133, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(594, 119, 60, 5, 1, 2, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(580, 121, 25, 2, 0, 1, 10, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(581, 121, 1, 0, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(582, 121, 58, 3, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(593, 122, 1, 0, 0, 1, 10, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(584, 122, 1, 0, 0, 1, 10, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(585, 122, 58, 3, 0, 2, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(587, 122, 1, 0, 0, 1, 10, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(603, 123, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(589, 123, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(655, 131, 57, 3, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(591, 123, 62, 3, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(612, 123, 25, 2, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(592, 122, 25, 2, 0, 1, 30, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(625, 125, 62, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(621, 125, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(660, 132, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(620, 125, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(609, 123, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(611, 123, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(613, 123, 1, 0, 0, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(619, 119, 1, 0, 0, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(618, 119, 25, 2, 0, 1, 30, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(615, 93, 62, 3, 0, 1, 10, 0, 'undefined', 'DESC');
INSERT INTO `user_role` VALUES(616, 0, 60, 5, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(617, 121, 62, 3, 0, 1, 10, 0, 'undefined', 'DESC');
INSERT INTO `user_role` VALUES(631, 126, 25, 2, 1, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(630, 126, 1, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(632, 126, 1, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(633, 126, 62, 3, 1, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(667, 134, 58, 3, 1, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(666, 134, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(668, 102, 58, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(670, 134, 62, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(671, 135, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(672, 135, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(673, 135, 63, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(675, 135, 62, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(678, 136, 64, 6, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(677, 136, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(679, 136, 25, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(682, 137, 62, 3, 0, 2, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(686, 137, 74, 3, 1, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(687, 138, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(685, 137, 33, 6, 1, 1, 50, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(688, 138, 66, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(689, 138, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(692, 139, 33, 2, 0, 1, 10, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(693, 139, 66, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(694, 139, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(695, 140, 33, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(696, 140, 66, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(697, 140, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(698, 141, 33, 2, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(699, 141, 66, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(700, 141, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(702, 142, 66, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(703, 142, 1, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(734, 142, 33, 5, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(736, 138, 74, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(705, 143, 25, 2, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(706, 143, 66, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(707, 143, 1, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(708, 143, 62, 3, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(709, 126, 78, 6, 1, 1, 10, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(710, 126, 77, 6, 1, 1, 10, 1, 'code', 'DESC');
INSERT INTO `user_role` VALUES(732, 0, 62, 3, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(731, 0, 63, 3, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(730, 0, 74, 3, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(727, 0, 77, 6, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(726, 0, 78, 6, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(728, 0, 33, 6, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(735, 138, 62, 3, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(740, 150, 25, 0, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(741, 150, 1, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(742, 150, 62, 3, 0, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(743, 150, 76, 2, 1, 1, 50, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(744, 151, 33, 2, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(745, 151, 25, 0, 0, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(746, 151, 1, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(747, 150, 74, 3, 0, 1, 20, 0, 'code', 'DESC');
INSERT INTO `user_role` VALUES(748, 152, 25, 0, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(749, 152, 1, 0, 1, 1, 10, 0, 'id', 'DESC');
INSERT INTO `user_role` VALUES(750, 152, 79, 6, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(751, 152, 62, 3, 0, 0, 0, 0, '', '');
INSERT INTO `user_role` VALUES(752, 152, 76, 2, 0, 0, 0, 0, '', '');
