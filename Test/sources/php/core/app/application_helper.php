<?php

include_once('libs/translate/class.translate.php');
include_once('libs/helper/url.php');
include_once('libs/helper/common.php');
include_once('libs/helper/process_template.php');
include_once('libs/helper/mail.php');
include_once('libs/database/class.database.php');

function listAllPhpFilesInDirectory($directory)
{
    $list = array();
    if ($handle = opendir($directory))
    {
        while (false !== ($entry = readdir($handle)))
        {
            if ($entry != "." && $entry != ".." && substr($entry, strlen($entry) - 3) == 'php')
            {
                $list[] = $entry;
            }
        }
        closedir($handle);
    }

    return $list;
}

function loadModels()
{
    $listAuto  = listAllPhpFilesInDirectory(AUTO_MODEL_DIRECTORY);
    $listModel = listAllPhpFilesInDirectory(MODEL_DIRECTORY);
        
    foreach ($listAuto as $filename)
    {
        include_once( AUTO_MODEL_DIRECTORY . "/$filename");
    }

    foreach ($listModel as $filename)
    {
        include_once( MODEL_DIRECTORY . "/$filename");
    }
}

function isOnlyOutputContent()
{
    global $module, $action, $only_content_modules, $only_content_actions;

    return in_array($module, $only_content_modules) || in_array($action, $only_content_actions);
}

function isLoggedInBySession()
{
    process_setsession_fromcookie();
    return authenticateBySession();
}
function isNotRequireLoginModuleAction()
{
    global $module, $action, $not_require_login_modules, $not_require_login_actions;
    return in_array($module, $not_require_login_modules) || in_array($action, $not_require_login_actions);
}

function loadAutoController()
{
    global $module, $action;

    $module_ucfirst = ucfirst($module);
    $action_ucfirst = ucfirst($action);

    if (file_exists(MODULE_DIRECTORY . "/$module/controller/auto/Auto{$module_ucfirst}Action.php"))
    {
        include_once(MODULE_DIRECTORY . "/$module/controller/auto/Auto{$module_ucfirst}Action.php");

        $actionClass  = "Auto{$module_ucfirst}Action";
        $controller = new $actionClass;
        $controller->unQuote();

        $actionMethod = "execute$action_ucfirst";        
        if (method_exists($controller, $actionMethod))
            $controller->{$actionMethod}();
            
        $controller->loadDefaultView();
    }
    else
        echo "<div class=\"alert alert-error\">Access to non-existing module.</div>";
}

function loadController()
{
    global $module, $action;
    
    $module_ucfirst = ucfirst($module);
    $action_ucfirst = ucfirst($action);

    if (file_exists(MODULE_DIRECTORY . "/$module/controller/{$module_ucfirst}Action.php"))
    {
        include_once(MODULE_DIRECTORY . "/$module/controller/{$module_ucfirst}Action.php");

        $actionClass  = "{$module_ucfirst}Action";
        $controller = new $actionClass;
        $controller->unQuote();

        $actionMethod = "execute$action_ucfirst";
        if (method_exists($controller, $actionMethod))
        {
            $controller->{$actionMethod}();
            $controller->loadDefaultView();
        }
        else
            loadAutoController();
    }
    else
        loadAutoController();
}

function GetFunctionName()
{
    global $module, $action;
    
    $task = $action;
    switch ($action)
    {
        case 'edit':
            if (!isset($_GET['id']))
                $task = 'create';
            break;
        case 'list':
            $task = 'view';
            break;
    }

    return strtoupper($task) . "_" . strtoupper($module);
}
function isHasPermission()
{
    global $module, $action;
        
    if (isNotRequireLoginModuleAction())
        return true;
    
    if (empty($module) )
    {
        $module = 'user';        $action = 'login';
        return true;
    }
    
    if (!isLoggedInBySession())
    {
        $module = 'user';        $action = 'login';
        $_SESSION[BACK_URL] = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        return true;
    }
    
    if (isset($_SESSION[BACK_URL]))
    {
        $url = $_SESSION[BACK_URL];
        unset($_SESSION[BACK_URL]);
        redirect($url);
    }
    
    if (empty($action))
    {
        $action = 'list';
    }
    
    if ($_SESSION[IS_ADMIN] == 1)
        return true;

    if ($module == 'user' && ($action == 'view' || $action == 'edit' || 'logout'))
        return true;
    
    if ( isset($_REQUEST['secret_key']) && $_REQUEST['secret_key'] && isset($_SESSION[SECRET_KEY]) && $_SESSION[SECRET_KEY] == $_REQUEST['secret_key']) {
        $_SESSION[SECRET_KEY] = '';
        return true;
    }
    
    return RoleFunctionPeer::RetrieveByUserId($_SESSION[USER_ID], GetFunctionName());
    
}
function retrieveModuleAction()
{
    global $module, $action;    
    
    $module = null; $action = null;
    
    if (isset($_REQUEST['m']))
        $module = $_REQUEST['m'];
    else
        if (isset($_SESSION['m']))
            $module = $_SESSION['m'];
    
    if (isset($_REQUEST['a']))
        $action = $_REQUEST['a'];
    else
        if (isset($_SESSION['a']))
            $action = $_SESSION['a'];
}


function link_to($name)
{
    $requestURI = $_SERVER['SCRIPT_NAME']."?";
    
    $arr = explode('/', $name);
    
    if (count($arr) >= 0)
        $requestURI .= "m=" . $arr[0];
    
    if (count($arr) > 1)
    {
        $arr2 = explode('?', $arr[1]);
        if (count($arr2) >= 0)
            $requestURI .= "&a=" . $arr2[0];
        
        if (count($arr2) > 1)
            $requestURI .= "&" . $arr2[1];
    }
    return $requestURI;
}

function href_to($name)
{
    return $name;
    $requestURI = $_SERVER['SERVER_NAME'].$_SERVER['SCRIPT_NAME'];
    
    $arr = explode('/', $requestURI);
    
    $requestURI = "";
    for ($i = 0; $i < count($arr) - 1; $i++)
        $requestURI .= $arr[$i] . "/";
    
    $requestURI .= "$name";
    
    return $requestURI;
}

function HasSessionFromProjectInfor()
{
    $user_role = UserRolePeer::GetProjectDefault();

    if ($user_role)
    {
        Session::set( PROJECT_ID, $user_role['project_id'] );
        Session::set( PAGE, $user_role['page'] );
        Session::set( ROWS, $user_role['rows'] );
        Session::set( CLOSED_HIDE, $user_role['closed_hide'] );
        return true;
    }
    return false;
}

function authenticateBySession()
{
    if (!isset($_SESSION[USER_ID]) || !isset($_SESSION[PASSWORD]))
        return false;
    $user = UserPeer::RetrieveById($_SESSION[USER_ID]);
    if (!$user || !$user->getIsActive())
        return false;
    if ($user->getPassword() != $_SESSION[PASSWORD])
        return false;
    return true;
}
?>
