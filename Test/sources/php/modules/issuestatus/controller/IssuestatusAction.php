<?php

class IssueStatusAction  extends Controller
{

    public function executeList()
    {
        $this->issue_statuses   = IssuestatusPeer::RetrieveAll();
        
        $page = 1;
        $total_pages = 0;
        $limit       = 10;
        
        $count = IssuestatusPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);
        if($total_pages == 0)
            $page = 0;
        $this->page = $page;
        $this->total_pages = $total_pages;
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }
    
    
    public function executeEdit() 
    {
        $id = isset($_REQUEST['id'])? $_REQUEST['id'] : -1;
        $this->issuestatus = IssuestatusPeer::RetrieveById($id);
        
        if (!$this->issuestatus) {
            $this->issuestatus = new Issuestatus();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->issuestatus->setName($_POST['name']);
            $this->issuestatus->setDescription($_POST['description']);
            $this->issuestatus->setColor('#' . $_POST['color']);
            $this->issuestatus->setOrderId($_POST['order_id']);
            if ($this->issuestatus->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('issuestatus/list'));
            }
            else
            {
                Session::set(SESSION_MESSAGE, '<div class="notice error "><span><strong>Error:</strong>Can not save</span></div>');
            }
        }
    }
}

?>