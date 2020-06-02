<?php
class AutoIssueStatusPeer
{
    const TABLE_NAME = 'issue_status';
    
    const ID = 'id';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const COLOR = 'color';
    const ORDER_ID = 'order_id';
    protected static $propertyNames = array('Id', 'Name', 'Description', 'Color', 'OrderId');
    protected static $colNames = array(AutoIssueStatusPeer::ID, AutoIssueStatusPeer::NAME, AutoIssueStatusPeer::DESCRIPTION, AutoIssueStatusPeer::COLOR, AutoIssueStatusPeer::ORDER_ID);    
    protected static function AssignProperty($autoissuestatus, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoIssueStatusPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoIssueStatusPeer::$propertyNames[$id];
                    $autoissuestatus->{$method}($value);
                }
            }
        }
        return $autoissuestatus;
    }    
    public static function DoInsert($autoissuestatus)
    {
        $sql = "INSERT INTO ". AutoIssueStatusPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoIssueStatusPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoIssueStatusPeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autoissuestatus->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autoissuestatus)
    {
        $sql = "UPDATE " . AutoIssueStatusPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoIssueStatusPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoIssueStatusPeer::$propertyNames[$key];
                $sql .= addslashes( $autoissuestatus->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autoissuestatus->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoIssueStatusPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoIssueStatusPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autoissuestatus = new AutoIssueStatus();
        $autoissuestatus = AutoIssueStatusPeer::AssignProperty($autoissuestatus, $row);
        return $autoissuestatus;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoIssueStatusPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissuestatus = new AutoIssueStatus();
            $autoissuestatus = AutoIssueStatusPeer::AssignProperty($autoissuestatus, $row);
            $list[] = $autoissuestatus;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoIssueStatusPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
