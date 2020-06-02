<?php
//Session time out
define('SESSION_TIME_OUT', 24 * 60 * 60);
//Cookie
define ('COOKIE_TIME_OUT', 7 * 24 * 60 * 60);


define('AUTO_MODEL_DIRECTORY', 'models/auto');

define('MODEL_DIRECTORY', 'models');

define('MODULE_DIRECTORY', 'modules');

define('PERMISSION_MESSAGE', '<div class="alert error">You do not have the permission to view this page</div>');

//the actions that do not require login
$not_require_login_actions = array( 'forgotpassword', 'signup', 'active', 'showmessage', 'checkvalidemail', 'uploads', 'howtouse', 'overview', 'login');

//the actions that do not require login
$not_require_login_modules = array( 'ajax', 'dashboard');

//the actions that do not need to print header and footer
$only_content_actions = array( 'forgotpassword', 'exporttoexcel');

//the modules that do not need to print header and footer
$only_content_modules = array( 'ajax');

$module = ""; $action = "";

?>
