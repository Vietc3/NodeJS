<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RoleAction
 *
 * @author Dell
 */
class RoleAction  extends Controller
{

    public function executeList()
    {
        $this->roles = RolePeer::RetrieveAll();

        $page        = 1;
        $total_pages = 0;
        $limit       = 10;

        $count = RolePeer::RetrieveCount();

        if ($count > 0)
            $total_pages       = ceil($count / $limit);
        if ($total_pages == 0)
            $page              = 0;
        $this->page        = $page;
        $this->total_pages = $total_pages;
        $this->message     = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeAssignfunction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $role_id     = $_POST['role_id'];
            $functionids = $_POST['functionids'];

            $list_role_functions = RoleFunctionPeer::RetrieveAllByRoleId($role_id);

            $role_function = new RoleFunction();

            foreach ($functionids as $functionid)
            {
                $co = false;
                foreach ($list_role_functions as $role_function)
                    if ($role_function->getFunctionId() == $functionid)
                    {
                        $co = true;
                        break;
                    }
                if (!$co)
                {
                    $item_role_function = new RoleFunction();
                    $item_role_function->setRoleId($role_id);
                    $item_role_function->setFunctionId($functionid);
                    if ($item_role_function->save())
                        Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span>" .
                                _('Save role successfully.') .
                                "</span></div>");
                }
            }
            foreach ($list_role_functions as $role_function)
            {
                $co = false;
                foreach ($functionids as $functionid)
                    if ($role_function->getFunctionId() == $functionid)
                    {
                        $co = true;
                        break;
                    }
                if (!$co)
                {
                    if ($role_function->delete())
                        Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span>" .
                                _('Save role successfully.') .
                                "</span></div>");
                }
            }
            redirect(link_to('role/list'));
        }
    }

    public function executeEdit()
    {
        $id   = $_GET['id'];
        $role = RolePeer::RetrieveById($id);
        if (!$role)
        {
            $role        = new Role();
            $this->title = "Create";
        }
        else
        {
            $this->title = "Edit";
        }
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {

            $role->setId($_POST['id']);
            $role->setName($_POST['rolename']);
            if ($role->save())
            {
                Session::set(SESSION_MESSAGE, "<div class=\"alert alert-success\">" . _('Save role Success.') . "</div>");
                redirect(link_to('role/list'));
            }
            else
            {
                Session::set(SESSION_MESSAGE, "<div class=\"alert alert-error\">" . _('Save role Failed.') . "</div>");
            }
        }
        $this->role = $role;
    }

    public function executeDelete()
    {
        $id     = $_REQUEST['id'];
        $delete = RolePeer::DoDelete($id);
        if (!$delete)
        {
            Session::set(SESSION_MESSAGE, "<div class=\"alert alert-error\">" . _('Delete role Incorrect.') . "</div>");
        }
        else
        {
            Session::set(SESSION_MESSAGE, "<div class=\"alert alert-success\">" . _('Delete role Correct.') . "</div>");
        }
        redirect(link_to('role/list'));
    }

}

?>
