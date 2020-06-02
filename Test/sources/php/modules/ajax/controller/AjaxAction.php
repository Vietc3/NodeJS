<?php

class AjaxAction extends Controller {

    public function executeGetParentIssuesByType() {
        $issue_type_id = $_POST['issue_type_id'];
        $project_id = $_POST['project_id'];
        $issue_id = $_POST['issue_id'];
        
        $this->issue = IssuePeer::RetrieveById($issue_id);
        $this->list_issue_parent = IssuePeer::getParentIssuesByType($issue_type_id, $project_id, $issue_id);
        $this->loadViewFile("modules/issue/view/ParentIssuesSuccess.php");
    }

    public function executeSetActiveUser() {
        $id = $_GET['id'];
        $user = UserPeer::RetrieveById($id);
        if ($user) {
            if ($user->getIsActive() == 1)
                $user->setIsActive(0);
            else
                $user->setIsActive(1);
            $user->save();
        }
        echo true; 
        exit;
    }

    public function executeSetDefaultProject() {
        if (isset($_GET['id']))
            $_SESSION[PROJECT_ID] = $_GET['id'];
        UserRolePeer::SetDefaultProject();
        echo true;
        exit;
    }

    public function executeSetFirstTime() {
        $_SESSION[FIRSTTIME] = true;
        echo true;
        exit;
    }

    public function executeGetAllRole() {
        $page = 1;
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = RolePeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $limit * $page - $limit;

        $responce = RolePeer::RetrieveAllByLimit($start, $limit);

        echo $responce;
        exit;
    }
    
    public function executeGetAllRoleCount() {
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = RolePeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        echo $total_pages;
        exit;
    }

    public function executeGetAllFunction() {
        $page = 1;
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = FunctionsPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $limit * $page - $limit;

        $responce = FunctionsPeer::RetrieveAllByLimit($start, $limit);

        echo $responce;
        exit;
    }

    public function executeGetAllIssueTime() {
        $page = 1;
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = IssueTimePeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $limit * $page - $limit;

        $responce = IssueTimePeer::RetrieveAllByLimit($start, $limit);

        echo $responce;
        exit;
    }

    public function executeGetAllIssueType() {
        $page = 1;
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = IssueTypePeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $limit * $page - $limit;

        $responce = IssueTypePeer::RetrieveAllByLimit($start, $limit);

        echo $responce;
        exit;
    }
    
    public function executeGetAllIssueTypeCount() {
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = IssueTypePeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        echo $total_pages;
        exit;
    }

    public function executeGetAllIssueStatus() {
        $page = 1;
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = IssueStatusPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $limit * $page - $limit;

        $responce = IssueStatusPeer::RetrieveAllByLimit($start, $limit);

        echo $responce;
        exit;
    }
    
    public function executeGetAllIssueStatusCount() {
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = IssueStatusPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        echo $total_pages;
        exit;
    }

    public function executeGetAllProjectStatus() {
        $page = 1;
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = ProjectstatusPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $limit * $page - $limit;

        $responce = ProjectstatusPeer::RetrieveAllByLimit($start, $limit);

        echo $responce;
        exit;
    }
    
    public function executeGetAllProjectStatusCount() {
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = ProjectStatusPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        echo $total_pages;
        exit;
    }

    public function executeGetAllUserRole() {
        $page = 1;
        $rows = 10;
        
        if (isset($_GET['project_id']))
            $project_id = $_GET['project_id'];

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $rows = $_GET['rows'];

        $count = UserRolePeer::RetrieveCount($project_id);

        $total_pages = $count > 0 ? ceil($count / $rows) : 0;

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $rows * $page - $rows;

        echo UserRolePeer::RetrieveAllByLimit($start, $rows, $project_id);
        exit;
    }
    
    public function executeGetAllUserRoleCount() {
        $total_pages = 0;
        $limit = 10;
        
        if (isset($_GET['project_id']))
            $project_id = $_GET['project_id'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = UserRolePeer::RetrieveCount($project_id);

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        echo $total_pages;
        exit;
    }

    public function executeGetAllUser() {
        $page = 1;
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = UserPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $limit * $page - $limit;

        $responce .= UserPeer::RetrieveAllByLimit($start, $limit);

        echo $responce;
        exit;
    }
    
    public function executeGetAllUserCount() {
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = UserPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        echo $total_pages;
        exit;
    }

    public function executeGetAllProject() {
        $page = 1;
        $total_pages = 0;
        $limit = 10;

        if (isset($_GET['page']))
            $page = $_GET['page'];

        if (isset($_GET['rows']))
            $limit = $_GET['rows'];

        $count = ProjectPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $limit * $page - $limit;

        $responce = ProjectPeer::RetrieveAllByLimit($start, $limit);

        echo $responce;
        exit;
    }

    public function executeGetAllProjectCount() {
        $total_pages = 0;
        $limit = 10;

        $count = ProjectPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);

        echo $total_pages;
        exit;
    }

