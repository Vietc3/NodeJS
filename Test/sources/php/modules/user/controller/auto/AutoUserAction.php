<?php

class AutoUserAction  extends Controller
{

    public function executeList() 
    {
        $this->users = UserPeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->user = UserPeer::RetrieveById($id);
        
        if (!$this->user) {
            $this->user = new User();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->user->setEmailAddress($_POST['email_address']);
            $this->user->setPassword($_POST['password']);
            $this->user->setFullName($_POST['full_name']);
            $this->user->setIsActive($_POST['is_active']);
            $this->user->setToken($_POST['token']);
            $this->user->setCreatedAt($_POST['created_at']);
            $this->user->setIsAdmin($_POST['is_admin']);
            $this->user->setModified($_POST['modified']);
            if ($this->user->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('user/list'));
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
        $delete = UserPeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete User Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete User Correct.') . "</span></div>");
        }
        redirect(link_to('user/list'));
    }

}

?>
