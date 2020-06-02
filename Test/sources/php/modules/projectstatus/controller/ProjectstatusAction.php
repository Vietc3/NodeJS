<?php

class ProjectStatusAction  extends Controller
{

    public function executeList()
    {
        $this->status_projects   = ProjectstatusPeer::RetrieveAll();
        
        $page = 1;
        $total_pages = 0;
        $limit       = 10;
        
        $count = ProjectstatusPeer::RetrieveCount();

        if ($count > 0)
            $total_pages = ceil($count / $limit);
        if($total_pages == 0)
            $page = 0;
        $this->page = $page;
        $this->total_pages = $total_pages;
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }
}

?>