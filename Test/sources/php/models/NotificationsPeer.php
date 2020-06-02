<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NotificationsPeer
 *
 * @author Dell
 */
class NotificationsPeer extends AutoNotificationsPeer {

    public static function GetTotalNotYetRead($email_address) {
        $sql = "SELECT COUNT(*) as total  FROM " . NotificationsPeer::TABLE_NAME . "                
                 WHERE email_address = '" . $email_address . "' and is_read=0";
        $row = Database::fetch($sql);
        if (!$row)
            return 0;
        return $row['total'];
    }

    public static function RetrieveByEmailAddress($email_address) {
        $sql = "Select * from " . AutoNotificationsPeer::TABLE_NAME . "" .
                "WHERE email_address = '" . $email_address . "'  ORDER BY id DESC  ";
        $sth = Database::prepare($sql);
        $list = array();
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $notifications = new Notifications();
            $notifications = NotificationsPeer::AssignProperty($notifications, $row);
            $list[] = $notifications;
        }
        return $list;
    }

    public static function SetReadAlready($email_address) {
        $sql = "UPDATE " . AutoNotificationsPeer::TABLE_NAME . " SET is_read=1" ." WHERE email_address = '" . $email_address . "'";
        $result = Database::query($sql);
    }
    
    public static function RetrieveVisibleByEmailAddress($email_address) {
        $sql = "Select * from " . AutoNotificationsPeer::TABLE_NAME . " WHERE email_address = '$email_address' and is_visible=1 ORDER BY id DESC";
        $list = array();
        
        $sth = Database::prepare($sql);
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC))
        {
            $notifications = new Notifications();
            $notifications = NotificationsPeer::AssignProperty($notifications, $row);
            $list[] = $notifications;
        }
        return $list;
    }
}

?>
