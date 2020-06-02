<?php
class AutoRolePeer
{
    const TABLE_NAME = 'role';
    
    const ID = 'id';
    const NAME = 'name';
    protected static $propertyNames = array('Id', 'Name');
    protected static $colNames = array(AutoRolePeer::ID, AutoRolePeer::NAME);    
    protected static function AssignProperty($autorole, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoRolePeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoRolePeer::$propertyNames[$id];
                    $autorole->{$method}($value);
                }
            }
        }
        return $autorole;
    }    
    public static function DoInsert($autorole)
    {
        $sql = "INSERT INTO ". AutoRolePeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoRolePeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoRolePeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autorole->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autorole)
    {
        $sql = "UPDATE " . AutoRolePeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoRolePeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoRolePeer::$propertyNames[$key];
                $sql .= addslashes( $autorole->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autorole->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoRolePeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoRolePeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autorole = new AutoRole();
        $autorole = AutoRolePeer::AssignProperty($autorole, $row);
        return $autorole;
    }
    public static function RetrieveByName($name)
    {
        $sql = "Select * from ". AutoRolePeer::TABLE_NAME ." where name='$name' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autorole = new AutoRole();
        $autorole = AutoRolePeer::AssignProperty($autorole, $row);
        return $autorole;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoRolePeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autorole = new AutoRole();
            $autorole = AutoRolePeer::AssignProperty($autorole, $row);
            $list[] = $autorole;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoRolePeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
