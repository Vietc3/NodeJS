<?php

class AutoIssuetypeAction  extends Controller
{

    public function executeList() 
    {
        $this->issuetypes = IssuetypePeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->issuetype = IssuetypePeer::RetrieveById($id);
        
        if (!$this->issuetype) {
            $this->issuetype = new Issuetype();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->issuetype->setName($_POST['name']);
            $this->issuetype->setDescription($_POST['description']);
            $this->issuetype->setColor($_POST['color']);
            if ($this->issuetype->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('issuetype/list'));
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
        $delete = IssuetypePeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete Issuetype Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete Issuetype Correct.') . "</span></div>");
        }
        redirect(link_to('issuetype/list'));
    }

}

?>
