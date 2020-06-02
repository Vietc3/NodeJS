<?php
class Controller
{
    private $is_default_view = true;
    private $is_unquote = false;
    
    function loadAutoView()
    {
        global $module, $action;
        $action_ucfirst = ucfirst($action);

        if (file_exists(MODULE_DIRECTORY . "/$module/view/auto/Auto{$action_ucfirst}Success.php"))
            include_once( MODULE_DIRECTORY . "/$module/view/auto/Auto{$action_ucfirst}Success.php" );
    }
    public function loadView()
    {
        global $module, $action;
    
        $action_ucfirst = ucfirst($action);
        if (file_exists(MODULE_DIRECTORY . "/$module/view/{$action_ucfirst}Success.php"))
            include_once(MODULE_DIRECTORY . "/$module/view/{$action_ucfirst}Success.php" );
        else
            $this->loadAutoView();
    }
    public function loadDefaultView()
    {
        if (!$this->is_default_view)
            return;
        
        $this->loadView();
    }
    public function loadViewFile($file)
    {
        $this->is_default_view = false;
        if ($file != null && file_exists($file))
            include_once($file);
    }
    public function unQuote() 
    {
        if (!$this->is_unquote)
        {
            if (get_magic_quotes_gpc()) 
            {
                $process = array(&$_GET, &$_POST, &$_COOKIE, &$_REQUEST);
                while (list($key, $val) = each($process)) 
                {
                    foreach ($val as $k => $v) {
                        unset($process[$key][$k]);
                        if (is_array($v)) {
                            $process[$key][stripslashes($k)] = $v;
                            $process[] = &$process[$key][stripslashes($k)];
                        } else {
                            $process[$key][stripslashes($k)] = stripslashes($v);
                        }
                    }
                }
                unset($process);
            }
            $this->is_unquote = true;
        }
    }
}
?>
