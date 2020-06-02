<?php
class AutoRoleFunctionPeer
{
    const TABLE_NAME = 'role_function';
    
    const ID = 'id';
    const ROLE_ID = 'role_id';
    const FUNCTION_ID = 'function_id';
    protected static $propertyNames = array('Id', 'RoleId', 'FunctionId');
    protected static $colNames = array(AutoRoleFunctionPeer::ID, AutoRoleFunctionPeer::ROLE_ID, AutoRoleFunctionPeer::FUNCTION_ID);    
    protected static function AssignProperty($autorolefunction, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoRoleFunctionPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoRoleFunctionPeer::$propertyNames[$id];
                    $autorolefunction->{$method}($value);
                }
            }
        }
        return $autorolefunction;
    }    
    public static function DoInsert($autorolefunction)
    {
        $sql = "INSERT INTO ". AutoRoleFunctionPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoRoleFunctionPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoRoleFunctionPeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autorolefunction->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autorolefunction)
    {
        $sql = "UPDATE " . AutoRoleFunctionPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoRoleFunctionPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoRoleFunctionPeer::$propertyNames[$key];
                $sql .= addslashes( $autorolefunction->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autorolefunction->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoRoleFunctionPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoRoleFunctionPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autorolefunction = new AutoRoleFunction();
        $autorolefunction = AutoRoleFunctionPeer::AssignProperty($autorolefunction, $row);
        return $autorolefunction;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoRoleFunctionPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autorolefunction = new AutoRoleFunction();
            $autorolefunction = AutoRoleFunctionPeer::AssignProperty($autorolefunction, $row);
            $list[] = $autorolefunction;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoRoleFunctionPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
