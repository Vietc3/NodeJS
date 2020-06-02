<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of IssueBackupPeer
 *
 * @author Dell
 */
class IssueBackupPeer extends AutoIssueBackupPeer
{

    public static function getRecordPerPages($start, $per_page)
    {
        $sql = "Select * from " . AutoIssueBackupPeer::TABLE_NAME . " limit $start, $per_page";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoIssueBackup = new AutoIssueBackup();
            $autoIssueBackup = AutoIssueBackupPeer::AssignProperty($autoIssueBackup, $row);
            $list[] = $autoIssueBackup;
        }
        return $list;
    }

    public static function getTotalRecord()
    {
        $sql = "select count(*) as total from " . AutoIssueBackupPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public static function getMaxCode($id)
    {
        $sql = "select max(code) as code from " . AutoIssueBackupPeer::TABLE_NAME . " where project_id=$id";
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['code'];
    }

    public static function getAllByIssueId($issue_id)
    {
        $sql = "Select * from " . AutoIssueBackupPeer::TABLE_NAME . " WHERE issue_id = '$issue_id' ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissuebackup = new AutoIssueBackup();
            $autoissuebackup = AutoIssueBackupPeer::AssignProperty($autoissuebackup, $row);
            $list[] = $autoissuebackup;
        }
        return $list;
    }

    public static function createFromIssue( $issue, $comment = null, $attachment = null)
    {
        $issue_backup = new IssueBackup();
        $issue_backup->setIssueId($issue->getId());
        $issue_backup->setCode($issue->getCode());
        $issue_backup->setName($issue->getName());
        $issue_backup->setDescription($issue->getDescription());
        $issue_backup->setProjectId($issue->getProjectId());
        $issue_backup->setTypeId($issue->getTypeId());
        $issue_backup->setStatusId($issue->getStatusId());
        $issue_backup->setAssigneeId($issue->getAssigneeId());
        $issue_backup->setCreatorId($issue->getCreatorId());
        $issue_backup->setPriority($issue->getPriority());
        $issue_backup->setParentIssueId($issue->getParentIssueId());
        $issue_backup->setStartDate($issue->getStartDate());
        $issue_backup->setEndDate($issue->getEndDate());
        $issue_backup->setCompletePercent($issue->getCompletePercent());
        $issue_backup->setCreatedAt($issue->getCreatedAt());
        $issue_backup->setModified($issue->getModified());     
        $issue_backup->setWatchers($issue->getWatchers());     
        
        $issue_backup->setAttachment($attachment);
        $issue_backup->setComment($comment);        
        $issue_backup->setModifier($_SESSION[USER_ID]);
        
        $issue_backup->setHours($issue->getHours());

        $issue_backup->save();
    }

    public static function getDifferentValues($issue_before, $issue_after)
    {
        
        $result = array();
        if ($issue_before->getName() != $issue_after->getName())
        {
            $result['name'] = true;
            $result['name_before'] = $issue_before->getName();
            $result['name_after'] = $issue_after->getName();
        }
        if ($issue_before->getDescription() != $issue_after->getDescription())
        {
            $result['description'] = true;
        }
        if ($issue_before->getTypeId() != $issue_after->getTypeId())
        {
            $result['type'] = true;
            
            $type_before = IssueTypePeer::RetrieveById($issue_before->getTypeId());
            $result['type_before'] = $type_before? $type_before->getName() : "NONE" ;
            
            $type_after = IssueTypePeer::RetrieveById($issue_after->getTypeId());
            $result['type_after'] = $type_after? $type_after->getName() : "NONE" ;
        }
        if ($issue_before->getStatusId() != $issue_after->getStatusId())
        {
            $result['status'] = true;
            
            $status_before = IssueStatusPeer::RetrieveById($issue_before->getStatusId());
            $result['status_before'] = $status_before? $status_before->getName() : "NONE";
            
            $status_after = IssueStatusPeer::RetrieveById($issue_after->getStatusId());
            $result['status_after'] = $status_after? $status_after->getName() : "NONE";
        }
        if ($issue_before->getAssigneeId() != $issue_after->getAssigneeId())
        {
            $result['assignee'] = true;
            
            $assignee_before = UserPeer::RetrieveById($issue_before->getAssigneeId());
            $result['assignee_before'] = $assignee_before? $assignee_before->getFullName() : "NONE";
            
            $assignee_after = UserPeer::RetrieveById($issue_after->getAssigneeId());
            $result['assignee_after'] = $assignee_after? $assignee_after->getFullName() : "NONE";
        }
        if ($issue_before->getPriority() != $issue_after->getPriority())
        {
            $result['priority'] = true;
            $result['priority_before'] = Common::$gPriority['key'][$issue_before->getPriority()];
            $result['priority_after'] = Common::$gPriority['key'][$issue_after->getPriority()];
        }
        if ($issue_before->getParentIssueId() != $issue_after->getParentIssueId())
        {
            $result['parent_issue'] = true;
            $result['parent_issue_before'] = $issue_before->getParentIssueId() != 0 ? IssuePeer::RetrieveById($issue_before->getParentIssueId())->getName() : "";
            $result['parent_issue_after'] = $issue_after->getParentIssueId() != 0 ? IssuePeer::RetrieveById($issue_after->getParentIssueId())->getName() : "";
        }
        if (strtotime($issue_before->getStartDate()) != strtotime($issue_after->getStartDate()))
        {
            $result['start_date'] = true;
            $result['start_date_before'] = $issue_before->getStartDate();
            $result['start_date_after'] = $issue_after->getStartDate();
        }
        if (strtotime($issue_before->getEndDate()) != strtotime($issue_after->getEndDate()))
        {
            $result['end_date'] = true;
            $result['end_date_before'] = $issue_before->getEndDate();
            $result['end_date_after'] = $issue_after->getEndDate();
        }
        if ($issue_before->getCompletePercent() != $issue_after->getCompletePercent())
        {
            $result['complete_percent'] = true;
            $result['complete_percent_before'] = $issue_before->getCompletePercent();
            $result['complete_percent_after'] = $issue_after->getCompletePercent();
        }
        if ($issue_before->getWatchers() != $issue_after->getWatchers())
        {
            $result['watchers'] = true;
            $result['watchers_before'] = $issue_before->getWatchers();
            $result['watchers_after'] = $issue_after->getWatchers();
        }
        return $result;
    }
    
    public static function CalcTotalTime($issue_id)
    {
        $sql = "SELECT SUM(hours) as total FROM " . AutoIssueBackupPeer::TABLE_NAME . " WHERE issue_id=".$issue_id;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return round($row['total'], 1);
    }

}

?>
