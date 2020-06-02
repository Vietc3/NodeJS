<?php

class UserAction  extends Controller
{

    public function executeList()
    {
        $this->users   = UserPeer::RetrieveAllAfterNew();
        
        $count = UserPeer::RetrieveCount();
        
        $rows = 20;
        $total_pages = $count > 0 ? ceil($count / $rows) : 0;
        $page = $total_pages > 0 ? 1 : 0;
        
        $this->page = $page;
        $this->total_pages = $total_pages;
        $this->rows = $rows;
    }
    
    public function executeHowtouse()
    {
    }
    
    public function executeOverview()
    {
    }

    public function executeLogin()
    {
        if (isLoggedInBySession())
        {
            if (HasSessionFromProjectInfor())
                redirect(link_to('issue/list'));
            else
                redirect(link_to('project/list'));
            return true;
        }
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {            
            $email    = $_POST['email'];
            $password = $_POST['password'];

            $user = new User();
            $user = UserPeer::RetrieveByEmailAddress($email);
            
            if (empty($email))
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice warning\"><span><strong>Warning: </strong>You must enter an email address!</span></div>");
                return false;
            }
            if (empty($password))
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice warning\"><span><strong>Warning: </strong>What\'s your password?</span></div>");
                return false;
            }
            if (!$user)
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice warning\"><span><strong>Warning: </strong>Incorrect email address!</span></div>");
                return false;
            }
            if ($user->getPassword() != md5($password))
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice warning\"><span><strong>Warning: </strong>Incorrect password</span></div>");
                return false;
            }

            if ($user->getIsActive())
                Session::set( ACTIVE, 1);
            else
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice warning\"><span><strong>Warning: </strong>This user is not actived yet!</span></div>");
                return false;
            }

            Session::set( EMAIL_ADDRESS, $user->getEmailAddress());
            Session::set( FULL_NAME, $user->getFullName());
            Session::set( USER_ID, $user->getId());
            Session::set( PASSWORD, $user->getPassword());
            Session::set( IS_ADMIN, $user->getIsAdmin());
            
            if (isset($_POST['stay']))
                process_setcookie();

            if (HasSessionFromProjectInfor())
                redirect(link_to('issue/list'));
            else
                redirect(link_to('project/list'));

            return true;
        }
    }

    public function executeLogout()
    {
        if (!isset($_SESSION))
            session_start();

        session_unset();
        session_destroy();
        
        process_unsetcookie();

        redirect(link_to('user/overview'));
    }
    
    public function executeDelete() 
    {
        $id = $_REQUEST['id'];
        $delete = UserPeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete User Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete User Correct.') . "</span></div>");
        }
        redirect(link_to('user/list'));
    }

    public function executeActive()
    {
        $token = $_REQUEST['token'];
        $user  = new User();
        $user  = UserPeer::RetrieveByToken($token);

        if ($user)
        {
            if ($user->getIsactive())
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice success\"><span><strong>Success:</strong>Your account was activated , please click <a href='" .link_to('user/login') . "'>this link</a> to log in! </span></div>");
                redirect(link_to('dashboard/showmessage'));
            }
            else
            {
                $user->setIsactive(true);
                $user->setToken('');
                $user->save();
                Session::set(SESSION_MESSAGE, "<div class=\"notice success\"><span>You have activated your account sucessfully, please click <a href='" .link_to('user/login') . "'>this link</a> to log in! </span></div>");
                
                redirect(link_to('dashboard/showmessage'));
            }
        }
        else 
        {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error\"><span><strong>Error:</strong>This token is not available now, please contact to admin to be supported!</span></div>");
            redirect(link_to('dashboard/showmessage'));
        }
    }

    public function executeForgotpassword()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $email = secure($_POST['email']);
            if (empty($email))
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice warning\"><span><strong>Warning:</strong>Please enter your email address!</span></div>");
                return false;
            }
            $user = new User();
            $user = UserPeer::RetrieveByEmailAddress($email);

            if (!$user)
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>This email is not existed!</span></div>");
                return false;
            }
            $email       = $user->getEmailAddress();
            $newPassword = createRandomPassword();
            $user->setPassword(md5($newPassword));
            $user->save();

            email_password_recovery($email, $newPassword);
        }
    }

    public function executeSignup()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $email = $_POST['email'];
            $exist = UserPeer::RetrieveByEmailAddress($email);
            if ($exist != null)
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>This email is existed!</span></div>");
                return;
            }
            $password = $_POST['password'];
            $token    = UserPeer::guid();

            //add User 's information
            $user = new User();
            $user->setEmailAddress($email);
            $user->setPassword(md5($password));
            $user->setIsactive(false);
            $user->setToken($token);
            $user->save();

            $user_role = new UserRole();
            $user_role->setUserId($user->getId());
            $user_role->setRoleId(2);
            $user_role->save();

            email_signup($email, $password, link_to('user/active?token=' . $token));
        }
    }

    public function executeEdit()
    {            
        $user        = new User();
        $this->title = "Create";
        $create = true;
        if (isset($_REQUEST['id']) && $_REQUEST['id'])
        {
            $create = false;
            $this->title = "Edit";
            $user        = UserPeer::RetrieveById($_REQUEST['id']);
            if (!$user){
                Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>This user has been deleted</span></div>");
                if ($_SESSION[IS_ADMIN] == 1)
                    redirect(link_to('user/list'));
                else
                    redirect(link_to('issue/list'));
                return;
            }
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $user->setEmailaddress($_POST['email']);
            $user->setFullName($_POST['full_name']);
            if (isset($_POST['is_active']))
                $user->setIsActive($_POST['is_active']);
            if (isset($_POST['is_admin']))
                $user->setIsAdmin($_POST['is_admin']);
            
            $user->setIsActive(1);
            $user->setIsAdmin(0);
            
            if ($_POST['create_at'] == null)
                $user->setCreatedAt(date("Y-m-d H:i:s", time()));
            else
                $user->setCreatedAt($_POST['create_at']);

            $user->setModified(date("Y-m-d H:i:s", time()));

            if ($create && strlen($_POST['password']) == 0)
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>You have to enter a password</span></div>");
                $this->user = $user;
                return;
            }
            
            if (strlen($_POST['password']) > 0) 
            {
                if ($_POST['password'] != $_POST['confirm_password']) 
                {
                    Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>The password and confirm password is not match</span></div>");
                    $this->user = $user;
                    return;
                }
                if ( !$create && ($_SESSION[IS_ADMIN] != 1) && ($user->getPassword() != md5($_POST['old_password'])))
                {
                    Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>The old password is not correct</span></div>");
                    $this->user = $user;
                    return;
                }
                $user->setPassword(md5($_POST['password']));
            }

            if (!$user->save())
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>Can not save</span></div>");
                $this->user = $user;
                return;
            }
            else
                Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Error:</strong>Save user successfully!</span></div>");
            
            if ($create)
                email_create_user($user->getEmailAddress(), $user->getFullName(), $_POST['password']);
            else
                email_change_user($user->getEmailAddress(), $user->getFullName());
            
            if ($_SESSION[IS_ADMIN] == 1)
                redirect(link_to('user/list'));
            else
                redirect(link_to('issue/list'));
        }
        $this->user = $user;
    }

    public function executeAssignrole()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $user_id = $_POST['userid'];
            $role_ids = $_POST["roleids"];

            UserRolePeer::DeleteByUserIdAndProjectId($user_id, 0);

            foreach ($role_ids as $role_id)
            {
                $user_role = new UserRole();
                $user_role->setUserId($user_id);
                $user_role->setProjectId(0);
                $user_role->setRoleId($role_id);
                if (!$user_role->save())
                {
                    Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span>Can not assign role!</span></div>");
                    return;
                }
            }
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span>Assign role successfully!</span></div>");
            redirect(link_to('user/list'));
        }
    }

    /**
     * Assign role for user for specific project 
     */
    public function executeAssignRoleForUserProject()
    {

        if (isset($_GET['userid']))
        {
            $list_project_id = UserRolePeer::RetrieveAllProjectIdByUserId($_GET['userid']);

            if (count($list_project_id) == 0)
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice warning \"><span>Please assign project for this user first</span></div>");
                redirect(link_to('user/list'));
            }
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $user_id    = $_POST['userid'];
            $project_id = $_POST['project_id'];
            $roleids    = $_POST["roleids$project_id"];

            UserRolePeer::DeleteByUserIdAndProjectId($user_id, $project_id);

            foreach ($roleids as $roleid)
            {
                $item_project_user = new UserRole();
                $item_project_user->setUserId($user_id);
                $item_project_user->setProjectId($project_id);
                $item_project_user->setRoleId($roleid);
                if ($item_project_user->save())
                {
                    Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span>Assign role successfully</span></div>");
                }
            }
            redirect(link_to('user/list'));
        }
    }

    public function executeView()
    {
        $id         = $_GET['id'];
        $user       = new User();
        $user       = UserPeer::RetrieveById($id);
        $this->user = $user;
    }

}

?>