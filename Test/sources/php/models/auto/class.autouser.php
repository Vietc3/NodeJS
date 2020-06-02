<?php

class AutoUser
{
    protected $id;
    protected $email_address;
    protected $password;
    protected $full_name;
    protected $is_active;
    protected $token;
    protected $created_at;
    protected $is_admin;
    protected $modified;
    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        return $this->id = $id;
    }
    public function getEmailAddress()
    {
        return $this->email_address;
    }
    public function setEmailAddress($email_address)
    {
        return $this->email_address = $email_address;
    }
    public function getPassword()
    {
        return $this->password;
    }
    public function setPassword($password)
    {
        return $this->password = $password;
    }
    public function getFullName()
    {
        return $this->full_name;
    }
    public function setFullName($full_name)
    {
        return $this->full_name = $full_name;
    }
    public function getIsActive()
    {
        return $this->is_active;
    }
    public function setIsActive($is_active)
    {
        return $this->is_active = $is_active;
    }
    public function getToken()
    {
        return $this->token;
    }
    public function setToken($token)
    {
        return $this->token = $token;
    }
    public function getCreatedAt()
    {
        return $this->created_at;
    }
    public function setCreatedAt($created_at)
    {
        return $this->created_at = $created_at;
    }
    public function getIsAdmin()
    {
        return $this->is_admin;
    }
    public function setIsAdmin($is_admin)
    {
        return $this->is_admin = $is_admin;
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
            if (AutoUserPeer::DoInsert($this))
            {
                $id = AutoUserPeer::GetInsertId();
                $this->setId($id);
                return true;
            }
            else return false;
        }
        else
        {
            return AutoUserPeer::DoUpdate($this);
        }
    }
    public function delete()
    {
        AutoUserPeer::DoDelete($this->getId());
        $this->setId(null);
    }
}
?>