    public function executeGetAllIssue() 
    {
        if (isset($_GET['page']) && $_GET['page'])
            Session::set(PAGE, $_GET['page']);

        if (isset($_GET['rows']) && $_GET['rows'])
            Session::set(ROWS, $_GET['rows']);
        
        if (!isset($_SESSION[ORDERBY]) || (isset($_SESSION[ORDERBY]) && $_SESSION[ORDERBY] != $_GET['orderby']))
            Session::set(SORT, 'DESC');
        else 
        {
            if($_SESSION[SORT] == 'ASC')
                Session::set(SORT, 'DESC');
            else
                Session::set(SORT, 'ASC');
        }
        
        Session::set(ORDERBY, 'code');

        if ($_GET['orderby'] != '')
            Session::set(ORDERBY, $_GET['orderby']);
        
        if (isset($_GET['closed_hide']) && $_GET['closed_hide'] != '')
            session::set(CLOSED_HIDE, $_GET['closed_hide']);
        
        $project_id = $_REQUEST['project_id'];
        
        //Neu khac project thi lay thong tin luu tru ra
        if ($_SESSION[PROJECT_ID] != $project_id)
        {
            $_SESSION[PROJECT_ID] = $project_id;
            
            $user_role = UserRolePeer::GetProjectInforByProjectId($project_id);
            
            if ($user_role)
            {
                Session::set( PAGE, $user_role['page']);
                Session::set( ROWS, $user_role['rows']);
                Session::set( CLOSED_HIDE, $user_role['closed_hide']);
                Session::set( ORDERBY, $user_role['orderby'] != '' ? $user_role['orderby'] : 'id');
                Session::set( SORT, $user_role['sort'] != '' ? $user_role['sort'] : 'DESC');
            }
        }
        
        if (!Session::is_set(PAGE) || !Session::get(PAGE))
            Session::set(PAGE, 1);
        if (!Session::is_set(ROWS) || !Session::get(ROWS))
            Session::set(ROWS, 10);
        if (!Session::is_set(CLOSED_HIDE) || Session::get(CLOSED_HIDE)=='')
            Session::set(CLOSED_HIDE, 0);

        UserRolePeer::SetDefaultProjectInfo();
        
        
        $page = Session::get(PAGE);
        $rows = Session::get(ROWS);
        $closed_hide = Session::get(CLOSED_HIDE);
        
        $search_text = isset($_REQUEST['search_text'])? $_REQUEST['search_text'] : '';
        
        $count = IssuePeer::RetrieveCount($project_id, $closed_hide, $search_text);

        $total_pages = $count > 0?  ceil($count / $rows) : 0;

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $rows * $page - $rows;

        $this->issues_list =  IssuePeer::RetrieveAllByLimit($project_id, $start, $rows, $closed_hide, $search_text);

        $this->loadViewFile("modules/issue/view/TableContentSuccess.php");
        
        exit;
    }
    
    public function executeGetAllIssueCount() 
    {
        
        $project_id = Session::get(PROJECT_ID);
        
        $rows = Session::get(ROWS) ? Session::get(ROWS) : 10;
        
        $page = Session::get(PAGE) ? Session::get(PAGE) : 1;
        
        $closed_hide = Session::get(CLOSED_HIDE) !='' ? Session::get(CLOSED_HIDE) : 0;
        
        $search_text = isset($_REQUEST['search_text'])? $_REQUEST['search_text'] : '';

        $count = IssuePeer::RetrieveCount($project_id, $closed_hide, $search_text);

        $total_pages = $count > 0 ? ceil($count / $rows) : 0;
        
        if ($page > $total_pages)
            $page = $total_pages;
        
        echo $total_pages . "," . $page . "," . $rows. "," . $closed_hide; 
        
        exit;
    }

    public function executeDeleteIssue() {
        $id = $_GET['id'];
        echo IssuePeer::Delete($id);
        exit();
    }

    public function executeDeleteProject() {
        $id = $_GET['id'];
        echo ProjectPeer::Delete($id);
        exit();
    }

    public function executeDeleteUserRole() {
        $user_id = $_GET['user_id'];
        $project_id = $_GET['project_id'];
        UserRolePeer::DeleteByUserIdAndProjectId($user_id, $project_id);
        echo true;
        exit;
    }

    public function executeDeleteProjectStatus() {
        $id = $_GET['id'];
        ProjectstatusPeer::Delete($id);
    }

    public function executeDeleteIssueStatus() {
        $id = $_GET['id'];
        IssueStatusPeer::Delete($id);
    }

    public function executeDeleteIssueType() {
        $id = $_GET['id'];
        IssueTypePeer::Delete($id);
    }

    public function executeDeleteUser() {
        $user_id = $_GET['id'];
        UserRolePeer::DeleteAllByUserId($user_id);        
        UserPeer::DoDelete($user_id);
        echo true;
        exit;
    }

    public function executeDeleteRole() {
        $id = $_GET['id'];
        RolePeer::Delete($id);
    }

    public function executeDeleteFunction() {
        $id = $_GET['id'];
        FunctionsPeer::Delete($id);
    }
    
    public function executeDeleteFile() {
        if (isset($_POST['id']))
            return IssuePeer::DeleteAttachment($_POST['id']);
        return 0;
    }
    
    public function executeDeleteFileNotYetSaved() {
        $file_name = $_POST['filename'];
        if (file_exists("uploads/attachment/$file_name"))
            unlink("uploads/attachment/$file_name");
        return 0;
    }

    public function executeCheckvalidemail() {
        if (isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST") {
            $email = $_POST['email'];
            if (empty($email)) {
                echo '0';
            } else
            if (!UserPeer::RetrieveByEmailaddress($email))
                echo '1';
            else
                echo '0';
        }
        else
            echo '0';
        exit;
    }

}

?>
