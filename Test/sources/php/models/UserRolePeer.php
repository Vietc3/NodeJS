<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UserRolePeer
 *
 * @author Dell
 */
class UserRolePeer extends AutoUserRolePeer
{

    public static function RetrieveAllProjectIdByUserId($user_id)
    {
        $sql    = "Select DISTINCT project_id from " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$user_id' ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $list[] = $row["project_id"];
        }
        return $list;
    }

    public static function RetrieveAllRoleIdByProjectIdUserId($project_id, $user_id)
    {
        $sql    = "Select DISTINCT role_id from " . AutoUserRolePeer::TABLE_NAME . " WHERE project_id = '$project_id' AND user_id = '$user_id' ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $list[] = $row["role_id"];
        }
        return $list;
    }

    public static function RetrieveAllRoleIdByUserIdAndProjectId($user_id, $project_id)
    {
        $sql    = "Select DISTINCT role_id from " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$user_id' AND project_id = '$project_id' ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $list[] = $row["role_id"];
        }
        return $list;
    }

    public static function GetProjectDefault()
    {
        $sql    = "SELECT * FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$_SESSION[USER_ID]' AND is_project_default = '1' AND project_id != '0'";
        $row    = Database::fetch($sql);
        if ($row !== FALSE)
            return $row;
        return FALSE;
    }

    public static function GetProjectInforByProjectId($project_id)
    {
        $sql    = "SELECT * FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$_SESSION[USER_ID]' AND project_id = '$project_id'";
        $sth = Database::prepare($sql);
        if (!$sth) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row;
    }

    public static function SetDefaultProject()
    {
        $sql = "UPDATE " . AutoUserRolePeer::TABLE_NAME . " SET is_project_default = 0 WHERE user_id = '$_SESSION[USER_ID]'";
        Database::query($sql);
        $sql = "UPDATE " . AutoUserRolePeer::TABLE_NAME . " SET is_project_default = 1 WHERE user_id = '$_SESSION[USER_ID]' AND project_id = '$_SESSION[PROJECT_ID]'";
        Database::query($sql);
    }

    public static function SetDefaultProjectInfo()
    {
        $sql = "UPDATE " . AutoUserRolePeer::TABLE_NAME . " SET is_project_default = 0 WHERE user_id = '$_SESSION[USER_ID]'";
        Database::query($sql);
        $sql = "UPDATE " . AutoUserRolePeer::TABLE_NAME . " SET is_project_default = 1, page = '$_SESSION[PAGE]', rows = '$_SESSION[ROWS]', closed_hide = '$_SESSION[CLOSED_HIDE]', orderby = '$_SESSION[ORDERBY]', sort = '$_SESSION[SORT]' WHERE user_id = '$_SESSION[USER_ID]' AND project_id = '$_SESSION[PROJECT_ID]'";
        Database::query($sql);
    }

    public static function RetrieveCount($project_id)
    {
        $sql    = "SELECT COUNT(*) AS count FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE role_id != '0' AND project_id = '$project_id'";
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['count'];
    }
    
    public static function RetrieveAllNotAdminByProjectId($project_id) 
    {
        $sql = "Select * from " . AutoUserRolePeer::TABLE_NAME . " WHERE role_id != '0' AND project_id = '$project_id' ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouserrole = new AutoUserRole();
            $autouserrole = AutoUserRolePeer::AssignProperty($autouserrole, $row);
            $list[] = $autouserrole;
        }
        return $list;
    }

    public static function RetrieveAllByLimit($start, $limit, $project_id)
    {
        $sql    = "SELECT ur.*, u.full_name, r.name FROM " . AutoUserRolePeer::TABLE_NAME . " AS ur" .
                " LEFT JOIN " . AutoUserPeer::TABLE_NAME . " AS u ON ur.user_id = u.id" .
                " LEFT JOIN " . AutoRolePeer::TABLE_NAME . " AS r ON ur.role_id = r.id" .
                " WHERE ur.role_id != '0' AND project_id = '$project_id' ORDER BY u.full_name LIMIT $start , $limit";

        $sth = Database::prepare($sql);
        
        $responce .= "<thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>";

        if ($sth)
        {
            $list = array();
            while ($row = $sth->fetch(PDO::FETCH_ASSOC))
            {
                $autouserrole            = new AutoUserRole();
                $autouserrole            = AutoUserRolePeer::AssignProperty($autouserrole, $row);
                $autouserrole->full_name = $row['full_name'];
                $autouserrole->name      = $row['name'];

                $user_role = new UserRole();
                $user_role->setId($row[id]);
                $user_role->setUserId($row[user_id]);
                $user_role->setRoleId($row[role_id]);
                if (count($list) > 0)
                {
                    $count = 0;
                    for ($i = 0; $i < count($list); $i++)
                    {
                        if ($list[$i]->getUserId() == $autouserrole->getUserId())
                        {
                            $list[$i]->name .= ", " . $autouserrole->name;
                            $count++;
                        }
                    }
                    if ($count == 0)
                        $list[] = $autouserrole;
                } else
                {
                    $list[] = $autouserrole;
                }
            }

            $responce .= "<tbody>";
            for ($i = 0; $i < count($list); $i++)
            {
                $responce .= "<tr>";
                $responce .= "<td><a href='". link_to("userrole/edit?id=". $list[$i]->getId()."&project_id=$project_id"). "'>" . $list[$i]->full_name . "</a></td>";
                $responce .= "<td>" . $list[$i]->name . "</td>";
                $responce .= "<td class='center' width='20%'><a title='Delete' href='javascript:deleteuserrole(" . $list[$i]->getUserId() . ")'><img src='";
                $responce .= href_to('templates/quickadmin/_layout/images/icons/delete.png') . "'></a></td>";
                $responce .= "</tr>";
            }
            $responce .= "</tbody>";
        }
        else
        {
            $responce .= "<tr>";
            $responce .= "<td colspan='4' style='text-align:center'>";
            $responce .= "There is no available users!";
            $responce .= "</td>";
            $responce .= "</tr>";
        }
        return $responce;
    }
    
    
    public static function RetrieveByUserIdProjectIdRoleId($user_id, $project_id, $role_id)
    {
        $sql = "Select * from ". AutoUserRolePeer::TABLE_NAME ." where user_id='$user_id' AND project_id='$project_id' AND role_id='$role_id' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
                return null;
        $autouserrole = new AutoUserRole();
        $autouserrole = AutoUserRolePeer::AssignProperty($autouserrole, $row);
        return $autouserrole;
    }

    public static function DeleteByUserIdAndProjectId($user_id, $project_id)
    {
        $sql = "DELETE FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$user_id' AND project_id = '$project_id'";
        Database::query($sql);
    }
    
    public static function DeleteAllByUserId($user_id)
    {
        $sql = "DELETE FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$user_id'";
        Database::query($sql);
    }

    public static function UnDefaultForAllProjectByUserId($user_id)
    {
        $sql = "UPDATE " . AutoUserRolePeer::TABLE_NAME . " SET is_project_default = '0' WHERE user_id = '$user_id'";
        Database::query($sql);
    }
    
        

}

?>
