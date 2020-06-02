<?php

class AutoIssueStatus
{
    protected $id;
    protected $name;
    protected $description;
    protected $color;
    protected $order_id;
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
    public function getOrderId()
    {
        return $this->order_id;
    }
    public function setOrderId($order_id)
    {
        return $this->order_id = $order_id;
    }
    public function save()
    {
        if ($this->getId()== null)
        {
            if (AutoIssueStatusPeer::DoInsert($this))
            {
                $id = AutoIssueStatusPeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoIssueStatusPeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoIssueStatusPeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
