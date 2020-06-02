<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$project = $this->project;
$status = ProjectStatusPeer::RetrieveById($project->getProjectStatusId());
$user = UserPeer::RetrieveById($project->getCreatorId());
?>

<style>
    .view-title-lv1 { color:#5A5A5A; font-family: 'Droid Sans', 'Arial', 'Verdana'; font-weight: bold; font-size: 18px; padding-top: 10px; }
    .view-title-lv2 { color:#5A5A5A; font-family: 'Droid Sans', 'Arial', 'Verdana'; font-weight: bold; padding-left: 10px; padding-top: 20px; }
    h4 { border-bottom: 1px dotted #C0C0C0; color: #606060; font-family: Trebuchet MS,Georgia,"Times New Roman",serif;}
    table th { padding-left: 10px;}
    p { padding-left: 10px;}
</style>

<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php echo $project->getName(); ?>
                    <div style="float: right; padding-top: 9px; padding-right: 10px;">
                        <a class="btn btn-success btn-title" style="width: 120px !important;" href="javascript:edit()">
                            <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/page_white_edit.png') ?>"/> 
                            Edit project
                        </a>
                    </div>
                </h4>
            </div>
            <div class="content">  
                <p style="padding-top: 10px; padding-left: 10px; margin-bottom: 10px !important;">
                    Added by 
                    <?php if ($user)
                    { ?>
                        <a href="../user/view?id=<?php echo $user->getId(); ?>">
                            <?php echo $user->getFullName(); ?>
                        </a>
                        <?php
                    }
                    else
                    {
                        ?>
                        <a href="#">
                            <?php echo 'NULL'; ?>
                        </a>
                    <?php } ?>
                    at <?php echo $project->getCreatedAt(); ?>
                    Updated at <?php echo $project->getModified(); ?>
                </p>
                <table style="padding-left: 5px;">
                    <tr style="border-top: 1px solid #DDDDDD;">
                        <th width="200px;">Status:</th><td width="300px;"><?php echo $status->getName(); ?></td>
                        <th>Start date:</th><td><?php echo $project->getStartDate(); ?></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #DDDDDD;">
                        <th>Completed:</th><td><?php $project->getCompletePercent(); ?></td>
                        <th>End date:</th><td><?php echo $project->getEndDate(); ?></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #DDDDDD;">
                            <td colspan="4"><b>Issue tracking</b></td>
                    </tr>
                    <?php $list_issue_types = IssueTypePeer::RetrieveAll();  ?>
                    <?php $list_issue_status = IssueStatusPeer::RetrieveAllOrderAsc(); ?>
                    <?php foreach ($list_issue_types as $issue_type) : ?>
                        <tr style="border-bottom: 1px solid #DDDDDD;">
                            <th><?php echo $issue_type->getName(); ?></th>
                            <td colspan="3">
                                <?php $count = 0; ?>
                                <?php foreach ($list_issue_status as $issue_status) : ?>
                                    <?php $count++; ?>
                                    <?php $list_issues = IssuePeer::RetrieveByProjectIdTypeIdStatusId($project->getId(), $issue_type->getId(), $issue_status->getId()); ?>                      
                                    <?php
                                    if ($count == count($list_issue_status))
                                        echo count($list_issues) . " " . $issue_status->getName();
                                    else
                                        echo count($list_issues) . " " . $issue_status->getName() . " | ";
                                    ?>
                                <?php endforeach; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                        <tr style="border-bottom: 1px solid #DDDDDD;">
                            <td colspan="4"><b>Members</b></td>
                        </tr>
                    <?php  $list_roles = RolePeer::RetrieveAllAsc(); ?>
                    <?php foreach ($list_roles as $role) : ?>
                        <tr style="border-bottom: 1px solid #DDDDDD;">
                            <th><?php echo $role->getName(); ?></th>
                            <td colspan="3">
                                <?php
                                $count = 0;
                                $list_user = UserPeer::RetrieveAllByProjectIdRoleId($project->getId(), $role->getId());
                                ?>
                                <?php foreach ($list_user as $user) : ?>
                                    <?php $count++; ?>
                                    <?php
                                    if ($count == count($list_user))
                                        echo $user->getFullName();
                                    else
                                        echo $user->getFullName() . ', ';
                                    ?>
                                <?php endforeach; ?>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                </table>
                <p class="view-title-lv2">DESCRIPTION</p><?php  echo $project->getDescription(); ?>
            </div>
        </div>
        <div class="shadow"></div>
    </div>
</div>
<script>
    function edit() {
        window.location = '<?php echo link_to("project/edit?id=" . $project->getId()); ?>';
    }
</script>
