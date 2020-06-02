<?php

global $projectID;
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of IssueAction
 *
 * @author Dell
 */
class IssueAction extends Controller
{
    public function executeList()
    {
        $this->projects_list = ProjectPeer::RetrieveAllByUserId($_SESSION[USER_ID]);
        
        //if there is no default project
        if (!Session::is_set(PROJECT_ID))
            Session::set( PROJECT_ID, $this->projects_list[0]->getId());
        
        $project_id = Session::get(PROJECT_ID);
        $page = Session::get(PAGE) > 0 ? Session::get(PAGE) : 1; 
        $rows = Session::get(ROWS) > 0 ? Session::get(ROWS) : 10;
        $closed_hide = Session::get(CLOSED_HIDE) !='' ? Session::get(CLOSED_HIDE) : 0;

        $count = IssuePeer::RetrieveCount($project_id, $closed_hide);
        
        $total_pages = $count > 0 ? ceil($count / $rows) : 0;

        if ($page > $total_pages)
            $page = $total_pages;

        $start = $rows * $page - $rows;
        
        $this->issues_list = IssuePeer::RetrieveAllByLimit($project_id, $start, $rows, $closed_hide);
        $this->project_id = $project_id;
        
        $this->page = $page;
        $this->total_pages = $total_pages;
        $this->rows = $rows;
        $this->closed_hide = $closed_hide;
    }
    public function executeEdit()
    {
        $issue = new Issue();
        $isCreate = true;
        $this->title = "Create";
        
        $project_id = null;
        if (isset($_REQUEST['id']) && $_REQUEST['id'])
        {
            $issue = IssuePeer::RetrieveById($_REQUEST['id']);
            if ($issue == null)
            {
                echo "<div class=\"alert alert-error\">This issue has been deleted!</div>";
                $this->loadViewFile(null);
                return;
            }
            $project_id = $issue->getProjectId();
            $isCreate = false;
            $this->title = "Edit";
        }
        if ($_REQUEST['project_id'])
            $project_id = $_REQUEST['project_id'];
        
        if ($project_id == null)
        {
            echo "<div class=\"alert alert-error\">This issue is not belong to any project!</div>";
            $this->loadViewFile(null);
            return;
        }
        
        $_SESSION[PROJECT_ID] = $project_id;

        $this->list_users = UserPeer::RetrieveAllByProjectId($project_id);
        $this->list_types = IssueTypePeer::RetrieveAll();
        $this->list_status = IssueStatusPeer::RetrieveAllOrderAsc();

        $parent_type_id = $issue->getTypeId() ? $issue->getTypeId() : $this->list_types[0]->getId();
        $this->list_issue_parent = IssuePeer::getParentIssuesByType($parent_type_id, $project_id, $issue->getId()); 
        
        $project = new Project();
        $project = ProjectPeer::RetrieveById($project_id);
        $this->project = $project;
        
        $this->isCreate = $isCreate;
        $this->project_id = $project_id;

        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $issue_before = clone $issue;
            //update issue information
            $issue->setName($_POST['name']);
            $description = $_POST['description'];
            $description = str_replace("<wbr>", "", $description);
            $description = str_replace("</wbr>", "", $description);
            $issue->setDescription($description);
            $issue->setTypeId($_POST['type_id']);
            $issue->setStatusId($_POST['status_id']);
            $issue->setPriority($_POST['priority']);
            $issue->setCompletePercent($_POST['complete_percent']);
            $issue->setAssigneeId($_POST['assignee_id']);
            $issue->setStartDate(date("Ymd", strtotime($_POST['start_date'])));
            $issue->setEndDate(date("Ymd", strtotime($_POST['end_date'])));
            $issue->setCreatedAt(date("Y-m-d H:i:s", time()));
            $issue->setModified(date("Y-m-d H:i:s", time()));

            $watchers = implode(",", $_POST['watchersids']? $_POST['watchersids']: array());
            $issue->setWatchers($watchers);

            $old_parent_issue_id = $issue->getParentIssueId();            
            $parent_issue = IssuePeer::RetrieveById($_POST['parent_issue_id']);
            if (!$parent_issue)
            {                
                $issue->setParentIssueId(0);
                //if this issue is creating then there is no issue_id to set
                if (!$isCreate)
                    $issue->setOrderId($issue->getId());
                $issue->setLevel(0);
            }
            else
            {
                $issue->setParentIssueId($parent_issue->getId());
                $issue->setOrderId( $parent_issue->getOrderId());
                $issue->setLevel($parent_issue->getLevel() + 1);
            }

            //save filename into DB
            $file_name = uploadfile();            
            if ($file_name == null && isset($_POST['attached_file_before']) && $_POST['attached_file_before'])
                $file_name = $_POST['attached_file_before'];
            $issue->setAttachment($file_name);

            if ($_SESSION[IS_ADMIN] == 1)
                $issue->setCreatorId($_POST['creator_id']);
            else
                $issue->setCreatorId($_SESSION[USER_ID]);

            if ($isCreate)
            {
                $code = IssuePeer::getMaxCode($project_id);
                $issue->setCode($code + 1);
                $issue->setProjectId($project_id);
            }
            //end update issue information
            
            //check this action is edit and nothing is changed
            if (!$isCreate)
            {
                $different_result = IssueBackupPeer::getDifferentValues($issue_before, $issue);
                if (count($different_result) == 0)
                {
                    echo "<div class=\"notice error\"><span><strong>Error:</strong>Nothing is changed</span></div>";
                    $this->issue = $issue;
                    return;
                }
            }

            if (!$issue->save())
            {
                echo "<div class=\"notice error\"><span><strong>Error:</strong>Can not save this issue, please check</span></div>";
                $this->issue = $issue;
                return;
            }
            
            if (!$parent_issue && $isCreate)
            {
                $issue->setOrderId($issue->getId());
                $issue->save();
            }
            
            //giu thu tu nay, ko dc thay doi voi update parent, boi vi voi truong hop ko change parent thi se loi
            updateOldParentIssueOfIssue($old_parent_issue_id, $issue->getId());
            updateParentIssueOfIssue($parent_issue, $issue->getId());
            updateChildIssuesOfIssue($issue->getId());
            
            //update project information progressing by issues
            $percent = IssuePeer::getAllCompletePercent($project_id);
            $project->setCompletePercent($percent);
            $project->save();
            //end update project information  
                        
            $assgined_user = UserPeer::RetrieveById($issue->getAssigneeId());
            $modifier = UserPeer::RetrieveById($_SESSION[USER_ID]);
            $creator = UserPeer::RetrieveById($issue->getCreatorId());
            $type = IssueTypePeer::RetrieveById($issue->getTypeId());
            $status = IssueStatusPeer::RetrieveById($issue->getStatusId());

            IssueBackupPeer::createFromIssue($issue);

            //create email list to send
            $email_address_list = array();

            $watcherArray = $_POST['watchersids'];
            for ($i = 0; $i < count($watcherArray); $i++)
            {
                $watcher = UserPeer::RetrieveById($watcherArray[$i]);
                $email_address_list[] = $watcher->getEmailAddress();
            }
            //end create email list to send

            if ($_POST['notify'])
            {
                foreach ($email_address_list as $email_address)
                {
                    if ($email_address == $_SESSION[EMAIL_ADDRESS])
                        continue;

                    if ($isCreate)
                        email_create_issue($email_address, $issue->getId(), $issue->getCode(), $creator->getFullName(), $type->getName(), $issue->getName(), $status->getName(), common::$gPriority['key'][$issue->getPriority()], $issue->getStartDate(), $issue->getEndDate(), $assgined_user->getFullName(), $issue->getDescription(), $issue->getProjectId(), $project->getName());
                    else
                        email_update_issue($email_address, $issue->getId(), $issue->getCode(), $modifier->getFullName(), $type->getName(), $issue->getName(), $status->getName(), null, $different_result, $issue->getProjectId(), $project->getName());
                }
            }

            Session::set(SESSION_MESSAGE, "<div class=\"notice success\"><span>Save issue successfully!</span></div>");
            redirect(link_to('issue/list'));
        }
        //end post

