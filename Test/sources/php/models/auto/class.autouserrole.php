<?php

class AutoUserRole
{
    protected $id;
    protected $project_id;
    protected $user_id;
    protected $role_id;
    protected $is_project_default;
    protected $page;
    protected $rows;
    protected $closed_hide;
    protected $orderby;
    protected $sort;
    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        return $this->id = $id;
    }
    public function getProjectId()
    {
        return $this->project_id;
    }
    public function setProjectId($project_id)
    {
        return $this->project_id = $project_id;
    }
    public function getUserId()
    {
        return $this->user_id;
    }
    public function setUserId($user_id)
    {
        return $this->user_id = $user_id;
    }
    public function getRoleId()
    {
        return $this->role_id;
    }
    public function setRoleId($role_id)
    {
        return $this->role_id = $role_id;
    }
    public function getIsProjectDefault()
    {
        return $this->is_project_default;
    }
    public function setIsProjectDefault($is_project_default)
    {
        return $this->is_project_default = $is_project_default;
    }
    public function getPage()
    {
        return $this->page;
    }
    public function setPage($page)
    {
        return $this->page = $page;
    }
    public function getRows()
    {
        return $this->rows;
    }
    public function setRows($rows)
    {
        return $this->rows = $rows;
    }
    public function getClosedHide()
    {
        return $this->closed_hide;
    }
    public function setClosedHide($closed_hide)
    {
        return $this->closed_hide = $closed_hide;
    }
    public function getOrderby()
    {
        return $this->orderby;
    }
    public function setOrderby($orderby)
    {
        return $this->orderby = $orderby;
    }
    public function getSort()
    {
        return $this->sort;
    }
    public function setSort($sort)
    {
        return $this->sort = $sort;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoUserRolePeer::DoInsert($this))
            {
                $id = AutoUserRolePeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoUserRolePeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoUserRolePeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
