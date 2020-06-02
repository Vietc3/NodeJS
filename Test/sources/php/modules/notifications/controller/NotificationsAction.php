<?php

class NotificationsAction  extends Controller
{

    public function executeList()
    {
        $this->notificationss = NotificationsPeer::RetrieveVisibleByEmailAddress($_SESSION[EMAIL_ADDRESS]);
        NotificationsPeer::SetReadAlready($_SESSION[EMAIL_ADDRESS]);
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
    
    public function executeInvisible()
    {
        $notification = new Notifications();
        $notification = NotificationsPeer::RetrieveById($_REQUEST['id']);
        if ($notification)
        {
            $notification->setIsVisible(false);
            if ($notification->save())
                Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Invisible Notifications Successfully.') . "</span></div>");
            else
                Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Can not Invisible Notifications.') . "</span></div>");
        }
        else
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('This notification it not existing') . "</span></div>");
            
        redirect(link_to('notifications/list'));
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
