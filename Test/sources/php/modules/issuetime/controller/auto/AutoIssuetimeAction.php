<?php

class AutoIssuetimeAction  extends Controller
{

    public function executeList() 
    {
        $this->issuetimes = IssuetimePeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->issuetime = IssuetimePeer::RetrieveById($id);
        
        if (!$this->issuetime) {
            $this->issuetime = new Issuetime();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->issuetime->setIssueId($_POST['issue_id']);
            $this->issuetime->setDate($_POST['date']);
            $this->issuetime->setHours($_POST['hours']);
            $this->issuetime->setDescription($_POST['description']);
            if ($this->issuetime->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('issuetime/list'));
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
        $delete = IssuetimePeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete Issuetime Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete Issuetime Correct.') . "</span></div>");
        }
        redirect(link_to('issuetime/list'));
    }

}

?>
