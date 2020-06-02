<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProjectstatusPeer
 *
 * @author Dell
 */
class ProjectstatusPeer extends AutoProjectstatusPeer
{

    public static function RetrieveAllOrderAsc()
    {
        $sql    = "Select * from " . AutoProjectstatusPeer::TABLE_NAME . " ORDER BY id ASC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autoprojectstatus = new AutoProjectstatus();
            $autoprojectstatus = AutoProjectstatusPeer::AssignProperty($autoprojectstatus, $row);
            $list[]            = $autoprojectstatus;
        }
        return $list;
    }

    public static function RetrieveCount()
    {
        $sql    = "SELECT COUNT(*) AS count FROM " . AutoProjectstatusPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['count'];
    }

    public static function RetrieveAllByLimit($start, $limit)
    {
        $sql    = "SELECT * FROM " . AutoProjectstatusPeer::TABLE_NAME . " ORDER BY id DESC LIMIT $start, $limit";
        $sth = Database::prepare($sql);
        
        $responce .= "<thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th width='20%'>Actions</th>
                                </tr>
                            </thead>";

        if ($sth)
        {
            $responce .= "<tbody>";
            while ($row = $sth->fetch(PDO::FETCH_ASSOC))
            {
                $responce .= "<tr>";
                $responce .= "<td><a href='".link_to("projectstatus/edit?id=" . $row[id]) . "'>$row[name]</a></td>";
                $responce .= "<td>$row[description]</td>";
                $responce .= "<td class='center'><a title='Delete' href='javascript:deletestatus_project(" . $row[id] . ")'><img src='";
                $responce .= href_to('templates/quickadmin/_layout/images/icons/delete.png') . "'></a></td>";
                $responce .= "</tr>";
            }
            $responce .= "</tbody>";
        }
        else
        {
            $responce .= "<tr>";
            $responce .= "<td colspan='3' style='text-align:center'>";
            $responce .= "There is no available status!";
            $responce .= "</td>";
            $responce .= "</tr>";
        }
        return $responce;
    }

    public static function Delete($id)
    {
        $sql    = "SELECT * FROM " . AutoProjectPeer::TABLE_NAME . " WHERE project_status_id = '$id'";
        $sth = Database::prepare($sql);
        
        if ($sth->rowCount() == 0) {
            ProjectStatusPeer::DoDelete($id);
            echo '1';
            exit;
        }

        echo '0';
        exit;
    }

}

?>
