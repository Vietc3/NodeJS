<?php

class AutoProject
{
    protected $id;
    protected $name;
    protected $description;
    protected $start_date;
    protected $end_date;
    protected $complete_percent;
    protected $project_status_id;
    protected $created_at;
    protected $creator_id;
    protected $modified;
    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        return $this->id = $id;
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
    public function getProjectStatusId()
    {
        return $this->project_status_id;
    }
    public function setProjectStatusId($project_status_id)
    {
        return $this->project_status_id = $project_status_id;
    }
    public function getCreatedAt()
    {
        return $this->created_at;
    }
    public function setCreatedAt($created_at)
    {
        return $this->created_at = $created_at;
    }
    public function getCreatorId()
    {
        return $this->creator_id;
    }
    public function setCreatorId($creator_id)
    {
        return $this->creator_id = $creator_id;
    }
    public function getModified()
    {
        return $this->modified;
    }
    public function setModified($modified)
    {
        return $this->modified = $modified;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoProjectPeer::DoInsert($this))
            {
                $id = AutoProjectPeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoProjectPeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoProjectPeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
