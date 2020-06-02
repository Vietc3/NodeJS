<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$issue = new Issue();
$issue = $this->issue;
$issuebackups = IssueBackupPeer::getAllByIssueId($issue->getId());
$type = IssueTypePeer::RetrieveById($issue->getTypeId());
$status = IssueStatusPeer::RetrieveById($issue->getStatusId());
$project = ProjectPeer::RetrieveById($issue->getProjectId());

$users_hash = UserPeer::RetrieveAllWithIdKey();
$assignee =$users_hash[$issue->getAssigneeId()];
$user = $users_hash[$issue->getCreatorId()];
$priority = Common::$gPriority['key'][$issue->getPriority()];

?>

<style>
    .view-title-lv1 { color:#5A5A5A; font-family: 'Droid Sans', 'Arial', 'Verdana'; font-weight: bold; font-size: 18px; padding-top: 15px; padding-bottom: 10px; }
    .view-title-lv2 { color:#5A5A5A; font-family: 'Droid Sans', 'Arial', 'Verdana'; font-weight: bold; padding-left: 10px; padding-top: 20px; }
    h4 { border-bottom: 1px dotted #C0C0C0; color: #606060; font-family: Trebuchet MS,Georgia,"Times New Roman",serif;}
    table th { padding-left: 10px;}
    p { padding-top: 10px;}
    .ul-history { list-style:circle !important;}
    #history { padding-left: 10px;}
</style>

<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4>
                    <?php 
                    echo $type->getName() . " #" . $issue->getCode() . ": " ;
                    if (strlen($issue->getName()) > 100)
                        echo substr($issue->getName(), 0, 100); 
                    else
                        echo $issue->getName();
                    ?>
                    <div style="float: right; padding-top: 9px; padding-right: 10px;">
                         <a class="btn btn-success btn-title" href="<?php echo $_SERVER['HTTP_REFERER'];?>">
                                <img alt="Back" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/back-icon.png') ?>"/> Back
                            </a>
                        <a class="btn btn-success btn-title" href="javascript:edit()">
                            <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/page_white_edit.png') ?>"/>
                            Edit Issue
                        </a> 
                        <a class="btn btn-success btn-title" href="javascript:update()">
                            <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/update.png') ?>"/> 
                            Update Issue
                        </a>
                    </div>
                </h4>
            </div>
            <div class="content">  
                <p style="padding-top: 10px; padding-left: 10px; margin-bottom: 10px !important;">
                    Added by 
                    <?php 
                        if ($user)
                            echo "<a href=". link_to("user/view?id=". $user->getId()).">". $user->getFullName()."</a>";
                        else
                            echo "<a href=\"#\">NULL</a>";
                    ?>
                    at <?php echo $issue->getCreatedAt(); ?>
                    Updated at <?php echo $issue->getModified(); ?>
                </p>
                
                
                <!--  Brief information  -->
                <table style="padding-left: 5px;">
                    
<!--                    header row-->
                    <tr style="border-top: 1px solid #DDDDDD;">
                        
                        <th width="150px;">Project:</th>
                            <td width="200px;">
                                <?php echo "<a href=". link_to("project/view?id=". $project->getId()).">". $project->getName()."</a>"; ?>
                            </td>
                        
                        <th width="150px;">Priority:</th>
                            <td width="200px;">
                                <?php echo $priority; ?>
                            </td>
                        
                        <th width="150px;">Start date:</th>
                            <td width="200px;">
                                <?php echo $issue->getStartDate(); ?>
                            </td>
                            
                    </tr>
                    
<!--                    row 2-->
                    <tr>
                            
                        <th>Assignee:</th>
                            <td>
                                <?php 
                                    if ($assignee)
                                        echo "<a href=". link_to("user/view?id=". $assignee->getId()).">". $assignee->getFullName()."</a>";
                                    else
                                        echo "<a href=\"#\">NULL</a>";
                                ?>
                            </td>
                            
                        <th>Completed:</th>
                            <td>
                                <?php echo $issue->getCompletePercent(); ?> %
                            </td>
                            
                        <th>End date:</th>
                            <td>
                                <?php echo $issue->getEndDate(); ?>
                            </td>
                            
                    </tr>
                    
<!--                    row 3-->
                    <tr style="border-bottom: 1px solid #DDDDDD;">
                            
                        <th>Status:</th>
                            <td>
                                <?php echo $status->getName(); ?>
                            </td>
                            
                        <th>Spent time:</th>
                            <td>
                                <?php 
                                if ($_SESSION[IS_ADMIN] == 1)
                                    echo $issue->getHours()." hours" ;
                                ?>
                            </td>
                        
                            
                        <th>Attachment:</th>
                            <td>
                                <?php
                                if ($issue->getAttachment())
                                    echo "<a href='". href_to("uploads/attachment/" . $issue->getAttachment())."' >". $issue->getAttachment()."</a>";
                                 ?>
                            </td>
                            
                    </tr>
                    
                </table>
                
                
<!--                Detail information-->
                <p class="view-title-lv2">DESCRIPTION</p>
                <div style="padding-left:10px;">
                    <?php echo $issue->getDescription(); ?>
                </div>
                
                <br/><br/>
<!--                HISTORY-->
                <div id="history">
                    <p class="view-title-lv1">HISTORY</p>
                    <?php 
                    for ($index = 0; $index < count($issuebackups) - 1; $index++) 
                    {?>
                        <?php
                        $user = $users_hash[$issuebackups[$index]->getModifier()];
                        $different_result = IssueBackupPeer::getDifferentValues($issuebackups[$index + 1], $issuebackups[$index]);
                        $issue_backup = new IssueBackup();
                        $issue_backup = $issuebackups[$index];
                        ?>
                        <div style="padding-right: 10px; margin-bottom: 20px;">
                            <h4>
                                Updated by 
                                <?php 
                                if ($user)
                                    echo "<a href=". link_to("user/view?id=". $user->getId()).">". $user->getFullName()."</a>";
                                else
                                    echo "<a href=\"#\">NULL</a>";
                                 ?>
                                at <?php echo $issue_backup->getModified(); ?>
                                
                                <?php 
                                if ( $_SESSION[IS_ADMIN] == 1 || $issue_backup->getModifier() == $_SESSION[USER_ID]) 
                                {
                                ?>
                                
                                    &nbsp;&nbsp;
                                
                                    <a title="Edit" href="<?php echo link_to("issue/editHistory?issue_backup_id=" . $issue_backup->getId()); ?>"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/page_white_edit.png') ?>"></a>&nbsp;&nbsp;

                                    <a title="Delete" href="<?php echo link_to("issue/deleteHistory?issue_backup_id=" . $issue_backup->getId()); ?>" onclick="return confirm('Are you sure to delete this history item?');" ><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/delete.png') ?>"></a>
                                <?php
                                }
                                ?>
                            </h4>
                            <ul class="ul-history">
                                <?php
                                if (isset($different_result['name']))
                                {
                                    ?>
                                    <li><strong>Name</strong> changed from <i><?php echo $different_result['name_before']; ?></i> to <i><?php echo $different_result['name_after']; ?></i></li>
                                <?php 
                                }
                                if (isset($different_result['description']))
                                {
                                    ?>
                                    <li><strong>Description</strong> changed</li>
                                <?php
                                }
                                if (isset($different_result['type']))
                                { ?>
                                    <li><strong>Type</strong> changed from <i><?php echo $different_result['type_before']; ?></i> to <i><?php echo $different_result['type_after']; ?></i></li>
                                <?php                                 
                                } 
                                if (isset($different_result['status']))
                                { ?>
                                    <li><strong>Status</strong> changed from <i><?php echo $different_result['status_before']; ?></i> to <i><?php echo $different_result['status_after']; ?></i></li>
                                <?php 
                                } 
                                if (isset($different_result['assignee']))
                                { ?>
                                    <li><strong>Assignee</strong> changed from <i><?php echo $different_result['assignee_before']; ?></i> to <i><?php echo $different_result['assignee_after']; ?></i></li>
                                <?php 
                                }
                                if (isset($different_result['priority']))
                                { ?>
                                    <li><strong>Priority</strong> changed from <i><?php echo $different_result['priority_before']; ?></i> to <i><?php echo $different_result['priority_after']; ?></i></li>
                                <?php 
                                }
                                if (isset($different_result['start_date']))
                                { ?>
                                    <li><strong>Start date</strong> changed from <i><?php echo $different_result['start_date_before']; ?></i> to <i><?php echo $different_result['start_date_after']; ?></i></li>
                                <?php 
                                }
                                if (isset($different_result['end_date']))
                                { ?>
                                    <li><strong>End date</strong> changed from <i><?php echo $different_result['end_date_before']; ?></i> to <i><?php echo $different_result['end_date_after']; ?></i></li>
                                <?php 
                                }
                                if (isset($different_result['estimate_time']))
                                { ?>
                                    <li><strong>Estimate time</strong> changed from <i><?php echo $different_result['estimate_time_before']; ?></i> to <i><?php echo $different_result['estimate_time_after']; ?></i></li>
                                <?php 
                                }
                                if (isset($different_result['complete_percent']))
                                {
                                    ?>
                                    <li><strong>Completed</strong> changed from <i><?php echo $different_result['complete_percent_before']; ?></i> to <i><?php echo $different_result['complete_percent_after']; ?></i></li>
                                <?php 
                                } 
                                if ($issue_backup->getHours() &&   ($_SESSION[IS_ADMIN] == 1 || $issue_backup->getModifier() == $_SESSION[USER_ID]))
                                {
                                    ?>
                                    <li><strong>Time Log </strong><i><?php echo $issue_backup->getHours(); ?>&nbsp; hours</i></li>
                                <?php 
                                } 
                                if ($issue_backup->getAttachment())
                                {
                                    ?>
                                    <li><strong>Attachment </strong>
                                        <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/attach.png') ?>"/>
                                        <i><a href='<?php echo href_to('uploads/attachment/' . $issue_backup->getAttachment()) ?>'><?php echo $issue_backup->getAttachment(); ?></a></i></li>
                                <?php 
                                } 
                                if ($issue_backup->getComment())
                                {
                                    ?>
                                    <li>
                                         <strong>Comment</strong>
                                        <div style="padding-left: 40px;">
                                            <?php echo $issue_backup->getComment(); ?>
                                        </div>
                                    </li>
                                    <?php
                                }
                                ?>
                            </ul>
                            
                        </div>
                    <?php
                    }
                    ?>
                </div>
            </div>
        </div>
        <div class="shadow"></div>
    </div>
</div>
</div>
<script>

    function delete_file(id){
        if(confirm('Are you sure to remove this file?'))
        {
            $.ajax({
                type: 'POST',
                url: '<?php echo link_to('ajax/deletefile') ?>',
                data: 'id=' + id,
                async: false
            });  
            document.getElementById("attachment").innerHTML = "";
        }
    }
    
    function edit() {
        window.location = '<?php echo link_to("issue/edit?id=" . $issue->getId()); ?>';
    }
    
    function update() {
        window.location = '<?php echo link_to("issue/update?id=" . $issue->getId()); ?>';
    }
    
    function logtime() {
        window.location = '<?php echo link_to("issuetime/edit?issue_id=" . $issue->getId()); ?>';
    }
</script>
