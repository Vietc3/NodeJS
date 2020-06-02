<?php
class AutoUserRolePeer
{
    const TABLE_NAME = 'user_role';
    
    const ID = 'id';
    const PROJECT_ID = 'project_id';
    const USER_ID = 'user_id';
    const ROLE_ID = 'role_id';
    const IS_PROJECT_DEFAULT = 'is_project_default';
    const PAGE = 'page';
    const ROWS = 'rows';
    const CLOSED_HIDE = 'closed_hide';
    const ORDERBY = 'orderby';
    const SORT = 'sort';
    protected static $propertyNames = array('Id', 'ProjectId', 'UserId', 'RoleId', 'IsProjectDefault', 'Page', 'Rows', 'ClosedHide', 'Orderby', 'Sort');
    protected static $propertyNameInts = array(0, 1, 1, 1, 1, 1, 1, 1, 0, 0);
    protected static $colNames = array(AutoUserRolePeer::ID, AutoUserRolePeer::PROJECT_ID, AutoUserRolePeer::USER_ID, AutoUserRolePeer::ROLE_ID, AutoUserRolePeer::IS_PROJECT_DEFAULT, AutoUserRolePeer::PAGE, AutoUserRolePeer::ROWS, AutoUserRolePeer::CLOSED_HIDE, AutoUserRolePeer::ORDERBY, AutoUserRolePeer::SORT);    
    protected static function AssignProperty($autouserrole, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoUserRolePeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoUserRolePeer::$propertyNames[$id];
                    $autouserrole->{$method}($value);
                }
            }
        }
        return $autouserrole;
    }    
    public static function DoInsert($autouserrole)
    {
        $sql = "INSERT INTO ". AutoUserRolePeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoUserRolePeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoUserRolePeer::$propertyNames as $key=>$property)
        {
            if (strtolower($property) != 'id')
            {
                if (AutoUserRolePeer::$propertyNameInts[$key])
                {
                    $method = "get{$property}";
                    $value =  addslashes( $autouserrole->{$method}() );
                    if ($value == null || empty($value))
                        $value = 0;
                    $sql .= "{$value},";
                }
                else {
                    $sql .= "'";
                    $method = "get{$property}";
                    $sql .= addslashes( $autouserrole->{$method}() );
                    $sql .= "',";
                }
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autouserrole)
    {
        $sql = "UPDATE " . AutoUserRolePeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoUserRolePeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoUserRolePeer::$propertyNames[$key];
                $sql .= addslashes( $autouserrole->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autouserrole->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoUserRolePeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autouserrole = new AutoUserRole();
        $autouserrole = AutoUserRolePeer::AssignProperty($autouserrole, $row);
        return $autouserrole;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoUserRolePeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouserrole = new AutoUserRole();
            $autouserrole = AutoUserRolePeer::AssignProperty($autouserrole, $row);
            $list[] = $autouserrole;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoUserRolePeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
