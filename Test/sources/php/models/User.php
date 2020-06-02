<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of User
 *
 * @author Dell
 */
class User extends AutoUser {
   //put your code here
//    public function getFullName()
//    {  
//        //neu user nay co role la Client thi chung ta show nhung user khac voi role mac dinh cua ho, thay vi full name               
//        $client_role = new Role();
//        $client_role = RolePeer::RetrieveByName("Client");
//        if ($client_role != null)
//        {
//            $user_role = new UserRole();
//            //kiem tra role mac dinh cua user dang dang nhap co phai la Client ko
//            $user_role = UserRolePeer::RetrieveByUserIdProjectIdRoleId( $_SESSION[USER_ID], 0, $client_role->getId());
//            if ($user_role != null)
//            {
//                $role_list = UserRolePeer::RetrieveAllRoleIdByProjectIdUserId( 0, $this->getId());
//                if (count($role_list) > 0 )
//                {
//                    $id = $role_list[0];                    
//                    $role = RolePeer::RetrieveById($id);
//                    if ($role != null && ($role->getName() == "Developer" || $role->getName()=="Tester"))
//                        return $role->getName().$_SESSION[USER_ID];
//                }
//            }
//        }
//        return $this->full_name;
//    }
}

?>
