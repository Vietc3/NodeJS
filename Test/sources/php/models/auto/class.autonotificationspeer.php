<?php
class AutoNotificationsPeer
{
    const TABLE_NAME = 'notifications';
    
    const ID = 'id';
    const EMAIL_ADDRESS = 'email_address';
    const IS_READ = 'is_read';
    const SUBJECT = 'subject';
    const CONTENT = 'content';
    const PROJECT_ID = 'project_id';
    const ISSUE_ID = 'issue_id';
    const IS_VISIBLE = 'is_visible';
    protected static $propertyNames = array('Id', 'EmailAddress', 'IsRead', 'Subject', 'Content', 'ProjectId', 'IssueId', 'IsVisible');
    protected static $colNames = array(AutoNotificationsPeer::ID, AutoNotificationsPeer::EMAIL_ADDRESS, AutoNotificationsPeer::IS_READ, AutoNotificationsPeer::SUBJECT, AutoNotificationsPeer::CONTENT, AutoNotificationsPeer::PROJECT_ID, AutoNotificationsPeer::ISSUE_ID, AutoNotificationsPeer::IS_VISIBLE);    
    protected static function AssignProperty($autonotifications, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoNotificationsPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoNotificationsPeer::$propertyNames[$id];
                    $autonotifications->{$method}($value);
                }
            }
        }
        return $autonotifications;
    }    
    public static function DoInsert($autonotifications)
    {
        $sql = "INSERT INTO ". AutoNotificationsPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoNotificationsPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoNotificationsPeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autonotifications->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autonotifications)
    {
        $sql = "UPDATE " . AutoNotificationsPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoNotificationsPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoNotificationsPeer::$propertyNames[$key];
                $sql .= addslashes( $autonotifications->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autonotifications->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoNotificationsPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoNotificationsPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autonotifications = new AutoNotifications();
        $autonotifications = AutoNotificationsPeer::AssignProperty($autonotifications, $row);
        return $autonotifications;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoNotificationsPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autonotifications = new AutoNotifications();
            $autonotifications = AutoNotificationsPeer::AssignProperty($autonotifications, $row);
            $list[] = $autonotifications;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoNotificationsPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
