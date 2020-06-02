<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of FunctionsAction
 *
 * @author Dell
 */
class FunctionsAction  extends Controller
{

    public function executeList()
    {
        $page        = 1;
        $total_pages = 0;
        $start       = 0;
        $limit       = 10;
        
        $this->functions = FunctionsPeer::RetrieveAll($start, $limit);

        $count = FunctionsPeer::RetrieveCount();

        if ($count > 0)
            $total_pages       = ceil($count / $limit);
        if ($total_pages == 0)
            $page              = 0;
        $this->page        = $page;
        $this->total_pages = $total_pages;
        $this->message     = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit()
    {
        $id                    = $_GET['id'];
        $functions             = FunctionsPeer::RetrieveById($id);
        $this->list_categories = array();
        $this->list_categories[] = "User";
        $this->list_categories[] = "Project";
        $this->list_categories[] = "Issue";
        if (!$functions)
        {
            $functions   = new Functions();
            $this->title = "Create";
        }
        else
        {
            $this->title = "Edit";
        }
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $functions->setId($_POST['id']);
            $functions->setName($_POST['name']);
            $functions->setDescription($_POST['description']);
            $functions->setCategory($_POST['category']);
            if ($functions->save())
            {
                Session::set(SESSION_MESSAGE, "<div class=\"alert alert-success\">" . _('Save functions Success.') . "</div>");
                redirect(link_to('functions/list'));
            }
            else
            {
                Session::set(SESSION_MESSAGE, "<div class=\"alert alert-error\">" . _('Save functions Failed.') . "</div>");
            }
        }
        $this->functions = $functions;
    }

    public function executeDelete()
    {
        $id     = $_REQUEST['id'];
        $delete = FunctionsPeer::DoDelete($id);
        if (!$delete)
        {
            Session::set(SESSION_MESSAGE, "<div class=\"alert alert-error\">" . _('Delete functions Incorrect.') . "</div>");
        }
        else
        {
            Session::set(SESSION_MESSAGE, "<div class=\"alert alert-success\">" . _('Delete functions Correct.') . "</div>");
        }
        redirect(link_to('functions/list'));
    }

}

?>
