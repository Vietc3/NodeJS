<?php

class AutoFunctions
{
    protected $id;
    protected $name;
    protected $description;
    protected $category;
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
    public function getCategory()
    {
        return $this->category;
    }
    public function setCategory($category)
    {
        return $this->category = $category;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoFunctionsPeer::DoInsert($this))
            {
                $id = AutoFunctionsPeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoFunctionsPeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoFunctionsPeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
