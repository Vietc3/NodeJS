<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
class Database 
{
    private static $connection;
    private static $errorMessage;
    
    public static function connect()
    {
		try {
			Database::$connection = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		} catch (PDOException $e) {
			Database::$errorMessage =  $e->getMessage();
                        return false;
		}
        return true;
    }
    public static function prepare($sql)
    {
        $sth = Database::$connection->prepare($sql);
        if (!$sth) return null;
        $sth->execute();
        return $sth;
    }
    
    public static function query($sql)
    {
        return Database::$connection->query($sql);
    }
    
    public static function fetch($sql)
    {
        $sth = Database::prepare($sql);
        if (!$sth) return null;
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        return $result;
    }
    
    public static function getCount($sql)
    {
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        if ($sth->rowCount()== 0) return 0;
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }
    
    public static function getInsertId()
    {
        return Database::$connection->lastInsertId();
    }
    public static function getErrorMessage()
    {
        return Database::$errorMessage;
    }
    public static function isErrorCommand()
    {
        return mysql_errno(Database::$connection) != 0;
    }
    public static function getConn()
    {
        return Database::$connection;
    }
            
}
?>
