<?php

class AutoRole
{
    protected $id;
    protected $name;
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
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoRolePeer::DoInsert($this))
            {
                $id = AutoRolePeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoRolePeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoRolePeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
