<?php

class AutoFunctionsAction  extends Controller
{

    public function executeList() 
    {
        $this->functionss = FunctionsPeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->functions = FunctionsPeer::RetrieveById($id);
        
        if (!$this->functions) {
            $this->functions = new Functions();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->functions->setName($_POST['name']);
            $this->functions->setDescription($_POST['description']);
            $this->functions->setCategory($_POST['category']);
            if ($this->functions->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('functions/list'));
            }
            else
            {
                Session::set(SESSION_MESSAGE, '<div class="notice error "><span><strong>Error:</strong>Can not save</span></div>');
            }
        }
    }

    public function executeDelete() 
    {
        $id = $_REQUEST['id'];
        $delete = FunctionsPeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete Functions Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete Functions Correct.') . "</span></div>");
        }
        redirect(link_to('functions/list'));
    }

}

?>
