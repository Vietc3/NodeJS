<?php

class AutoNotifications
{
    protected $id;
    protected $email_address;
    protected $is_read;
    protected $subject;
    protected $content;
    protected $project_id;
    protected $issue_id;
    protected $is_visible;
    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        return $this->id = $id;
    }
    public function getEmailAddress()
    {
        return $this->email_address;
    }
    public function setEmailAddress($email_address)
    {
        return $this->email_address = $email_address;
    }
    public function getIsRead()
    {
        return $this->is_read;
    }
    public function setIsRead($is_read)
    {
        return $this->is_read = $is_read;
    }
    public function getSubject()
    {
        return $this->subject;
    }
    public function setSubject($subject)
    {
        return $this->subject = $subject;
    }
    public function getContent()
    {
        return $this->content;
    }
    public function setContent($content)
    {
        return $this->content = $content;
    }
    public function getProjectId()
    {
        return $this->project_id;
    }
    public function setProjectId($project_id)
    {
        return $this->project_id = $project_id;
    }
    public function getIssueId()
    {
        return $this->issue_id;
    }
    public function setIssueId($issue_id)
    {
        return $this->issue_id = $issue_id;
    }
    public function getIsVisible()
    {
        return $this->is_visible;
    }
    public function setIsVisible($is_visible)
    {
        return $this->is_visible = $is_visible;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoNotificationsPeer::DoInsert($this))
            {
                $id = AutoNotificationsPeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoNotificationsPeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoNotificationsPeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
