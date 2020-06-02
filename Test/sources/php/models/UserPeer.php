<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UserPeer
 *
 * @author Dell
 */
class UserPeer extends AutoUserPeer
{

    public static function RetrieveAllByProjectIdRoleId($project_id, $role_id)
    {
        $sql    = "SELECT * FROM " . UserPeer::TABLE_NAME . " where id in (Select user_id from " . AutoUserRolePeer::TABLE_NAME . " where project_id='$project_id' and role_id='$role_id')";        
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouser = new User();
            $autouser = AutoUserPeer::AssignProperty($autouser, $row);
            $list[]   = $autouser;
        }
        return $list;
    }

    public static function DoActive($token)
    {
        $sql    = "Update " . UserPeer::TABLE_NAME . "
                 SET isactive = '1'
                 WHERE token = '" . $token . "'";
        $result = Database::query($sql);
        return $result;
    }

    public static function guid()
    {
        mt_srand((double) microtime() * 10000); //optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45); // "-"
        $uuid   = chr(123)// "{"
                . substr($charid, 0, 8) . $hyphen
                . substr($charid, 8, 4) . $hyphen
                . substr($charid, 12, 4) . $hyphen
                . substr($charid, 16, 4) . $hyphen
                . substr($charid, 20, 12)
                . chr(125); // "}"
        return $uuid;
    }

    public static function RetrieveByEmailAddress($email_address)
    {
        $sql      = "select * from " . AutoUserPeer::TABLE_NAME . " where email_address = '" . $email_address . "'";
        $sth = Database::prepare($sql);
        if (!$sth) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
            return null;
        $autouser = new User();
        $autouser = AutoUserPeer::AssignProperty($autouser, $row);
        return $autouser;
    }

    public static function RetrieveByToken($token)
    {
        $sql      = "Select * from " . AutoUserPeer::TABLE_NAME . " where token='$token' limit 1";
        $sth = Database::prepare($sql);
        if (!$sth) return null;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row == null)
            return null;
        $autouser = new User();
        $autouser = AutoUserPeer::AssignProperty($autouser, $row);
        return $autouser;
    }

    public static function RetrieveAllAdministrator()
    {
        $sql = "Select * from " . AutoUserPeer::TABLE_NAME . " WHERE is_admin=1 ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouser = new AutoUser();
            $autouser = AutoUserPeer::AssignProperty($autouser, $row);
            $list[] = $autouser;
        }
        return $list;
    }

    public static function RetrieveAllByProjectId($project_id)
    {
        $sql    = "Select * from " . AutoUserPeer::TABLE_NAME . " WHERE id IN (SELECT user_id FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE project_id = '$project_id' AND role_id != '0') AND is_active = '1' ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouser = new User();
            $autouser = AutoUserPeer::AssignProperty($autouser, $row);
            $list[]   = $autouser;
        }
        return $list;
    }

    public static function RetrieveAllNotAdminForCreate($project_id)
    {
        $sql    = "Select * from " . AutoUserPeer::TABLE_NAME . " WHERE id NOT IN (SELECT user_id FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE project_id = '$project_id') AND is_admin != '1' ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouser = new User();
            $autouser = AutoUserPeer::AssignProperty($autouser, $row);
            $list[]   = $autouser;
        }
        return $list;
    }

    public static function RetrieveCount()
    {
        $sql    = "SELECT COUNT(*) AS count FROM " . AutoUserPeer::TABLE_NAME . " WHERE is_admin != '1'";
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['count'];
    }

    public static function RetrieveAllAfterNew()
    {
        $sql    = "Select * from " . AutoUserPeer::TABLE_NAME . " WHERE is_admin != '1' ORDER BY id DESC LIMIT 0 , 20";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouser = new User();
            $autouser = AutoUserPeer::AssignProperty($autouser, $row);
            $list[]   = $autouser;
        }
        return $list;
    }

    public static function RetrieveAllByLimit($start, $limit)
    {
        $sql    = "Select * from " . AutoUserPeer::TABLE_NAME . " WHERE is_admin != '1' ORDER BY id DESC LIMIT $start , $limit";
        $sth = Database::prepare($sql);
        
        $responce .= "<thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                    <th>Activated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>";

        if ($sth)
        {
            $responce .= "<tbody>";
            while ($row = $sth->fetch(PDO::FETCH_ASSOC))
            {
                $responce .= "<tr>";
                $responce .= "<td><a href='".link_to("user/edit?id=" . $row[id])."'>".$row[full_name]."</a></td>";
                $responce .= "<td>$row[email_address]</td>";
                $responce .= "<td class='center'><a href='javascript:setActiveUser(" . $row[id] . ")'><img src='";
                if ($row[is_active])
                    $responce .= href_to('templates/quickadmin/_layout/images/icons/tick.png');
                else
                    $responce .= href_to('templates/quickadmin/_layout/images/icons/publish_x.png');
                $responce .= "'></a></td>";
                $responce .= "<td class='center'><a href='".link_to("user/assignrole?userid=" . $row[id]) . "' title='Assign role'><img src='";
                $responce .= href_to('templates/quickadmin/_layout/images/icons/group.png') . "'></a>";
                $responce .= "&nbsp; <a title='Delete' href='javascript:deleteuser(" . $row[id] . ")'><img src='";
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

    public static function Delete($id)
    {
        $sql = "DELETE FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE user_id = '$id'";
        Database::query($sql);

        $delete = UserPeer::DoDelete($id);
    }
    public static function RetrieveAllWithIdKey() 
    {
        $sql = "Select * from " . AutoUserPeer::TABLE_NAME . " ORDER BY id DESC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autouser = new User();
            $autouser = AutoUserPeer::AssignProperty($autouser, $row);
            $list[$autouser->getId()] = $autouser;
        }
        return $list;
    }

}

?>
