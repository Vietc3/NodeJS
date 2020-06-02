<?php

class AutoProjectAction  extends Controller
{

    public function executeList() 
    {
        $this->projects = ProjectPeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() 
    {
        $id = $_REQUEST['id'];
        $this->project = ProjectPeer::RetrieveById($id);
        
        if (!$this->project) {
            $this->project = new Project();
            $this->title = "Create";
        } else {
            $this->title = "Edit";
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') 
        {
 
            $this->project->setName($_POST['name']);
            $this->project->setDescription($_POST['description']);
            $this->project->setStartDate($_POST['start_date']);
            $this->project->setEndDate($_POST['end_date']);
            $this->project->setCompletePercent($_POST['complete_percent']);
            $this->project->setProjectStatusId($_POST['project_status_id']);
            $this->project->setCreatedAt($_POST['created_at']);
            $this->project->setCreatorId($_POST['creator_id']);
            $this->project->setModified($_POST['modified']);
            if ($this->project->save())
            {
                Session::set(SESSION_MESSAGE, '<div class="notice success "><span><strong>Success:</strong>Save successfully</span></div>');
                redirect(link_to ('project/list'));
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
        $delete = ProjectPeer::DoDelete($id);
        if (!$delete) {
            Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" . _('Delete Project Incorrect.') . "</span></div>");
        } else {
            Session::set(SESSION_MESSAGE, "<div class=\"notice success \"><span><strong>Success:</strong>" . _('Delete Project Correct.') . "</span></div>");
        }
        redirect(link_to('project/list'));
    }

}

?>
