<?php

class AutoIssue
{
    protected $id;
    protected $code;
    protected $name;
    protected $description;
    protected $project_id;
    protected $type_id;
    protected $status_id;
    protected $assignee_id;
    protected $creator_id;
    protected $priority;
    protected $parent_issue_id;
    protected $child_ids;
    protected $order_id;
    protected $level;
    protected $start_date;
    protected $end_date;
    protected $complete_percent;
    protected $attachment;
    protected $created_at;
    protected $modified;
    protected $watchers;
    protected $hours;
    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        return $this->id = $id;
    }
    public function getCode()
    {
        return $this->code;
    }
    public function setCode($code)
    {
        return $this->code = $code;
    }
    public function getName()
    {
        return $this->name;
    }
    public function setName($name)
    {
        return $this->name = $name;
    }
    public function getDescription()
    {
        return $this->description;
    }
    public function setDescription($description)
    {
        return $this->description = $description;
    }
    public function getProjectId()
    {
        return $this->project_id;
    }
    public function setProjectId($project_id)
    {
        return $this->project_id = $project_id;
    }
    public function getTypeId()
    {
        return $this->type_id;
    }
    public function setTypeId($type_id)
    {
        return $this->type_id = $type_id;
    }
    public function getStatusId()
    {
        return $this->status_id;
    }
    public function setStatusId($status_id)
    {
        return $this->status_id = $status_id;
    }
    public function getAssigneeId()
    {
        return $this->assignee_id;
    }
    public function setAssigneeId($assignee_id)
    {
        return $this->assignee_id = $assignee_id;
    }
    public function getCreatorId()
    {
        return $this->creator_id;
    }
    public function setCreatorId($creator_id)
    {
        return $this->creator_id = $creator_id;
    }
    public function getPriority()
    {
        return $this->priority;
    }
    public function setPriority($priority)
    {
        return $this->priority = $priority;
    }
    public function getParentIssueId()
    {
        return $this->parent_issue_id;
    }
    public function setParentIssueId($parent_issue_id)
    {
        return $this->parent_issue_id = $parent_issue_id;
    }
    public function getChildIds()
    {
        return $this->child_ids;
    }
    public function setChildIds($child_ids)
    {
        return $this->child_ids = $child_ids;
    }
    public function getOrderId()
    {
        return $this->order_id;
    }
    public function setOrderId($order_id)
    {
        return $this->order_id = $order_id;
    }
    public function getLevel()
    {
        return $this->level;
    }
    public function setLevel($level)
    {
        return $this->level = $level;
    }
    public function getStartDate()
    {
        return $this->start_date;
    }
    public function setStartDate($start_date)
    {
        return $this->start_date = $start_date;
    }
    public function getEndDate()
    {
        return $this->end_date;
    }
    public function setEndDate($end_date)
    {
        return $this->end_date = $end_date;
    }
    public function getCompletePercent()
    {
        return $this->complete_percent;
    }
    public function setCompletePercent($complete_percent)
    {
        return $this->complete_percent = $complete_percent;
    }
    public function getAttachment()
    {
        return $this->attachment;
    }
    public function setAttachment($attachment)
    {
        return $this->attachment = $attachment;
    }
    public function getCreatedAt()
    {
        return $this->created_at;
    }
    public function setCreatedAt($created_at)
    {
        return $this->created_at = $created_at;
    }
    public function getModified()
    {
        return $this->modified;
    }
    public function setModified($modified)
    {
        return $this->modified = $modified;
    }
    public function getWatchers()
    {
        return $this->watchers;
    }
    public function setWatchers($watchers)
    {
        return $this->watchers = $watchers;
    }
    public function getHours()
    {
        return $this->hours;
    }
    public function setHours($hours)
    {
        return $this->hours = $hours;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoIssuePeer::DoInsert($this))
            {
                $id = AutoIssuePeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoIssuePeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoIssuePeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
