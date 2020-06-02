<?php

class AutoNotificationsAction  extends Controller
{

    public function executeList() 
    {
        $this->notificationss = NotificationsPeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->notifications = NotificationsPeer::RetrieveById($id);
        
        if (!$this->notifications) {
            $this->notifications = new Notifications();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->notifications->setEmailAddress($_POST['email_address']);
            $this->notifications->setIsRead($_POST['is_read']);
            $this->notifications->setSubject($_POST['subject']);
            $this->notifications->setContent($_POST['content']);
            $this->notifications->setProjectId($_POST['project_id']);
            $this->notifications->setIssueId($_POST['issue_id']);
            $this->notifications->setIsVisible($_POST['is_visible']);
            if ($this->notifications->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('notifications/list'));
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
        $delete = NotificationsPeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete Notifications Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete Notifications Correct.') . "</span></div>");
        }
        redirect(link_to('notifications/list'));
    }

}

?>
