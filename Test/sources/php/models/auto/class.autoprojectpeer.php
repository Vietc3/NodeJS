<?php
class AutoProjectPeer
{
    const TABLE_NAME = 'project';
    
    const ID = 'id';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const START_DATE = 'start_date';
    const END_DATE = 'end_date';
    const COMPLETE_PERCENT = 'complete_percent';
    const PROJECT_STATUS_ID = 'project_status_id';
    const CREATED_AT = 'created_at';
    const CREATOR_ID = 'creator_id';
    const MODIFIED = 'modified';
    protected static $propertyNames = array('Id', 'Name', 'Description', 'StartDate', 'EndDate', 'CompletePercent', 'ProjectStatusId', 'CreatedAt', 'CreatorId', 'Modified');
    protected static $colNames = array(AutoProjectPeer::ID, AutoProjectPeer::NAME, AutoProjectPeer::DESCRIPTION, AutoProjectPeer::START_DATE, AutoProjectPeer::END_DATE, AutoProjectPeer::COMPLETE_PERCENT, AutoProjectPeer::PROJECT_STATUS_ID, AutoProjectPeer::CREATED_AT, AutoProjectPeer::CREATOR_ID, AutoProjectPeer::MODIFIED);    
    protected static function AssignProperty($autoproject, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoProjectPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoProjectPeer::$propertyNames[$id];
                    $autoproject->{$method}($value);
                }
            }
        }
        return $autoproject;
    }    
    public static function DoInsert($autoproject)
    {
        $sql = "INSERT INTO ". AutoProjectPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoProjectPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoProjectPeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autoproject->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autoproject)
    {
        $sql = "UPDATE " . AutoProjectPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoProjectPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoProjectPeer::$propertyNames[$key];
                $sql .= addslashes( $autoproject->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autoproject->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoProjectPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoProjectPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autoproject = new AutoProject();
        $autoproject = AutoProjectPeer::AssignProperty($autoproject, $row);
        
        return $autoproject;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoProjectPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoproject = new AutoProject();
            $autoproject = AutoProjectPeer::AssignProperty($autoproject, $row);
            $list[] = $autoproject;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoProjectPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
