<?php

class AutoIssueHistory
{
    protected $id;
    protected $issue_id;
    protected $assigner_from_id;
    protected $assigner_to_id;
    protected $status_from_id;
    protected $status_to_id;
    protected $created_at;
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
    public function getAssignerFromId()
    {
        return $this->assigner_from_id;
    }
    public function setAssignerFromId($assigner_from_id)
    {
        return $this->assigner_from_id = $assigner_from_id;
    }
    public function getAssignerToId()
    {
        return $this->assigner_to_id;
    }
    public function setAssignerToId($assigner_to_id)
    {
        return $this->assigner_to_id = $assigner_to_id;
    }
    public function getStatusFromId()
    {
        return $this->status_from_id;
    }
    public function setStatusFromId($status_from_id)
    {
        return $this->status_from_id = $status_from_id;
    }
    public function getStatusToId()
    {
        return $this->status_to_id;
    }
    public function setStatusToId($status_to_id)
    {
        return $this->status_to_id = $status_to_id;
    }
    public function getCreatedAt()
    {
        return $this->created_at;
    }
    public function setCreatedAt($created_at)
    {
        return $this->created_at = $created_at;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoIssueHistoryPeer::DoInsert($this))
            {
                $id = AutoIssueHistoryPeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoIssueHistoryPeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoIssueHistoryPeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
