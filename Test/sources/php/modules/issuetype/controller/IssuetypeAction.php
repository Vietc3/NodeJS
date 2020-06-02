<?php

class IssuetypeAction  extends Controller
{

    public function executeList()
    {
        $this->type_issues   = IssuetypePeer::RetrieveAll();
        
        $page = 1;
        $total_pages = 0;
        $limit       = 10;
        
        $count = IssuetypePeer::RetrieveCount();

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
        $this->issuetype = IssuetypePeer::RetrieveById($id);

        if (!$this->issuetype)
        {
            $this->issuetype = new Issuetype();
            $this->title     = "Create";
        }
        else
        {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {

            $this->issuetype->setName($_POST['name']);
            $this->issuetype->setDescription($_POST['description']);
            $this->issuetype->setColor('#' . $_POST['color']);
            if ($this->issuetype->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to('issuetype/list'));
            }
            else
            {
                Session::set(SESSION_MESSAGE, '<div class="notice error "><span><strong>Error:</strong>Can not save</span></div>');
            }
        }
    }
}

?>
