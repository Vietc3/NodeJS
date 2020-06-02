<?php
class AutoIssueTimePeer
{
    const TABLE_NAME = 'issue_time';
    
    const ID = 'id';
    const ISSUE_ID = 'issue_id';
    const DATE = 'date';
    const HOURS = 'hours';
    const DESCRIPTION = 'description';
    protected static $propertyNames = array('Id', 'IssueId', 'Date', 'Hours', 'Description');
    protected static $colNames = array(AutoIssueTimePeer::ID, AutoIssueTimePeer::ISSUE_ID, AutoIssueTimePeer::DATE, AutoIssueTimePeer::HOURS, AutoIssueTimePeer::DESCRIPTION);    
    protected static function AssignProperty($autoissuetime, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoIssueTimePeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoIssueTimePeer::$propertyNames[$id];
                    $autoissuetime->{$method}($value);
                }
            }
        }
        return $autoissuetime;
    }    
    public static function DoInsert($autoissuetime)
    {
        $sql = "INSERT INTO ". AutoIssueTimePeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoIssueTimePeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoIssueTimePeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autoissuetime->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autoissuetime)
    {
        $sql = "UPDATE " . AutoIssueTimePeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoIssueTimePeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoIssueTimePeer::$propertyNames[$key];
                $sql .= addslashes( $autoissuetime->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autoissuetime->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoIssueTimePeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoIssueTimePeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autoissuetime = new AutoIssueTime();
        $autoissuetime = AutoIssueTimePeer::AssignProperty($autoissuetime, $row);
        return $autoissuetime;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoIssueTimePeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissuetime = new AutoIssueTime();
            $autoissuetime = AutoIssueTimePeer::AssignProperty($autoissuetime, $row);
            $list[] = $autoissuetime;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoIssueTimePeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