        $this->issue = $issue;
    }

    public function executeUpdate()
    {
        $issue = new Issue();
        $issue = IssuePeer::RetrieveById($_REQUEST['id']);
        if ($issue == null)
        {
            echo "<div class=\"alert alert-error\">This issue has been deleted!</div>";
            $this->loadViewFile(null);
            return;
        }
        $project_id = $issue->getProjectId();
        
        $_SESSION[PROJECT_ID] = $project_id;
            
        $this->list_users = UserPeer::RetrieveAllByProjectId($project_id);
        $this->list_type = IssueTypePeer::RetrieveAll();
        $this->list_status = IssueStatusPeer::RetrieveAllOrderAsc();
        
        $project = new Project();
        $project = ProjectPeer::RetrieveById($project_id);
        $this->project = $project;
        
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $issue_before = clone $issue;

            $issue->setStatusId($_POST['status_id']);
            $issue->setCompletePercent($_POST['complete_percent']);
            $issue->setAssigneeId($_POST['assignee_id']);
            $issue->setHours($_POST['hours']);
            
            $watchers = implode(",", $_POST['watchersids']? $_POST['watchersids']: array());
            $issue->setWatchers($watchers);

            $issue->setModified(date("Y-m-d H:i:s", time()));
            
            //save filename into DB
            $file_name = uploadfile();
            
            if ($file_name == null && isset($_POST['attached_file_before']) && $_POST['attached_file_before'])
                $file_name = $_POST['attached_file_before'];

            $different_result = IssueBackupPeer::getDifferentValues($issue_before, $issue);
            
            $error = false;
            if ($_POST['comment'] == null)
            {
                //attach file then user must make a comment
                if ($file_name != null) {
                    echo "<div class=\"notice error\"><span>You can not attach file without comment</span></div>";
                    $error = true;
                }
                
                //if log time then dev must log comment
                if (!$error && $_POST['hours'] != null ) {
                    echo "<div class=\"notice error\"><span>You can not log time without comment</span></div>";
                    $error = true;
                }
                
                //if there is no different and no comment as well as then we will warn user
                if (!$error && count($different_result) == 0) {
                    echo "<div class=\"notice error\"><span>Nothing is changed</span></div>";
                    $error = true;
                }
            }
            
            if ($error) {
                $issue->setAttachment($file_name);
                $this->issue = $issue;
                return;
            }
                

            if (!$issue->save())
            {
                echo "<div class=\"notice error\"><span><strong>Error:</strong>Can not save this issue, please check</span></div>";
                $this->issue = $issue;
                return;
            }

            //set project percent when create issue
            $percent = IssuePeer::getAllCompletePercent($issue->getProjectId());
            $project->setCompletePercent($percent);
            $project->save();

            $type = IssueTypePeer::RetrieveById($issue->getTypeId());
            $status = IssueStatusPeer::RetrieveById($issue->getStatusId());
            $modifier = UserPeer::RetrieveById($_SESSION[USER_ID]);

            IssueBackupPeer::createFromIssue( $issue, $_POST['comment'], $file_name);
            
            //update the log time
            $issue->setHours(IssueBackupPeer::CalcTotalTime($issue->getId()));
            $issue->save();

            //create email list to send
            $email_address_list = array();

            $watcherArray = $_POST['watchersids'];
            for ($i = 0; $i < count($watcherArray); $i++)
            {
                $watcher = UserPeer::RetrieveById($watcherArray[$i]);
                $email_address_list[] = $watcher->getEmailAddress();
            }

            if ($_POST['notify'])
            {
                foreach ($email_address_list as $email_address)
                {
                    if ($email_address == $_SESSION[EMAIL_ADDRESS])
                        continue;

                    email_update_issue($email_address, $issue->getId(), $issue->getCode(), $modifier->getFullName(), $type->getName(), $issue->getName(), $status->getName(), $_POST['comment'],  $different_result, $issue->getProjectId(), $project->getName());
                }
            }

            Session::set(SESSION_MESSAGE, "<div class=\"notice success\"><span>" .
                    _('Save issue successfully.') . "</span></div>");
            redirect(link_to('issue/list'));
        }
        else 
        {
            $issue->setAttachment(null);
            $issue->setHours(null);
        }
            
        $this->issue = $issue;
    }

    public function executeView()
    {
        $issue = IssuePeer::RetrieveById($_REQUEST['id']);
        if ($issue == null)
        {
            echo "<div class=\"alert alert-error\">This issue has been deleted!</div>";
            $this->loadViewFile(null);
            return;
        }
        $this->title = "View";
        $this->issue = $issue;
    }

    public function executeUpdateOrderAndLevelOfAllIssue()
    {
        UpdateOrderAndLevelOfAllIssue();
        echo "update order of all issues successfully";
        exit();
    }
    
    public function executeUpdateChildIds()
    {
        UpdateChildIdsOfAllIssue();
        echo "update childs of all issues successfully";
        exit();
    }
    
    public function executeEditHistory()
    {
        $issue_backup = new IssueBackup();
        
        $issue_backup = IssueBackupPeer::RetrieveById($_REQUEST['issue_backup_id']);
        if ($issue_backup == null)
        {
            echo "<div class=\"alert alert-error\">This history item has been deleted!</div>";
            $this->loadViewFile(null);
            return;
        }
        $issue = new Issue();
        $issue = IssuePeer::RetrieveById($issue_backup->getIssueId());
        
        if ($issue == null)
        {
            echo "<div class=\"alert alert-error\">The issue of this history item has been deleted!</div>";
            $this->loadViewFile(null);
            return;
        }
        
        if ( $_SESSION[IS_ADMIN] != 1 && $issue_backup->getModifier() != $_SESSION[USER_ID])
        {
            echo "<div class=\"alert alert-error\">You do not have permission to edit this history item!</div>";
            $this->loadViewFile(null);
            return;
        }
        
        $project_id = $issue_backup->getProjectId();
        
        $_SESSION[PROJECT_ID] = $project_id;
        
        $this->list_users = UserPeer::RetrieveAllByProjectId($project_id);
        $this->list_type = IssueTypePeer::RetrieveAll();
        $this->list_status = IssueStatusPeer::RetrieveAllOrderAsc();

        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $issue_backup->setStatusId($_POST['status_id']);
            $issue_backup->setCompletePercent($_POST['complete_percent']);
            $issue_backup->setAssigneeId($_POST['assignee_id']);
            $issue_backup->setHours($_POST['hours']);
            
            $watchers = implode(",", $_POST['watchersids']? $_POST['watchersids']: array());
            $issue_backup->setWatchers($watchers);
            
            //save filename into DB
            //now we just can save an only file
            $file_name = uploadfile();
            if ($file_name == null && isset($_POST['attached_file_before']) && $_POST['attached_file_before'])
                $file_name = $_POST['attached_file_before'];
            $issue_backup->setAttachment($file_name);
                
            $issue_backup->setComment($_POST['comment']);

            if (!$issue_backup->save())
            {
                echo "<div class=\"notice error\"><span><strong>Error:</strong>Can not save this history item, please check</span></div>";
                $this->issue_backup = $issue_backup;
                return;
            }
            
            //update the log time
            $issue->setHours(IssueBackupPeer::CalcTotalTime($issue->getId()));
            $issue->save();

            Session::set(SESSION_MESSAGE, "<div class=\"notice success\"><span>" .
                    _('Save history item successfully.') . "</span></div>");
            redirect(link_to('issue/view?id='.$issue->getId()));
        }
            
        $this->issue_backup = $issue_backup;
    }
    
    public function executeDeleteHistory()
    {
         $issue_backup_id = $_REQUEST['issue_backup_id'];
         
         $issue_backup = IssueBackupPeer::RetrieveById($issue_backup_id);
         
         if ($issue_backup == null)
        {
            echo "<div class=\"alert alert-error\">This history item has been deleted!</div>";
            $this->loadViewFile(null);
            return;
        }
         
        if ( $_SESSION[IS_ADMIN] != 1 && $issue_backup->getModifier() != $_SESSION[USER_ID])
        {
            echo "<div class=\"alert alert-error\">You do not have permission to delete this history item!</div>";
            $this->loadViewFile(null);
            return;
        }
        
         IssueBackupPeer::DoDelete($issue_backup_id);
         DoBackpage();
    }
    
    public function executeListMyIssue()
    {
        
    }

}

?>
