<?php
class AutoUserPeer
{
    const TABLE_NAME = 'user';
    
    const ID = 'id';
    const EMAIL_ADDRESS = 'email_address';
    const PASSWORD = 'password';
    const FULL_NAME = 'full_name';
    const IS_ACTIVE = 'is_active';
    const TOKEN = 'token';
    const CREATED_AT = 'created_at';
    const IS_ADMIN = 'is_admin';
    const MODIFIED = 'modified';
    protected static $propertyNames = array('Id', 'EmailAddress', 'Password', 'FullName', 'IsActive', 'Token', 'CreatedAt', 'IsAdmin', 'Modified');
    protected static $propertyNameInts = array(0, 0, 0, 0, 1, 1, 0, 1, 0);
    protected static $colNames = array(AutoUserPeer::ID, AutoUserPeer::EMAIL_ADDRESS, AutoUserPeer::PASSWORD, AutoUserPeer::FULL_NAME, AutoUserPeer::IS_ACTIVE, AutoUserPeer::TOKEN, AutoUserPeer::CREATED_AT, AutoUserPeer::IS_ADMIN, AutoUserPeer::MODIFIED);    
    protected static function AssignProperty($autouser, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoUserPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoUserPeer::$propertyNames[$id];
                    $autouser->{$method}($value);
                }
            }
        }
        return $autouser;
    }    
    public static function DoInsert($autouser)
    {
        $sql = "INSERT INTO ". AutoUserPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoUserPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoUserPeer::$propertyNames as $key=>$property)
        {
            if (strtolower($property) != 'id')
            {
                if (AutoUserPeer::$propertyNameInts[$key])
                {
                    $method = "get{$property}";
                    $value =  addslashes( $autouser->{$method}() );
                    if ($value == null || empty($value))
                        $value = 0;
                    $sql .= "{$value},";
                }
                else {
                    $sql .= "'";
                    $method = "get{$property}";
                    $sql .= addslashes( $autouser->{$method}() );
                    $sql .= "',";
                }
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autouser)
    {
        $sql = "UPDATE " . AutoUserPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoUserPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoUserPeer::$propertyNames[$key];
                $sql .= addslashes( $autouser->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autouser->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoUserPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoUserPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autouser = new AutoUser();
        $autouser = AutoUserPeer::AssignProperty($autouser, $row);
        return $autouser;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoUserPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouser = new AutoUser();
            $autouser = AutoUserPeer::AssignProperty($autouser, $row);
            $list[] = $autouser;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoUserPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
