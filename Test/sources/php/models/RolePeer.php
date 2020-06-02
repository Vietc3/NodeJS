<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RolePeer
 *
 * @author Dell
 */
class RolePeer extends AutoRolePeer
{

    public static function RetrieveAllAsc()
    {
        $sql    = "Select * from " . AutoRolePeer::TABLE_NAME . " ORDER BY id ASC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autorole = new AutoRole();
            $autorole = AutoRolePeer::AssignProperty($autorole, $row);
            $list[]   = $autorole;
        }
        return $list;
    }

    public static function RetrieveRoleNameByUserId($user_id)
    {
        $sql    = "SELECT count(*) as total FROM " . AutoRolePeer::TABLE_NAME . " WHERE id IN (SELECT role_id FROM user_role where user_id = '$user_id' AND project_id = '$_SESSION[PROJECT_ID]') AND name = 'Developer'";
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public static function RetrieveByUserId($user_id)
    {
        $sql    = "SELECT role_id FROM user_role where user_id = '$user_id'";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $list[] = $row['role_id'];
        }
        return $list;
    }

    public static function RetrieveCount()
    {
        $sql    = "SELECT COUNT(*) AS count FROM " . AutoRolePeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['count'];
    }

    public static function RetrieveAllByLimit($start, $limit)
    {
        $sql    = "SELECT * FROM " . AutoRolePeer::TABLE_NAME . " ORDER BY id DESC LIMIT $start, $limit";
        $sth = Database::prepare($sql);

        $responce .= "<thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>";

        if ($sth)
        {
            $responce .= "<tbody>";
            while ($row = $sth->fetch(PDO::FETCH_ASSOC))
            {
                $responce .= "<tr>";
                $responce .= "<td><a href='". link_to("role/edit?id=" . $row[id]) . "'>$row[name]</a></td>";
                $responce .= "<td class='center'><a href='". link_to("role/assignfunction?role_id=" . $row[id]) . "' title='Assign function'><img src='";
                $responce .= href_to('templates/quickadmin/_layout/images/icons/function.png') . "'></a>";
                $responce .= "&nbsp; <a title='Delete' href='javascript:deleterole(" . $row[id] . ")'><img src='";
                $responce .= href_to('templates/quickadmin/_layout/images/icons/delete.png') . "'></a></td>";
                $responce .= "</tr>";
            }
            $responce .= "</tbody>";
        }
        else
        {
            $responce .= "<tr>";
            $responce .= "<td colspan='2' style='text-align:center'>";
            $responce .= "There is no available roles!";
            $responce .= "</td>";
            $responce .= "</tr>";
        }
        return $responce;
    }

    public static function Delete($id)
    {
        $sql    = "SELECT * FROM " . AutoUserRolePeer::TABLE_NAME . " WHERE role_id = '$id'";
        $sth = Database::prepare($sql);
        
        if ($sth->rowCount() == 0) {
            $delete = RolePeer::DoDelete($id);
            echo '1'; exit;
        }

        echo '0';
        exit;
    }

}

?>
