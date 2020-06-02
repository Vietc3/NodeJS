<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProjectPeer
 *
 * @author Dell
 */
class ProjectPeer extends AutoProjectPeer
{

    public static function setNonDefault()
    {
        $sql = "UPDATE " . AutoProjectPeer::TABLE_NAME;
        $sql .= " SET is_default = 0";

        $result = Database::query($sql);
        return $result;
    }

    public static function RetrieveCount()
    {
        $sql = "SELECT COUNT(*) AS count FROM " . AutoProjectPeer::TABLE_NAME . " WHERE id IN (SELECT project_id FROM user_role WHERE user_id = '$_SESSION[USER_ID]')";
        $row    = Database::fetch($sql);
        return $row['count'];
    }

    public static function RetrieveAllAfterNew()
    {
        $sql = "SELECT p.*, s.name AS status FROM " . AutoProjectPeer::TABLE_NAME . " AS p" .
                " LEFT JOIN " . AutoProjectStatusPeer::TABLE_NAME . " AS s ON p.project_status_id = s.id" .
                " WHERE p.id IN (SELECT project_id FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$_SESSION[USER_ID]') ORDER BY p.id DESC LIMIT 0 , 50";
        
        $list = array();
        
        $sth = Database::prepare($sql);
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoproject         = new AutoProject();
            $autoproject         = AutoProjectPeer::AssignProperty($autoproject, $row);
            $autoproject->status = $row['status'];

            $sql2     = "SELECT DISTINCT(project_id), is_project_default FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE project_id = $row[id] AND user_id = '$_SESSION[USER_ID]'";
            $sth2 = Database::prepare($sql2);
            if (!$sth2) continue;
            $rows    = $sth2->fetch(PDO::FETCH_ASSOC);

            if (!$rows)
                $autoproject->is_project_default = 0;
            else
                $autoproject->is_project_default = $rows['is_project_default'];

            $list[] = $autoproject;
        }
        return $list;
    }
    
    public static function RetrieveAllByLimit($start, $limit)
    {
        $sql = "SELECT p.*, s.name AS status FROM " . AutoProjectPeer::TABLE_NAME . " AS p" .
                " LEFT JOIN " . AutoProjectStatusPeer::TABLE_NAME . " AS s ON p.project_status_id = s.id" .
                " WHERE p.id IN (SELECT project_id FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$_SESSION[USER_ID]') ORDER BY p.id DESC LIMIT $start, $limit";

        $result = Database::query($sql);
        
        $responce .= "<thead>
                                <tr>
                                    <th width='20%'>Name</th>
                                    <th>Status</th>
                                    <th>Completed</th>
                                    <th>Default</th>
                                    <th>Start date</th>
                                    <th>End date</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>";

        if ($result)
        {
            $responce .= "<tbody>";
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC))
            {
                $sql     = "SELECT DISTINCT(project_id), is_project_default FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE project_id = $row[id] AND user_id = '$_SESSION[USER_ID]'";
                $rows    = Database::fetch($sql);

                if (!$rows)
                    $default = 0;
                else
                    $default = $rows[is_project_default];
                
                $responce .= "<tr>";
                $responce .= "<td><a href='".link_to("project/view?id=" . $row['id']) . "'>" . $row['name'] . "</a></td>";
                $responce .= "<td>" . $row['status'] . "</td>";
                $responce .= "<td class='center'>" . $row['complete_percent'] . " %</td>";
                $responce .= "<td class='center'><a title='Set default' href='javascript:setprojectdefault(" . $row['id'] . ")'><img src='";
                if($default == 1) 
                    $responce .= href_to('templates/quickadmin/_layout/images/icons/icon-16-default.png'); 
                else 
                    $responce .= href_to('templates/quickadmin/_layout/images/icons/icon-16-notdefault.png');
                $responce .= "'></a></td>";
                $responce .= "<td class='center'>" . $row['start_date'] . "</td>";
                $responce .= "<td class='center'>" . $row['end_date'] . "</td>";
                $responce .= "<td class='center'>" . $row['created_at'] . "</td>";
                $responce .= "<td class='center'><a title='Assign user' href='".link_to("userrole/list?project_id=" . $row['id']) . "'><img src='";
                $responce .= href_to('templates/quickadmin/_layout/images/icons/group.png') . "'></a>&nbsp;&nbsp;";
                $responce .= "<a title='Edit' href='".link_to("project/edit?id=" . $row['id']) . "'><img src='";
                $responce .= href_to('templates/quickadmin/_layout/images/icons/page_white_edit.png') . "'></a>&nbsp;&nbsp;";
                $responce .= "<a title='Delete' href='javascript:deleteproject(" . $row['id'] . ")'><img src='";
                $responce .= href_to('templates/quickadmin/_layout/images/icons/delete.png') . "'></a></td>";
                $responce .= "</tr>";
            }
            $responce .= "</tbody>";
        }
        else
        {
            $responce .= "<tr>";
            $responce .= "<td colspan='8' style='text-align:center'>";
            $responce .= "There is no available projects!";
            $responce .= "</td>";
            $responce .= "</tr>";
        }
        return $responce;
    }

    public static function RetrieveAllByUserId($user_id, $closed_hide = true)
    {
        $sql  = "Select * from " . AutoProjectPeer::TABLE_NAME . " WHERE id IN (SELECT project_id FROM " . AutoUserRolePeer::TABLE_NAME;
        $sql .= " WHERE user_id = '$user_id')";
        if ($closed_hide)
            $sql .= " AND (project_status_id = 1 or project_status_id = 2) ";
        $sql .= " ORDER BY id DESC";
        $list   = array();
        $sth = Database::prepare($sql);
        if (!$sth) return array();      
        if ($sth->rowCount() == 0) return array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoproject = new AutoProject();
            $autoproject = AutoProjectPeer::AssignProperty($autoproject, $row);
            $list[]      = $autoproject;
        }
        return $list;
    }

    public static function DeleteAllInforByProjectId($id)
    {
        $sql    = "DELETE FROM " . IssuePeer::TABLE_NAME . " WHERE project_id = '$id'";
        $result = Database::query($sql);

        $sql    = "DELETE FROM " . IssueBackupPeer::TABLE_NAME . " WHERE project_id = '$id'";
        $result = Database::query($sql);

        $sql    = "DELETE FROM " . UserRolePeer::TABLE_NAME . " WHERE project_id = '$id'";
        $result = Database::query($sql);

        $sql    = "DELETE FROM " . NotificationsPeer::TABLE_NAME . " WHERE project_id = '$id'";
        $result = Database::query($sql);

        ProjectPeer::DoDelete($id);
        
        return true;
    }
    public static function Delete($id)
    {
        if ($_SESSION[IS_ADMIN] == 1)
            return ProjectPeer::DeleteAllInforByProjectId($id);
        else
        {
            $sql    = "SELECT count(*) AS total FROM " . IssuePeer::TABLE_NAME . " WHERE project_id = '$id'";
            $record    = Database::fetch($sql);
            if ($record["total"] > 0)
                return false;
            else
                return ProjectPeer::DeleteAllInforByProjectId($id);
        }
        return true;
    }

}

?>
