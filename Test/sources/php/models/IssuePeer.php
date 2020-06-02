<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of IssuePeer
 *
 * @author Dell
 */
class IssuePeer extends AutoIssuePeer
{

    public static function getQuatityByType($project_id)
    {
        $sql = "SELECT `issue_type`.name, count(`issue_type`.name) as countid FROM " . AutoIssueTypePeer::TABLE_NAME . "," . AutoIssuePeer::TABLE_NAME . " where `issue`.type_id =  `issue_type`.id and project_id = $project_id GROUP BY `issue_type`.id";
        $list = array();
        $sth = Database::prepare($sql);
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $list[] = $row;
        }
        return $list;
    }

    public static function getQuatityByStatus($project_id)
    {
        $sql = "SELECT `issue_status`.name, count(`issue_status`.name) as countid FROM " . AutoIssueStatusPeer::TABLE_NAME . "," . AutoIssuePeer::TABLE_NAME . " where `issue`.status_id =  `issue_status`.id and project_id = $project_id GROUP BY `issue_status`.id";
        $list = array();
        $sth = Database::prepare($sql);
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $list[] = $row;
        }
        return $list;
    }

    public static function RetrieveByProjectId($project_id)
    {
        $sql = "Select * from " . AutoIssuePeer::TABLE_NAME . " where project_id='$project_id'";
        $list = array();
        $sth = Database::prepare($sql);
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissue = new AutoIssue();
            $autoissue = AutoIssuePeer::AssignProperty($autoissue, $row);
            $list[] = $autoissue;
        }
        return $list;
    }

    public static function RetrieveByProjectIdTypeIdStatusId($project_id, $type_id, $status_id)
    {
        $sql = "Select * from " . AutoIssuePeer::TABLE_NAME . " where project_id='$project_id' AND type_id = '$type_id' AND status_id = '$status_id'";
        $list = array();
        $sth = Database::prepare($sql);
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissue = new AutoIssue();
            $autoissue = AutoIssuePeer::AssignProperty($autoissue, $row);
            $list[] = $autoissue;
        }
        return $list;
    }

    public static function getMaxCode($id)
    {
        $sql = "select max(code) as code from " . AutoIssuePeer::TABLE_NAME . " where project_id='$id'";
        $record = Database::fetch($sql);
        if ($record['code'] == null)
            return 0;
        return $record['code'];
    }

    public static function getMaxId()
    {
        $sql = "select max(id) as max_id from " . AutoIssuePeer::TABLE_NAME;
        $record = Database::fetch($sql);
        if ($record['max_id'] == null)
            return 0;
        return $record['max_id'];
    }

    public static function getAllCompletePercent($project_id)
    {
        $sql = "select round(sum(complete_percent)/count(id)) as complete from " . AutoIssuePeer::TABLE_NAME . " where project_id= '$project_id'";
        $record = Database::fetch($sql);
        if ($record['complete'] == null)
            return 0;
        return $record['complete'];
    }

    public static function getParentIssuesByType($issue_type, $project_id, $issue_id)
    {
        $sql = "Select * from " . AutoIssuePeer::TABLE_NAME . " where type_id='$issue_type' and project_id='$project_id' and id !='$issue_id' and status_id != 6 ORDER BY order_id DESC, level ASC, id ASC";        
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
    
    
    public static function getSqlQueryBySearchText($search_text)
    {
        $sql = "";
        if ($search_text != '')
        {
            $sql .= " AND ( ";
            $sql .= " i.name LIKE ('%$search_text%') ";
            $sql .= " OR i.code LIKE ('%$search_text%') ";
            $sql .= " OR i.description LIKE ('%$search_text%') ";
            $sql .= " OR i.attachment LIKE ('%$search_text%') ";
            $sql .= " OR i.complete_percent LIKE ('$search_text') ";
            $sql .= " OR i.hours LIKE ('$search_text') ";
            $sql .= " OR i.start_date LIKE ('%$search_text%') ";
            $sql .= " OR i.end_date LIKE ('%$search_text%') ";
            $sql .= " OR i.created_at LIKE ('%$search_text%') ";
            $sql .= " OR t.name LIKE ('%$search_text%') ";
            $sql .= " OR s.name LIKE ('%$search_text%') ";
            $sql .= " OR u.full_name LIKE ('%$search_text%') ";
            $sql .= " ) ";
        }
        return $sql;
    }
    
    public static function RetrieveCount($project_id, $closed_hide = false, $search_text = '')
    {
        $sql = "SELECT COUNT(*) AS count FROM " . AutoIssuePeer::TABLE_NAME . " AS i" .
                " LEFT JOIN " . AutoIssueStatusPeer::TABLE_NAME . " AS s ON i.status_id = s.id" .
                " LEFT JOIN " . AutoIssueTypePeer::TABLE_NAME . " AS t ON i.type_id = t.id" .
                " LEFT JOIN " . AutoUserPeer::TABLE_NAME . " AS u ON i.assignee_id = u.id";
                
        $sql .= " WHERE i.project_id = '$project_id' ";
        
        if ($closed_hide)
            $sql .= " AND status_id != " . CLOSED_ISSUE_STATUS_ID;
        
        $sql .= IssuePeer::getSqlQueryBySearchText($search_text);
        return Database::getCount($sql);        
    }

    public static function RetrieveOpenIssueByUserIdAndProjectId($user_id, $project_id)
    {

        $sql = "SELECT i.*, s.name AS status, t.name AS type, u.full_name AS assignee FROM " . AutoIssuePeer::TABLE_NAME . " AS i" .
                " LEFT JOIN " . AutoIssueStatusPeer::TABLE_NAME . " AS s ON i.status_id = s.id" .
                " LEFT JOIN " . AutoIssueTypePeer::TABLE_NAME . " AS t ON i.type_id = t.id" .
                " LEFT JOIN " . AutoUserPeer::TABLE_NAME . " AS u ON i.assignee_id = u.id" .
                " WHERE i.project_id = '$project_id' and u.id = '$user_id' and i.status_id != " . CLOSED_ISSUE_STATUS_ID . " ORDER BY i.id DESC ";

        $list = array();
        $sth = Database::prepare($sql);
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissue = new AutoIssue();
            $autoissue = AutoIssuePeer::AssignProperty($autoissue, $row);
            $autoissue->status = $row['status'];
            $autoissue->type = $row['type'];
            $autoissue->assignee = $row['assignee'];
            $priority = Common::$gPriority['key'][$row['priority']];
            $autoissue->setPriority($priority);

            $list[] = $autoissue;
        }
        return $list;
    }
    public static function RetrieveAllByLimit($project_id, $start, $limit, $closed_hide = false, $search_text = '')
    {
        $sql = "SELECT i.*, s.name AS status, t.name AS type, u.full_name AS assignee FROM " . AutoIssuePeer::TABLE_NAME . " AS i" .
                " LEFT JOIN " . AutoIssueStatusPeer::TABLE_NAME . " AS s ON i.status_id = s.id" .
                " LEFT JOIN " . AutoIssueTypePeer::TABLE_NAME . " AS t ON i.type_id = t.id" .
                " LEFT JOIN " . AutoUserPeer::TABLE_NAME . " AS u ON i.assignee_id = u.id";
                
        $sql .= " WHERE i.project_id = '$project_id' ";
        
        if ($closed_hide)
            $sql .= " AND i.status_id != ". CLOSED_ISSUE_STATUS_ID;
        
        $sql .= IssuePeer::getSqlQueryBySearchText($search_text);
            
        $sql .= " ORDER BY i.order_id DESC, i.level ASC, i.id ASC LIMIT $start, $limit";
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoissue = new AutoIssue();
            $autoissue = AutoIssuePeer::AssignProperty($autoissue, $row);
            $autoissue->status = $row['status'];
            $autoissue->type = $row['type'];
            $autoissue->assignee = $row['assignee'];
            $autoissue->setPriority( Common::$gPriority['key'][$row['priority']]);
            $list[] = $autoissue;
        }
        return $list;
    }


    public static function Delete($id)
    {
        $issue_hash = array();
        $issues_list = IssuePeer::RetrieveAll();
        foreach ($issues_list as $issue)
            $issue_hash[$issue->getId()] = $issue;
        
        $child_ids = $issue_hash[$id]->getChildIds();
        
        if (!empty($child_ids))
        {
            $child_ids = explode(',', $child_ids);
            foreach ($child_ids as $child_id)
            {
                $child_issue = isset($issue_hash[$child_id])? $issue_hash[$child_id] : null;
                if ($child_issue)
                {
                    $child_issue->setOrderId($child_id);
                    $child_issue->setLevel(0);
                    $child_issue->setParentIssueId(0);
                    $child_issue->save();
                    TryUpdateChildIssues($issue_hash, $child_id);
                }
            }
        }
        
        $sql = "DELETE FROM " . IssueBackupPeer::TABLE_NAME . " WHERE issue_id = '$id'";
        Database::query($sql);
        $sql = "DELETE FROM " . NotificationsPeer::TABLE_NAME . " WHERE issue_id = '$id'";
        Database::query($sql);
        $sql = "DELETE FROM " . IssuePeer::TABLE_NAME . " WHERE id = '$id'";
        Database::query($sql);
        
        return true;
    }

    public static function DeleteAttachment($issue_id)
    {
        $issue = IssuePeer::RetrieveById($issue_id);
        if (!$issue)
            return 0;

        $file_name = $issue->getAttachment();

        if (!$file_name)
            return 1;

        $sql = "UPDATE issue SET attachment='' WHERE id =" . $issue->getId();
        Database::query($sql);

        if (file_exists("uploads/attachment/$file_name"))
            unlink("uploads/attachment/$file_name");

        return 1;
    }

    public static function SetOrderId($issue_id)
    {
        $sql = "UPDATE " . AutoIssuePeer::TABLE_NAME . " SET order_id = id WHERE id = '$issue_id'";
        Database::query($sql);
    }

}

?>
