<?php
class AutoIssuePeer
{
    const TABLE_NAME = 'issue';
    
    const ID = 'id';
    const CODE = 'code';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const PROJECT_ID = 'project_id';
    const TYPE_ID = 'type_id';
    const STATUS_ID = 'status_id';
    const ASSIGNEE_ID = 'assignee_id';
    const CREATOR_ID = 'creator_id';
    const PRIORITY = 'priority';
    const PARENT_ISSUE_ID = 'parent_issue_id';
    const CHILD_IDS = 'child_ids';
    const ORDER_ID = 'order_id';
    const LEVEL = 'level';
    const START_DATE = 'start_date';
    const END_DATE = 'end_date';
    const COMPLETE_PERCENT = 'complete_percent';
    const ATTACHMENT = 'attachment';
    const CREATED_AT = 'created_at';
    const MODIFIED = 'modified';
    const WATCHERS = 'watchers';
    const HOURS = 'hours';
    protected static $propertyNames = array('Id', 'Code', 'Name', 'Description', 'ProjectId', 'TypeId', 'StatusId', 'AssigneeId', 'CreatorId', 'Priority', 'ParentIssueId', 'ChildIds', 'OrderId', 'Level', 'StartDate', 'EndDate', 'CompletePercent', 'Attachment', 'CreatedAt', 'Modified', 'Watchers', 'Hours');
    protected static $propertyNameInts = array(0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1);
    protected static $colNames = array(AutoIssuePeer::ID, AutoIssuePeer::CODE, AutoIssuePeer::NAME, AutoIssuePeer::DESCRIPTION, AutoIssuePeer::PROJECT_ID, AutoIssuePeer::TYPE_ID, AutoIssuePeer::STATUS_ID, AutoIssuePeer::ASSIGNEE_ID, AutoIssuePeer::CREATOR_ID, AutoIssuePeer::PRIORITY, AutoIssuePeer::PARENT_ISSUE_ID, AutoIssuePeer::CHILD_IDS, AutoIssuePeer::ORDER_ID, AutoIssuePeer::LEVEL, AutoIssuePeer::START_DATE, AutoIssuePeer::END_DATE, AutoIssuePeer::COMPLETE_PERCENT, AutoIssuePeer::ATTACHMENT, AutoIssuePeer::CREATED_AT, AutoIssuePeer::MODIFIED, AutoIssuePeer::WATCHERS, AutoIssuePeer::HOURS);    
    protected static function AssignProperty($autoissue, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoIssuePeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoIssuePeer::$propertyNames[$id];
                    $autoissue->{$method}($value);
                }
            }
        }
        return $autoissue;
    }    
    public static function DoInsert($autoissue)
    {
        $sql = "INSERT INTO ". AutoIssuePeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoIssuePeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoIssuePeer::$propertyNames as $key=>$property)
        {
            if (strtolower($property) != 'id')
            {
                if (AutoIssuePeer::$propertyNameInts[$key])
                {
                    $method = "get{$property}";
                    $value =  addslashes( $autoissue->{$method}() );
                    if (empty($value))
                        $value = 0;
                    $sql .= "{$value},";
                }
                else {
                    $sql .= "'";
                    $method = "get{$property}";
                    $sql .= addslashes( $autoissue->{$method}() );
                    $sql .= "',";
                }

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autoissue)
    {
        $sql = "UPDATE " . AutoIssuePeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoIssuePeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoIssuePeer::$propertyNames[$key];
                
                $value = addslashes( $autoissue->{$method}() );
                if (AutoIssuePeer::$propertyNameInts[$key] && empty($value))
                    $value = 0;
                $sql .= $value;
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autoissue->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoIssuePeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoIssuePeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autoissue = new AutoIssue();
        $autoissue = AutoIssuePeer::AssignProperty($autoissue, $row);
        return $autoissue;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoIssuePeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissue = new AutoIssue();
            $autoissue = AutoIssuePeer::AssignProperty($autoissue, $row);
            $list[] = $autoissue;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoIssuePeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
