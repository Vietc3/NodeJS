<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);
    
$issue = new Issue();

$user_list = UserPeer::RetrieveAll();

$user_id = $_SESSION[USER_ID];
if ($_SESSION[IS_ADMIN] && isset($_REQUEST['user_id']) && $_REQUEST['user_id'])
    $user_id = $_REQUEST['user_id'];

$list_projects = ProjectPeer::RetrieveAllByUserId($user_id);
?>


<div class="row">
    <div class="span12">
        <div class="panel-wrapper">
            <?php 
            if ($_SESSION[IS_ADMIN]) {
            ?>
            <div class="panel">
                <form name="myissue" action="<?php echo link_to('issue/ListMyIssue')?>" method="POST">
                    <select id="user_id" name="user_id" >
                        <?php 
                        foreach ($user_list as $user)
                        {
                            $checked = $user->getId() == $user_id ? " selected='selected' " : "";
                            ?>
                            <option <?php echo $checked; ?> value="<?php echo $user->getId(); ?>">
                                <?php echo $user->getFullName(); ?>
                            </option>
                        <?php 
                        }
                        ?>
                    </select>
                    <input type="submit" value="Search"/>
                </form>
            </div>
            
            <?php
            }
            
            $has_result = false;
            foreach ($list_projects as $project) 
            {
                $list_issues = IssuePeer::RetrieveOpenIssueByUserIdAndProjectId( $user_id, $project->getId() );
                if(count($list_issues))
                {
                    $has_result = true;

                ?>

            <div class="panel">
                <div class="title">
                    <h4>
                            <?php echo "Project name : <strong>" . $project->getName(); ?></strong>
                    </h4>
                </div>  
                <div>
                    <table id="sample-table-sortable" class="table sortable" style="padding: 20px;">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Completed</th>
                                <th>Assignee</th>
                                <th>Priority</th>
                                <th>Start date</th>
                                <th>End date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            <?php
                                foreach ($list_issues as $issue)
                                {
                                    ?>
                                        <tr>
                                            <td class='center'><?php echo $issue->getCode(); ?></td>
                                            <td><a href="<?php echo link_to("issue/view"); ?>&id=<?php echo $issue->getId(); ?>" title="<?php echo $issue->getName(); ?>"><?php echo substr($issue->getName(),0,TITLE_CHAR_LIMIT); ?><?php if(strlen($issue->getName())> TITLE_CHAR_LIMIT) echo '...' ?> </a>
                                                &nbsp;
                                                <?php if ($issue->getAttachment()) echo  "<a href='".  href_to('uploads/attachment/'.$issue->getAttachment())."'><img alt='download this attached file' src='". href_to('templates/quickadmin/_layout/images/icons/attach.png')."'/></a>"; ?>
                                            </td>
                                            <td><?php echo $issue->type; ?></td>
                                            <td><?php echo $issue->status; ?></td>
                                            <td class="center"><?php echo $issue->getCompletePercent(); ?> %</td>
                                            <td><?php echo $issue->assignee; ?></td>
                                            <td><?php echo $issue->getPriority(); ?></td>
                                            <td class="center"><?php echo $issue->getStartDate(); ?></td>
                                            <td class="center"><?php echo $issue->getEndDate(); ?></td>
                                            <td class="center">
                                                <a title="Update" href="<?php echo link_to("issue/update"); ?>&id=<?php echo $issue->getId();  ?>"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/update.png') ?>"></a>&nbsp;
                                                <a title="Edit" href="<?php echo link_to("issue/edit"); ?>&id=<?php   echo $issue->getId(); ?>"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/page_white_edit.png') ?>"></a>&nbsp;
                                                <a title="Delete" href="javascript:deleteissue(<?php echo $issue->getId();  ?>)"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/delete.png') ?>"></a>
                                            </td>
                                        </tr>

                                    <?php
                                }
                            ?>
                            </tbody>
                        </table>
                    </div>
                <div class="shadow">
                </div>
            </div>
            <?php
                }
            ?>
                &nbsp;&nbsp;
            <?php 
            }
            if (!$has_result)
            {
            ?>
                There is no available issues!
            <?php
            }
            ?>
        </div>
    </div>
</div>