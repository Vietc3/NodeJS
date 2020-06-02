<?php

class AutoUserroleAction  extends Controller
{

    public function executeList() 
    {
        $this->userroles = UserrolePeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->userrole = UserrolePeer::RetrieveById($id);
        
        if (!$this->userrole) {
            $this->userrole = new Userrole();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->userrole->setProjectId($_POST['project_id']);
            $this->userrole->setUserId($_POST['user_id']);
            $this->userrole->setRoleId($_POST['role_id']);
            $this->userrole->setIsProjectDefault($_POST['is_project_default']);
            $this->userrole->setPage($_POST['page']);
            $this->userrole->setRows($_POST['rows']);
            $this->userrole->setClosedHide($_POST['closed_hide']);
            $this->userrole->setOrderby($_POST['orderby']);
            $this->userrole->setSort($_POST['sort']);
            if ($this->userrole->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('userrole/list'));
            }
            else
            {
                Session::set(SESSION_MESSAGE, '<div class="notice error "><span><strong>Error:</strong>Can not save</span></div>');
            }
        }
    }

    public function executeDelete() 
    {
        $id = $_REQUEST['id'];
        $delete = UserrolePeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete Userrole Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete Userrole Correct.') . "</span></div>");
        }
        redirect(link_to('userrole/list'));
    }

}

?>
