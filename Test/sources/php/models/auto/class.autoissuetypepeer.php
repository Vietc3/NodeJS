<?php
class AutoIssueTypePeer
{
    const TABLE_NAME = 'issue_type';
    
    const ID = 'id';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const COLOR = 'color';
    protected static $propertyNames = array('Id', 'Name', 'Description', 'Color');
    protected static $colNames = array(AutoIssueTypePeer::ID, AutoIssueTypePeer::NAME, AutoIssueTypePeer::DESCRIPTION, AutoIssueTypePeer::COLOR);    
    protected static function AssignProperty($autoissuetype, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoIssueTypePeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoIssueTypePeer::$propertyNames[$id];
                    $autoissuetype->{$method}($value);
                }
            }
        }
        return $autoissuetype;
    }    
    public static function DoInsert($autoissuetype)
    {
        $sql = "INSERT INTO ". AutoIssueTypePeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoIssueTypePeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoIssueTypePeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autoissuetype->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autoissuetype)
    {
        $sql = "UPDATE " . AutoIssueTypePeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoIssueTypePeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoIssueTypePeer::$propertyNames[$key];
                $sql .= addslashes( $autoissuetype->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autoissuetype->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoIssueTypePeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoIssueTypePeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autoissuetype = new AutoIssueType();
        $autoissuetype = AutoIssueTypePeer::AssignProperty($autoissuetype, $row);
        return $autoissuetype;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoIssueTypePeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissuetype = new AutoIssueType();
            $autoissuetype = AutoIssueTypePeer::AssignProperty($autoissuetype, $row);
            $list[] = $autoissuetype;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoIssueTypePeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
