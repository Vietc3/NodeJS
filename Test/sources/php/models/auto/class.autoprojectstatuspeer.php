<?php
class AutoProjectstatusPeer
{
    const TABLE_NAME = 'project_status';
    
    const ID = 'id';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    protected static $propertyNames = array('Id', 'Name', 'Description');
    protected static $colNames = array(AutoProjectstatusPeer::ID, AutoProjectstatusPeer::NAME, AutoProjectstatusPeer::DESCRIPTION);    
    protected static function AssignProperty($autoprojectstatus, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoProjectstatusPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoProjectstatusPeer::$propertyNames[$id];
                    $autoprojectstatus->{$method}($value);
                }
            }
        }
        return $autoprojectstatus;
    }    
    public static function DoInsert($autoprojectstatus)
    {
        $sql = "INSERT INTO ". AutoProjectstatusPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoProjectstatusPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoProjectstatusPeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autoprojectstatus->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autoprojectstatus)
    {
        $sql = "UPDATE " . AutoProjectstatusPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoProjectstatusPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoProjectstatusPeer::$propertyNames[$key];
                $sql .= addslashes( $autoprojectstatus->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autoprojectstatus->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoProjectstatusPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoProjectstatusPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autoprojectstatus = new AutoProjectstatus();
        $autoprojectstatus = AutoProjectstatusPeer::AssignProperty($autoprojectstatus, $row);
        return $autoprojectstatus;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoProjectstatusPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoprojectstatus = new AutoProjectstatus();
            $autoprojectstatus = AutoProjectstatusPeer::AssignProperty($autoprojectstatus, $row);
            $list[] = $autoprojectstatus;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoProjectstatusPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
