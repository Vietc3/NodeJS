<?php

class AutoProjectstatusAction  extends Controller
{

    public function executeList() 
    {
        $this->projectstatuses = ProjectstatusPeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->projectstatus = ProjectstatusPeer::RetrieveById($id);
        
        if (!$this->projectstatus) {
            $this->projectstatus = new Projectstatus();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->projectstatus->setName($_POST['name']);
            $this->projectstatus->setDescription($_POST['description']);
            if ($this->projectstatus->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('projectstatus/list'));
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
        $delete = ProjectstatusPeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete Projectstatus Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete Projectstatus Correct.') . "</span></div>");
        }
        redirect(link_to('projectstatus/list'));
    }

}

?>
