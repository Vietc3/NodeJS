<?php

class AutoIssueTime
{
    protected $id;
    protected $issue_id;
    protected $date;
    protected $hours;
    protected $description;
    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        return $this->id = $id;
    }
    public function getIssueId()
    {
        return $this->issue_id;
    }
    public function setIssueId($issue_id)
    {
        return $this->issue_id = $issue_id;
    }
    public function getDate()
    {
        return $this->date;
    }
    public function setDate($date)
    {
        return $this->date = $date;
    }
    public function getHours()
    {
        return $this->hours;
    }
    public function setHours($hours)
    {
        return $this->hours = $hours;
    }
    public function getDescription()
    {
        return $this->description;
    }
    public function setDescription($description)
    {
        return $this->description = $description;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoIssueTimePeer::DoInsert($this))
            {
                $id = AutoIssueTimePeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoIssueTimePeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoIssueTimePeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
