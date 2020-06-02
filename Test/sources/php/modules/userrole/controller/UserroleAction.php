<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RoleAction
 *
 * @author Dell
 */
class UserroleAction  extends Controller
{

    public function executeList() 
    {
        $project_id = $_GET['project_id'];
        $project = ProjectPeer::RetrieveById($project_id);
        if (!$project)
        {
            Session::set( SESSION_MESSAGE, "<div class=\"notice error\"><span><strong>Error:</strong>This project has been deleted!</span></div>");
            redirect(link_to("project/list"));
            return;
        }
        $this->user_role_list = UserRolePeer::RetrieveAllNotAdminByProjectId($project_id);
        
        $count = UserRolePeer::RetrieveCount($project_id);
        
        $rows = 10;
        $total_pages = $count > 0 ? ceil($count / $rows) : 0;
        $page = $total_pages > 0 ? 1 : 0;
        
        $this->page = $page;
        $this->total_pages = $total_pages;
        $this->rows = $rows;
        $this->project = $project;
    }

    public function executeEdit() 
    {
        $id = isset($_REQUEST['id']) ? $_REQUEST['id']: -1;
        $user_role = UserRolePeer::RetrieveById($id);
        $project_id = $_REQUEST['project_id'];
            
        if (!$user_role) 
        {
            $user_list = UserPeer::RetrieveAllNotAdminForCreate($project_id);
            if (count($user_list) == 0) 
            {
                Session::set(SESSION_MESSAGE, "<div class=\"notice warning \"><span>No user left</span></div>");
                redirect(link_to('userrole/list?project_id=' . $project_id));
                return;
            }
            $user_role = new UserRole();
            $this->title = "Create";
        }
        else 
            $this->title = "Edit";
        
        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
            $user_id = $_POST['user_id'];
            $role_ids = $_POST['role_ids'];
            
            UserRolePeer::DeleteByUserIdAndProjectId($user_id, $project_id);
            
            foreach ($role_ids as $role_id) 
            {
                $user_role = new UserRole();
                $user_role->setUserId($user_id);
                $user_role->setProjectId($project_id);
                $user_role->setRoleId($role_id);
                if (!$user_role->save()) 
                {
                    Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span>Can not assign role!</span></div>");
                    return;
                }
            }
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span>Assign role successfully!</span></div>");
            
            redirect(link_to('userrole/list?project_id=' . $project_id));
        }
        $this->user_role = $user_role;
        $this->project_id = $project_id;
        $this->user_list = $user_list;
    }

}

?>
