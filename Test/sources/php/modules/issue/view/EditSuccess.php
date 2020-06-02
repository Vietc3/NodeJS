<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$issue = new Issue();
$issue = $this->issue;

$project_id = $this->project_id;

$secret_key = createSecretKey();
$_SESSION[SECRET_KEY] = $secret_key;

?>

<style>
    table td { border: none; background:none!important;}
    .form-horizontal .control-label { padding-top: 15px!important; }
</style>

<script type='text/javascript' src='<?php echo href_to('templates/quickadmin/_layout/scripts/nicEdit/nicEdit.js') ?>'></script>
<!-- calendar-->
<script language="javascript" src="<?php echo href_to('templates/calendar/calendar_us.js') ?>"></script>
<script language="javascript" src="<?php echo href_to('templates/calendar/charscounter.js') ?>"></script>
<link rel="stylesheet" href="<?php echo href_to('templates/calendar/calendar.css') ?>"/>
<!-- editor -->
<script src="<?php echo href_to('templates/js/ckeditor/ckeditor.js') ?>" type="text/javascript"></script>

<style>
    .group label { line-height: 19px!important;}
</style>
<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php echo $this->title; ?> Issue for <b><a href="<?php if (isset($project_id)) echo "../project/view?id=$project_id"; ?>"><?php if (isset($project_id)) echo $this->project->getName(); ?></a></b>
                    <?php
                    if ($this->title == 'Edit') {
                        ?>      
                        <div style="float: right; padding-top: 9px; padding-right: 10px;">
                            <a class="btn btn-success" href="<?php echo $_SERVER['HTTP_REFERER'];?>">
                                <img alt="Back" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/back-icon.png') ?>"/> Back
                            </a>
                        </div>
                    <?php } ?>
                </h4>

            </div>
            <div class="content">  
                <!-- ## / Panel Content  -->
                <form class="form-horizontal" method="post" name="form" action="<?php echo link_to('issue/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <!--       one Column        -->
                    <div>
                        <div class="group fixed">
                            <label class="control-label" for="name"><?php _e('Name'); ?></label>
                            <div class="controls">
                                <input type="text" style="width: 902px !important" class="input-xlarge" id="name" name="name" placeholder="Issue Name" value="<?php echo $issue->getName(); ?>">
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="description"><?php _e('Description'); ?></label>
                            <div class="group fixed">
                                <div class="controls">
                                    <textarea id="description" name="description">
                                        <?php echo $issue->getDescription(); ?>
                                    </textarea>
                                    <script type="text/javascript">
                                        CKEDITOR.replace( 'description',
                                        {
                                            filebrowserBrowseUrl :'<?php echo href_to('templates/') ?>js/ckeditor/filemanager/browser/default/browser.html?Connector=<?php echo href_to('templates/') ?>js/ckeditor/filemanager/connectors/php/connector.php',
                                            filebrowserImageBrowseUrl : '<?php echo href_to('templates/') ?>js/ckeditor/filemanager/browser/default/browser.html?Type=Image&Connector=<?php echo href_to('templates/') ?>js/ckeditor/filemanager/connectors/php/connector.php',
                                            filebrowserFlashBrowseUrl :'<?php echo href_to('templates/') ?>js/ckeditor/filemanager/browser/default/browser.html?Type=Flash&Connector=<?php echo href_to('templates/') ?>js/ckeditor/filemanager/connectors/php/connector.php',
                                            filebrowserUploadUrl  :'<?php echo href_to('templates/') ?>js/ckeditor/filemanager/connectors/php/upload.php?Type=File',
                                            filebrowserImageUploadUrl : '<?php echo href_to('templates/') ?>js/ckeditor/filemanager/connectors/php/upload.php?Type=File',
                                            filebrowserFlashUploadUrl : '<?php echo href_to('templates/') ?>js/ckeditor/filemanager/connectors/php/upload.php?Type=Flash'
                                        });
                                    </script>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--        Left Column       -->
                    <div style="width: 40%; float: left;">
                        <div class="group fixed">
                            <label class="control-label" for="type_id"><?php _e('Type'); ?></label>
                            <div class="controls">
                                <select id="type_id" name="type_id" onchange="getParent(this.value, <?php echo $project_id; ?>)">
                                    <?php
                                    foreach ($this->list_types as $type) 
                                    {
                                        if ($issue->getTypeId() == $type->getId())
                                            $check = 'selected="selected"';
                                        else
                                            $check = '';
                                        ?>
                                        <option <?php echo $check; ?> value="<?php echo $type->getId(); ?>">
                                        <?php echo $type->getName(); ?>
                                        </option>
                                    <?php                                     
                                    } ?>
                                </select>
                            </div>
                        </div>  
                        <div class="group fixed">
                            <label class="control-label" for="parent_issue_id" ><?php _e('Parent'); ?></label>
                            <div class="controls">
                                <select id="parent_issue_id" name="parent_issue_id" >
                                    <?php $this->loadViewFile("modules/issue/view/ParentIssuesSuccess.php"); ?>
                                </select>
                                <img title="Select a parent issue of this issue" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="status_id"><?php _e('Status'); ?></label>
                            <div class="controls">
                                <select id="status_id" name="status_id">
                                    <?php
                                    foreach ($this->list_status as $status) {
                                        $seleted = '';
                                        if ($issue->getStatusId() == $status->getId())
                                            $seleted = 'selected="selected"';
                                        ?>
                                        <option <?php echo $seleted; ?> value="<?php echo $status->getId(); ?>">
                                        <?php echo $status->getName(); ?>
                                        </option>
                                    <?php
                                    } ?>
                                </select>
                                <a href="<?php echo link_to('issuestatus/list?secret_key='.$secret_key) ?>" ><img title="Click here to understand" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/></a>
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="assignee_id">Assignee</label>
                            <div class="controls">
                                <select id="assignee_id" name="assignee_id">
                                    <?php
                                    $dev_role = new Role();
                                    $dev_role = RolePeer::RetrieveByName("Developer");
                                    foreach ($this->list_users as $user) {
                                        $seleted = '';
                                        if ($issue->getAssigneeId() == $user->getId() || ($issue->getAssigneeId() == null && UserRolePeer::RetrieveByUserIdProjectIdRoleId($user->getId(), $this->project->getId(), $dev_role->getId()) != null ))
                                            $seleted = 'selected="selected"';
                                        echo '<option '.$seleted.' value="' . $user->getId() . '">' . $user->getFullName() . '</option>';
                                    }
                                    ?>
                                </select>
                                <img title="This person will be assigned to resolve" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="priority"><?php _e('Priority'); ?></label>
                            <div class="controls med-select">
                                <select id="priority" name="priority">
                                    <?php
                                    $selected = '';
                                    foreach (Common::$gPriority['key'] as $key => $value) {    
                                        if ($issue->getPriority() == $key)
                                            $selected = 'selected="selected"';

                                        if ($selected == '' && $value == 'High')
                                            echo '<option selected = "selected" value = "' . $key . '">' . $value . '</option>';
                                        else
                                            echo '<option '. $selected.' value="' . $key . '">' . $value . '</option>';
                                    }
                                    ?>
                                </select>
                                <img title="Select the priority level to resolve this issue" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                            </div>
                        </div>
                        <?php
                        if ($_SESSION[IS_ADMIN] == 1) {
                            ?>
                            <div class="group fixed">
                                <label class="control-label" style="" for="creator_id"><?php _e('Creator'); ?></label>
                                <div class="controls">
                                    <select id="client" name="creator_id">
                            <?php
                                $manager_role = new Role();
                                $manager_role = RolePeer::RetrieveByName("Project Manager");
                                foreach ($this->list_users as $user) {
                                    $selected = "";
                                    if ($issue->getCreatorId() == $user->getId() || ($issue->getCreatorId() == null && UserRolePeer::RetrieveByUserIdProjectIdRoleId($user->getId(), $this->project->getId(), $manager_role->getId()) != null ))
                                        $selected = " selected='selected' ";
                                ?>
                                            <option <?php echo $selected; ?> value="<?php echo $user->getId(); ?>">
                                            <?php echo $user->getFullName(); ?>
                                            </option>
                                        <?php } ?>
                                    </select>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                    <!--     End Left Column      -->
                    <!--       Right Column       -->
                    <div style="width: 57%; float: right;">
                        <div class="group fixed">
                            <label class="control-label" for="start_date"><?php _e('Start date'); ?></label>
                            <div class="controls">
                                <!-- Calendar -->
                                <input id="start_date" name="start_date" value="<?php
                                    if ($issue->getStartDate() != null) {
                                        echo $date = date("m/d/Y", strtotime($issue->getStartDate()));
                                    } else {
                                        echo $date = date("m/d/Y", time());
                                    }
                                    ?>" type="text" class="input-xlarge">
                                <span style="margin-right: 5px;"><script type="text/javascript">
                                    var o_cal = new tcal ({
                                        //                                                            'formname': 'filterForm',
                                        'controlname': 'start_date'
                                    }, {'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                        'weekdays' : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                                        'yearscroll':false, 'weekstart':1, 'centyear': 70,
                                        'imgpath':'http://live.yeptext.com/js/tigra_calendar/img/'});
                                    </script>
                                </span>  
                                <!-- End Calendar -->
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="end_date"><?php _e('End date'); ?></label>
                            <div class="controls">
                                <!-- Calendar -->
                                <input id="end_date" name="end_date" value="<?php
                                    if ($issue->getEndDate() != null) {
                                        echo $date = date("m/d/Y", strtotime($issue->getEndDate()));
                                    } else {
                                        echo $date = date("m/d/Y", strtotime('+1 week'));
                                    }
                                    ?>" type="text" class="input-xlarge">
                                <span style="margin-right: 5px;"><script type="text/javascript">
                                                              
                                    var o_cal = new tcal ({
                                        //                                                            'formname': 'filterForm',
                                        'controlname': 'end_date'
                                    }, {'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                        'weekdays' : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                                        'yearscroll':false, 'weekstart':1, 'centyear': 70,
                                        'imgpath':'http://live.yeptext.com/js/tigra_calendar/img/'});
                                                              
                                    </script>
                                </span>  
                                <!-- End Calendar -->
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="created_at"><?php _e('Create At'); ?></label>
                            <div class="controls">
                                <!-- Calendar -->
                                <input id="date_create" name="date_create" value="<?php
                                    if ($issue->getCreatedAt() != null) {
                                        echo $date = date("m/d/Y", strtotime($issue->getCreatedAt()));
                                    } else {
                                        echo $date = date("m/d/Y", time());
                                    }
                                    ?>" type="text" class="input-xlarge">
                                <span style="margin-right: 5px;"><script type="text/javascript">
                                                              
                                    var o_cal = new tcal ({
                                        //                                                            'formname': 'filterForm',
                                        'controlname': 'date_create'
                                    }, {'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                        'weekdays' : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                                        'yearscroll':false, 'weekstart':1, 'centyear': 70,
                                        'imgpath':'http://live.yeptext.com/js/tigra_calendar/img/'});
                                                              
                                    </script>
                                </span>  
                                <!-- End Calendar -->
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="complete_percent"><?php _e('Completed'); ?></label>
                            <div class="controls short-select">
                                <select style="width: 60px !important;" id="complete_percent" name="complete_percent">
                                <?php
                                for ($i = 0; $i <= 100; $i+=5) {
                                    if ($issue->getCompletePercent() == $i)
                                        echo '<option selected="selected" value="' . $i . '">' . $i . '</option>';
                                    else
                                        echo '<option value="' . $i . '">' . $i . '</option>';
                                }
                                ?>
                                </select>
                                <img title="The completed percent of this issue" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                            </div>
                        </div>
                        <div >
                            <label class="control-label" for="fileInput">File attachment</label>
                            <div class="controls">
                                <input type="file" id="attached_file" name="attached_file" class="input-file" value="">
                            </div>
                        </div>
                        <div>
                            <div id="attachment" class="controls">
                                <?php
                                    if ($issue->getAttachment()) 
                                        echo "<a href='". href_to('uploads/attachment/' . $issue->getAttachment())."' >". $issue->getAttachment()."</a> - <a href=\"javascript:void(0);\" onclick=\"delete_file('". $issue->getAttachment()."')\">Remove</a>";
                                ?>
                                <input type="hidden" id="attached_file_before" name="attached_file_before"  value="<?php echo $issue->getAttachment(); ?>">
                            </div>
                        </div>
                    </div>
                    <!--end right col-->
                
                    <!--watcher hien wathcher list thanh 4 cot-->                    
                    <div class="control-group" style="width:100%; float:left; margin-bottom: 0px;">
                        <label class="control-label">Watchers 
                            <img title="The selected people will be notified when this issue has any change" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                        </label>
                        <div class="controls">
                            <table style='border:none; background:none; margin-top: 6px;'>
                                <?php
                                $watchers = explode(',', $issue->getWatchers());
                                $user = new User();
                                $i = 0;
                                foreach ($this->list_users as $user) 
                                {
                                    $i++;                                    
                                    $checked = "";
                                    if ($this->isCreate)
                                        $checked = "checked='checked'";
                                    else 
                                        if (in_array($user->getId(), $watchers))
                                            $checked = "checked='checked'";
                                    if ($i % 4 == 1){
                                    ?>
                                    <tr>
                                        <?php }?>
                                        <td>
                                            <label class="checkbox">
                                                <input type="checkbox" <?php echo $checked; ?> name="watchersids[]" value="<?php echo $user->getId() ?>"/> <?php echo $user->getFullName(); ?>
                                            </label>
                                        </td>
                                    <?php
                                   if ($i % 4 == 0){
                                    ?>
                                    </tr>
                                   <?php 
                                   }
                                }
                                //chua du 4 cot
                                if ($i % 4 != 0)
                                {
                                    while ($i++ % 4 != 0)
                                    {
                                        ?>
                                        <td>
                                            <label class="checkbox">
                                                <input type="hidden" name="emptys[]" value="0"/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </label>
                                        </td>
                                        <?php
                                    }
                                    echo "</tr>";
                                }
                                ?>
                            </table>
                        </div>
                    </div>
                    <!--watcher-->
                    
                    <!--notify-->
                     <div class="control-group" style="width:100%; float:left; margin-bottom: 0px;">
                        <label class="control-label">Notification
                            <img title="If you select YES, it will send notification to the selected people at above" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                        </label>
                        <div class="controls">
                            <table style='border:none; background:none; margin-top: 6px;'>
                                <tr>
                                    <td>
                                        <label class="radio" style="padding-left: 18px; padding-right: 28px;">
                                            <input type="radio" checked="checked" name="notify" value="1"/> Yes
                                        </label>
                                        <label class="radio">
                                            <input type="radio" name="notify" value="0"/> No
                                        </label>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <!--notify-->
                    
                    <div style="clear:both;"></div>
                    <div class="form-actions">
                        
                        <input type="hidden" name="id" value="<?php echo $issue->getId(); ?>"/>
                        <input type="hidden" name="project_id" value="<?php echo $project_id; ?>"/>
                        
                        <a href="javascript:document.form.submit();" class="button-blue"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/ok.png'); ?>" style="padding-bottom: 1px;" />&nbsp; <?php if ($this->title == 'Create') echo 'Create'; else echo 'Save changes'; ?></a>
                        <a href="javascript:" onclick="history.go(-1); return false" class="button-white"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/cancel.png'); ?>" style="padding-bottom: 1px;" />&nbsp; Cancel</a>
                    </div>
                </form>
            </div>
            <!--## / Panel Content  -->
        </div>
        <div class="shadow"></div>
    </div>
</div>

<script>
    function delete_file(id){
        if(confirm('Are you sure to remove this file?'))
        {
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to('ajax/deletefile') ?>',
                data: 'id=' + id,
                async: false
            }).responseText;  
            document.getElementById("attachment").innerHTML = "";
        }
    }

    function getParent(issue_type_id, project_id){
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetParentIssuesByType"); ?>',
            data: 'issue_type_id=' + issue_type_id + '&project_id=' + project_id + '&issue_id=<?php echo $issue->getId()?>',
            async: false
        }).responseText;       
        $("#parent_issue_id").html(result);
    }

</script>