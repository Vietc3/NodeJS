<?php
class AutoIssueHistoryPeer
{
    const TABLE_NAME = 'issue_history';
    
    const ID = 'id';
    const ISSUE_ID = 'issue_id';
    const ASSIGNER_FROM_ID = 'assigner_from_id';
    const ASSIGNER_TO_ID = 'assigner_to_id';
    const STATUS_FROM_ID = 'status_from_id';
    const STATUS_TO_ID = 'status_to_id';
    const CREATED_AT = 'created_at';
    protected static $propertyNames = array('Id', 'IssueId', 'AssignerFromId', 'AssignerToId', 'StatusFromId', 'StatusToId', 'CreatedAt');
    protected static $colNames = array(AutoIssueHistoryPeer::ID, AutoIssueHistoryPeer::ISSUE_ID, AutoIssueHistoryPeer::ASSIGNER_FROM_ID, AutoIssueHistoryPeer::ASSIGNER_TO_ID, AutoIssueHistoryPeer::STATUS_FROM_ID, AutoIssueHistoryPeer::STATUS_TO_ID, AutoIssueHistoryPeer::CREATED_AT);    
    protected static function AssignProperty($autoissuehistory, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoIssueHistoryPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoIssueHistoryPeer::$propertyNames[$id];
                    $autoissuehistory->{$method}($value);
                }
            }
        }
        return $autoissuehistory;
    }    
    public static function DoInsert($autoissuehistory)
    {
        $sql = "INSERT INTO ". AutoIssueHistoryPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoIssueHistoryPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoIssueHistoryPeer::$propertyNames as $property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                $sql .= addslashes( $autoissuehistory->{$method}() );
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autoissuehistory)
    {
        $sql = "UPDATE " . AutoIssueHistoryPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoIssueHistoryPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoIssueHistoryPeer::$propertyNames[$key];
                $sql .= addslashes( $autoissuehistory->{$method}() );
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autoissuehistory->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoIssueHistoryPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoIssueHistoryPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autoissuehistory = new AutoIssueHistory();
        $autoissuehistory = AutoIssueHistoryPeer::AssignProperty($autoissuehistory, $row);
        return $autoissuehistory;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoIssueHistoryPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissuehistory = new AutoIssueHistory();
            $autoissuehistory = AutoIssueHistoryPeer::AssignProperty($autoissuehistory, $row);
            $list[] = $autoissuehistory;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoIssueHistoryPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
