<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of IssueTypePeer
 *
 * @author Dell
 */
class IssueTimePeer extends AutoIssueTimePeer
{

    public static function RetrieveAllByIssueId($issue_id)
    {
        $sql    = "Select SUM(hours) AS total FROM " . AutoIssueTimePeer::TABLE_NAME . " WHERE issue_id = '$issue_id'";
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public static function RetrieveCount()
    {
        $sql    = "SELECT COUNT(*) AS count FROM " . AutoIssueTimePeer::TABLE_NAME . " WHERE issue_id = '$_SESSION[ISSUE_ID]'";
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['count'];
    }

    public static function RetrieveAllByLimit($sidx, $sord, $start, $limit)
    {
        $sql    = "Select * from " . AutoIssueTimePeer::TABLE_NAME . " WHERE issue_id = '$_SESSION[ISSUE_ID]' ORDER BY $sidx $sord LIMIT $start , $limit";
        $sth = Database::prepare($sql);

        if ($sth)
        {
            $i   = 0;
            while ($row = $sth->fetch(PDO::FETCH_ASSOC))
            {
                $responce->rows[$i]['id']     = $row[id];
                $responce->rows[$i]['cell'][] = $row[id];
                $responce->rows[$i]['cell'][] = $row[date];
                $responce->rows[$i]['cell'][] = $row[hours];
                $responce->rows[$i]['cell'][] = $row[description];
                $i++;
            }
        }
        return $responce;
    }

}

?>
