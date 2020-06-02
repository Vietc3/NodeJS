<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of IssueTimeAction
 *
 * @author Dell
 */
class IssuetimeAction  extends Controller
{

    public function executeList() {
        $this->issuetimes = IssueTimePeer::RetrieveAll();
        $this->message = Session::get(SESSION_MESSAGE);
        Session::destroy(SESSION_MESSAGE);
    }

    public function executeEdit() {
        $issue_time = new IssueTime();
        
        if(isset($_REQUEST['id'])) {
            $issue_time = IssueTimePeer::RetrieveById($_REQUEST['id']);
        }
        
        if(isset($_REQUEST['issue_id'])) {
            $issue_id = $_REQUEST['issue_id'];
            $_SESSION[ISSUE_ID] = $issue_id;
            $issue_time->setIssueId($issue_id);
        }
        
        
        
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {            
            $issue_time->setDate($date = date("Ymd", strtotime($_POST['_date'])));
            $issue_time->setHours($_POST['hours']);
            $issue_time->setDescription($_POST['description']);

            if (!$issue_time->save()) {
                Session::set(SESSION_MESSAGE, "<div class=\"notice error\"><span><strong>Error:</strong>" .
                        _('Can not save.') . "</span></div>");
            } else {
                $issue_id = $issue_time->getIssueId();
                Session::set(SESSION_MESSAGE, "<div class=\"notice success\"><span>" .
                        _('Log time successfully.') . "</span></div>");
                redirect(link_to("issuetime/list"));
            }
        }
        $this->issue_time = $issue_time;
    }
}

?>
