<?php

class AutoRoleFunction
{
    protected $id;
    protected $role_id;
    protected $function_id;
    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        return $this->id = $id;
    }
    public function getRoleId()
    {
        return $this->role_id;
    }
    public function setRoleId($role_id)
    {
        return $this->role_id = $role_id;
    }
    public function getFunctionId()
    {
        return $this->function_id;
    }
    public function setFunctionId($function_id)
    {
        return $this->function_id = $function_id;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoRoleFunctionPeer::DoInsert($this))
            {
                $id = AutoRoleFunctionPeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoRoleFunctionPeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoRoleFunctionPeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
