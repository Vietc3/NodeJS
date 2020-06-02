<?php

class AutoIssuestatusAction  extends Controller
{

    public function executeList() 
    {
        $this->issuestatuses = IssuestatusPeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->issuestatus = IssuestatusPeer::RetrieveById($id);
        
        if (!$this->issuestatus) {
            $this->issuestatus = new Issuestatus();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->issuestatus->setName($_POST['name']);
            $this->issuestatus->setDescription($_POST['description']);
            $this->issuestatus->setColor($_POST['color']);
            $this->issuestatus->setOrderId($_POST['order_id']);
            if ($this->issuestatus->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('issuestatus/list'));
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
        $delete = IssuestatusPeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete Issuestatus Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete Issuestatus Correct.') . "</span></div>");
        }
        redirect(link_to('issuestatus/list'));
    }

}

?>
