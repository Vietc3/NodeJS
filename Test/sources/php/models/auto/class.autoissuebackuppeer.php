<?php
class AutoIssueBackupPeer
{
    const TABLE_NAME = 'issue_backup';
    
    const ID = 'id';
    const ISSUE_ID = 'issue_id';
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
    const START_DATE = 'start_date';
    const END_DATE = 'end_date';
    const COMPLETE_PERCENT = 'complete_percent';
    const ATTACHMENT = 'attachment';
    const CREATED_AT = 'created_at';
    const MODIFIED = 'modified';
    const COMMENT = 'comment';
    const MODIFIER = 'modifier';
    const WATCHERS = 'watchers';
    const HOURS = 'hours';
    protected static $propertyNames = array('Id', 'IssueId', 'Code', 'Name', 'Description', 'ProjectId', 'TypeId', 'StatusId', 'AssigneeId', 'CreatorId', 'Priority', 'ParentIssueId', 'StartDate', 'EndDate', 'CompletePercent', 'Attachment', 'CreatedAt', 'Modified', 'Comment', 'Modifier', 'Watchers', 'Hours');
    protected static $propertyNameInts = array(0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1);
    protected static $colNames = array(AutoIssueBackupPeer::ID, AutoIssueBackupPeer::ISSUE_ID, AutoIssueBackupPeer::CODE, AutoIssueBackupPeer::NAME, AutoIssueBackupPeer::DESCRIPTION, AutoIssueBackupPeer::PROJECT_ID, AutoIssueBackupPeer::TYPE_ID, AutoIssueBackupPeer::STATUS_ID, AutoIssueBackupPeer::ASSIGNEE_ID, AutoIssueBackupPeer::CREATOR_ID, AutoIssueBackupPeer::PRIORITY, AutoIssueBackupPeer::PARENT_ISSUE_ID, AutoIssueBackupPeer::START_DATE, AutoIssueBackupPeer::END_DATE, AutoIssueBackupPeer::COMPLETE_PERCENT, AutoIssueBackupPeer::ATTACHMENT, AutoIssueBackupPeer::CREATED_AT, AutoIssueBackupPeer::MODIFIED, AutoIssueBackupPeer::COMMENT, AutoIssueBackupPeer::MODIFIER, AutoIssueBackupPeer::WATCHERS, AutoIssueBackupPeer::HOURS);    
    protected static function AssignProperty($autoissuebackup, $row)
    {
        foreach ($row as $key => $value)
        {
            foreach (AutoIssueBackupPeer::$colNames as $id => $colName)
            {
                if ($key == $colName)
                {
                    $method = 'set' . AutoIssueBackupPeer::$propertyNames[$id];
                    $autoissuebackup->{$method}($value);
                }
            }
        }
        return $autoissuebackup;
    }    
    public static function DoInsert($autoissuebackup)
    {
        $sql = "INSERT INTO ". AutoIssueBackupPeer::TABLE_NAME ;
        $sql .= " ( "; 
        foreach ( AutoIssueBackupPeer::$colNames as $colname)
        {
            if (strtolower($colname) != 'id')
                        $sql .= $colname.',';
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ') VALUES (';
        foreach (AutoIssueBackupPeer::$propertyNames as $key=>$property)
        {
            if (strtolower($property) != 'id')
            {
                $sql .= "'";
                $method = "get{$property}";
                
                $value = addslashes( $autoissuebackup->{$method}() );
                if (AutoIssueBackupPeer::$propertyNameInts[$key] && empty($value))
                    $value = 0;
                $sql .= $value;
                $sql .= "',";

            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoUpdate($autoissuebackup)
    {
        $sql = "UPDATE " . AutoIssueBackupPeer::TABLE_NAME ;
        $sql .= " SET ";
        foreach (AutoIssueBackupPeer::$colNames as $key=>$colname)
        {
            if (strtolower($colname) != 'id')
            {
                $sql .= $colname."='";
                $method = "get".AutoIssueBackupPeer::$propertyNames[$key];
                $value = addslashes( $autoissuebackup->{$method}() );
                if (AutoIssueBackupPeer::$propertyNameInts[$key] && empty($value))
                    $value = 0;
                $sql .= $value;
                $sql .= "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " WHERE id = '" . $autoissuebackup->getId() . "'";
        $result = Database::query($sql);
        return $result;
    }    
    public static function DoDelete($id)
    {
        $sql = "DELETE FROM " . AutoIssueBackupPeer::TABLE_NAME . " WHERE id = '". $id . "'";
        return $result = Database::query($sql);
    }    
    public static function GetInsertId()
    {
        return Database::GetInsertId();
    }    
    public static function RetrieveById($id)
    {
        $sql = "Select * from ". AutoIssueBackupPeer::TABLE_NAME ." where id='$id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;      
        if ($sth->rowCount() == 0) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autoissuebackup = new AutoIssueBackup();
        $autoissuebackup = AutoIssueBackupPeer::AssignProperty($autoissuebackup, $row);
        return $autoissuebackup;
    }
    public static function RetrieveAll() 
    {
        $sql = "Select * from " . AutoIssueBackupPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissuebackup = new AutoIssueBackup();
            $autoissuebackup = AutoIssueBackupPeer::AssignProperty($autoissuebackup, $row);
            $list[] = $autoissuebackup;
        }
        return $list;
    }
    
    public static function RetrieveCount()
    {
        $sql    = "SELECT * FROM " . AutoIssueBackupPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;      
        return $sth->rowCount();
    }
}
?>
