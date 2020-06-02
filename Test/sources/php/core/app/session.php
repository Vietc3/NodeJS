<?php
class Session 
{
    public static function start()
    {
        if (!isset($_SESSION))
            session_start();
    }
    public static function get($name)
    {
        return isset($_SESSION[$name])? $_SESSION[$name] : null;
    }
    public static function set($name, $value)
    {
        $_SESSION[$name] = $value;
    }
    public static function destroy($name)
    {
        unset($_SESSION[$name]);
    }
    public static function is_set($name)
    {
        return isset($_SESSION[$name]);
    }
}
?>
