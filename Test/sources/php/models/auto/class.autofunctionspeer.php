<?php
class AutoFunctionsPeer
{
    const TABLE_NAME = 'functions';
    
    const ID = 'id';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const CATEGORY = 'category';
    protected static $propertyNames = array('Id', 'Name', 'Description', 'Category');
    protected static $colNames = array(AutoFunctionsPeer::ID, AutoFunctionsPeer::NAME, AutoFunctionsPeer::DESCRIPTION, AutoFunctionsPeer::CATEGORY);    
    protected static function AssignProperty($autofunctions, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoFunctionsPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoFunctionsPeer::$propertyNames[$id];
                    $autofunctions->{$method}($value);
                }
            }
        }
        return $autofunctions;
    }    
    public static function DoInsert($autofunctions)
    {
        $sql = "INSERT INTO ". AutoFunctionsPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoFunctionsPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoFunctionsPeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autofunctions->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autofunctions)
    {
        $sql = "UPDATE " . AutoFunctionsPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoFunctionsPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoFunctionsPeer::$propertyNames[$key];
                $sql .= addslashes( $autofunctions->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autofunctions->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoFunctionsPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoFunctionsPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autofunctions = new AutoFunctions();
        $autofunctions = AutoFunctionsPeer::AssignProperty($autofunctions, $row);
        return $autofunctions;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoFunctionsPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autofunctions = new AutoFunctions();
            $autofunctions = AutoFunctionsPeer::AssignProperty($autofunctions, $row);
            $list[] = $autofunctions;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoFunctionsPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
