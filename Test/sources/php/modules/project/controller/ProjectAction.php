<?php

class ProjectAction  extends Controller
{

    public function executeList()
    {
        $this->projects = ProjectPeer::RetrieveAllAfterNew();
        
        $page = 1;
        $total_pages = 0;
        $limit       = 50;
        
        $count = ProjectPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);
        if($total_pages == 0)
            $page = 0;
        $this->page = $page;
        $this->total_pages = $total_pages;
    }

    public function executeEdit()
    {
        $this->list_status = ProjectstatusPeer::RetrieveAllOrderAsc();
        $this->list_users  = UserPeer::RetrieveAll();
        
        $create = true;
        $this->title = "Create";
        $project     = new Project();
        
        if (isset($_REQUEST['id']) && $_REQUEST['id'])
        {
            $project     = ProjectPeer::RetrieveById($_REQUEST['id']);
            if (!$project)
            {
                echo "<div class=\"alert alert-error\">This project has been deleted!</div>";
                $this->loadViewFile(null);
                return;
            }
            $create = false;
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $project->setName($_POST['name']);
            $project->setDescription($_POST['description']);
            $project->setProjectStatusId($_POST['project_status_id']);
            if ($_SESSION[IS_ADMIN] == 1)
                $project->setCreatorId($_POST['creator_id']);
            else
            {
                if ($create)
                    $project->setCreatorId($_SESSION[USER_ID]);
            }
            
            $project->setStartDate(date("Ymd", strtotime($_POST['start_date'])));
            $project->setEndDate(date("Ymd", strtotime($_POST['end_date'])));
            $project->setCreatedAt(date("Y-m-j-H-i-s", strtotime($_POST['created_at'])));
            $project->setModified(date('Y-m-j-H-i-s'));
            
            $project->setCompletePercent(0);

            if (!$project->save())
            {
                Session::set(SESSION_MESSAGE, '<div class=\"notice error \"><span><strong>Error:</strong>Can not save</span></div>');
                redirect(link_to('project/list'));
                return;
            }
            
            $creator       = UserPeer::RetrieveById($project->getCreatorId());
            if ($create )
            {
                if (!$creator->getIsAdmin()) 
                {
                    UserRolePeer::UnDefaultForAllProjectByUserId($creator->getId());

                    $manager_role = new Role();
                    $manager_role = RolePeer::RetrieveByName("Project Manager");
                    
                    $user_role  = new UserRole();
                    $user_role->setProjectId($project->getId());
                    $user_role->setUserId($creator->getId());
                    $user_role->setRoleId($manager_role->getId());
                    $user_role->setIsProjectDefault(true);
                    $user_role->save();
                }
                
                $admin_list = UserPeer::RetrieveAllAdministrator();
                foreach ($admin_list as $admin_user)
                {
                    $user_role  = new UserRole();
                    $user_role->setProjectId($project->getId());
                    $user_role->setUserId($admin_user->getId());
                    $user_role->setRoleId(0);
                    $user_role->save();
                }
                
                if (!$creator->getIsAdmin())
                {
                    $status = ProjectstatusPeer::RetrieveById($project->getProjectStatusId());
                    email_create_project($creator->getEmailAddress(), $project->getId(), $creator->getFullName(), $project->getName(), $status->getName(), $_POST['start_date'], $_POST['end_date'], $project->getDescription());
                }
            }

            Session::set(SESSION_MESSAGE, '<div class="notice success"><span>' .
                    _('Save project successfully.') . "</span></div>");
            
            redirect(link_to('project/list'));
        }
        $this->project = $project;
    }

    public function executeView()
    {
        $project_id = $_GET['id'];
        $project    = ProjectPeer::RetrieveById($project_id);
        if ($project == null)
        {
            echo "<div class=\"alert alert-error\">This project has been deleted!</div>";
            exit;
        }
        $this->title   = "View";
        $this->project = $project;
    }

}

?>
