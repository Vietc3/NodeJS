<?php

class AutoIssueType
{
    protected $id;
    protected $name;
    protected $description;
    protected $color;
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
    public function getColor()
    {
        return $this->color;
    }
    public function setColor($color)
    {
        return $this->color = $color;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoIssueTypePeer::DoInsert($this))
            {
                $id = AutoIssueTypePeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoIssueTypePeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoIssueTypePeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
