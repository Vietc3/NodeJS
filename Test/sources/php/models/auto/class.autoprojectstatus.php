<?php

class AutoProjectstatus
{
    protected $id;
    protected $name;
    protected $description;
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
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoProjectstatusPeer::DoInsert($this))
            {
                $id = AutoProjectstatusPeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoProjectstatusPeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoProjectstatusPeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
