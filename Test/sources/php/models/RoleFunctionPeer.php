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
class RoleFunctionPeer extends AutoRoleFunctionPeer {

    public static function RetrieveAllByRoleId($role_id) {
        $sql = "SELECT * FROM " . AutoRoleFunctionPeer::TABLE_NAME . " WHERE role_id='$role_id' ORDER BY id ASC";
        $sth = Database::prepare($sql);
        $list = array();
        if (!$sth) return $list;
        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                $rolefunction = new RoleFunction();
                $rolefunction = AutoRoleFunctionPeer::AssignProperty($rolefunction, $row);
                $list[] = $rolefunction;
        }
        return $list;
    }

    public static function RetrieveByUserId($user_id, $function_name) {
        $sql = "SELECT COUNT(name) as total FROM " . AutoFunctionsPeer::TABLE_NAME . " WHERE id IN (SELECT DISTINCT function_id FROM " . AutoRoleFunctionPeer::TABLE_NAME . " WHERE role_id IN (SELECT role_id FROM user_role WHERE user_id='$user_id')) AND name = '$function_name'";
        $sth = Database::prepare($sql);
        if (!$sth) return 0;
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

}

?>
