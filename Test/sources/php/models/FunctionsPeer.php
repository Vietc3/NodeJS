<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of FunctionsPeer
 *
 * @author Dell
 */
class FunctionsPeer extends AutoFunctionsPeer
{

    public static function RetrieveAllCategories()
    {
        $sql    = "Select DISTINCT(category) AS cagetory from " . AutoFunctionsPeer::TABLE_NAME;
        $result = Database::query($sql);
        $list   = array();
        while ($row = mysql_fetch_assoc($result))
        {
            $list[] = $row["cagetory"];
        }
        return $list;
    }

    public static function RetrieveAllOrderByCategory($category)
    {
        $sql    = "Select * from " . AutoFunctionsPeer::TABLE_NAME . " WHERE category = '$category' ORDER BY id ASC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autofunctions = new AutoFunctions();
            $autofunctions = AutoFunctionsPeer::AssignProperty($autofunctions, $row);
            $list[]        = $autofunctions;
        }
        return $list;
    }

    public static function RetrieveCount()
    {
        $sql    = "SELECT COUNT(*) AS count FROM " . AutoFunctionsPeer::TABLE_NAME;
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['count'];
    }

    public static function RetrieveAll($start, $limit)
    {
        $sql    = "Select * from " . AutoFunctionsPeer::TABLE_NAME . " ORDER BY id DESC LIMIT $start, $limit";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $autofunctions = new AutoFunctions();
            $autofunctions = AutoFunctionsPeer::AssignProperty($autofunctions, $row);
            $list[]        = $autofunctions;
        }
        return $list;
    }

    public static function RetrieveAllByLimit($start, $limit)
    {
        $sql    = "SELECT * FROM " . AutoFunctionsPeer::TABLE_NAME . " ORDER BY id DESC LIMIT $start, $limit";
        $sth = Database::prepare($sql);

        $responce .= "<thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                </tr>
                            </thead>";

        if ($sth)
        {
            $responce .= "<tbody>";
            while ($row = $sth->fetch(PDO::FETCH_ASSOC))
            {
                $responce .= "<tr>";
                $responce .= "<td>$row[name]</td>";
                $responce .= "<td>$row[description]</td>";
                $responce .= "<td>$row[category]</td>";
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
        $sql    = "SELECT * FROM " . AutoRoleFunctionPeer::TABLE_NAME . " WHERE function_id = '$id'";
        $sth = Database::prepare($sql);
        
        if ($sth->rowCount() == 0)
        {
            FunctionsPeer::DoDelete($id);
            echo '1';
            exit;
        }

        echo '0';
        exit;
    }

}

?>
