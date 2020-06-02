<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$issue = new Issue();
$issue = $this->issue;

$secret_key = createSecretKey();
$_SESSION[SECRET_KEY] = $secret_key;
?>

<style>
    table td { border: none; background:none!important;}
    .form-horizontal .control-label { padding-top: 15px!important; }
</style>

<!-- editor -->
<script src="<?php echo href_to('templates/js/ckeditor/ckeditor.js') ?>" type="text/javascript"></script>

<style>
    .group label { line-height: 19px!important;}
</style>
<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4>Comment
                     
                    <div style="float: right; padding-top: 9px; padding-right: 10px;">
                            <a class="btn btn-success" href="<?php echo $_SERVER['HTTP_REFERER'];?>">
                                <img alt="Back" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/back-icon.png') ?>"/> Back
                            </a>
                        </div>
               
                </h4>
            </div>
            <div class="content">  
                <!-- ## / Panel Content  -->
                <form class="form-horizontal" name="form" method="post" action="<?php echo link_to('issue/update'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <!--       one Column        -->
                    <div>
                        <div class="group fixed">
                            <label class="control-label" for="name"><?php _e('Name'); ?></label>
                            <div class="controls">
                                <input disabled="disable" type="text" style="width: 902px !important" class="input-xlarge" id="name" name="name" placeholder="Issue Name" value="<?php echo $issue->getName(); ?>">
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="comment"><?php _e('Comment'); ?></label>
                            <div class="group fixed">
                                <div class="controls">
                                    <textarea id="comment" name="comment">
                                    </textarea>
                                    <script type="text/javascript">
                                        CKEDITOR.replace( 'comment',
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
                    
                    <!--        just admin or developer can log time       -->
                    <?php 
                    $dev_role = new Role();
                    $dev_role = RolePeer::RetrieveByName("Developer");
                    if ( $_SESSION[IS_ADMIN] == 1 || UserRolePeer::RetrieveByUserIdProjectIdRoleId( $_SESSION[USER_ID], $issue->getProjectId(), $dev_role->getId()) != null )
                    {
                    ?>
                        <div style="width: 20%">
                            <div class="group fixed">
                                <label class="control-label" for="hours">Working Time (Hours)</label>
                                <div class="controls">
                                    <input  type="text" id="hours" name="hours" placeholder="" value="<?php echo $issue->getHours() ?>">
                                    <img title="You must comment before logging time. You can log time in float number" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                                </div>
                            </div>
                        </div>
                    <?php
                    }
                    ?>
                    
                    
                    <!--        Left Column       -->
                    <div style="width: 40%; float: left;">
                        <div class="group fixed">
                            <label class="control-label" for="status_id"><?php _e('Status'); ?></label>
                            <div class="controls">
                                <select  id="status_id" name="status_id">
                                    <?php
                                    foreach ($this->list_status as $status)
                                    {
                                        if ($issue->getStatusId() == $status->getId())
                                            $check = 'selected="selected"';
                                        else
                                            $check = '';
                                        ?>
                                        <option <?php echo $check; ?> value="<?php echo $status->getId(); ?>">
                                            <?php echo $status->getName(); ?>
                                        </option>
                                    <?php } ?>
                                </select>
                                <a href="<?php echo link_to('issuestatus/list?secret_key='.$secret_key) ?>" ><img title="Click here to understand" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/></a>
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="complete_percent"><?php _e('Completed'); ?></label>
                            <div class="controls short-select">
                                <select id="complete_percent" name="complete_percent">
                                    <?php
                                    for ($i = 0; $i <= 100; $i+=5)
                                    {
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
                    </div>
                    <!--     End Left Column      -->
                    <!--       Right Column       -->
                    <div style="width: 57%; float: right;">
                        <div class="group fixed">
                            <label class="control-label" for="assignee_id">Assignee</label>
                            <div class="controls">
                                <select id="assignee_id" name="assignee_id">
                                    <?php
                                    foreach ($this->list_users as $user)
                                    {
                                        if ($issue->getAssigneeId() == $user->getId())
                                            echo '<option selected="selected" value="' . $user->getId() . '">' . $user->getFullName() . '</option>';
                                        else
                                            echo '<option value="' . $user->getId() . '">' . $user->getFullName() . '</option>';
                                    }
                                    ?>
                                </select>
                                <img title="This person will be assigned to resolve" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
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
                    <div class="control-group" style="width:100%; float:left;">
                        <label class="control-label">Watchers 
                            <img title="The selected people will be notified when this issue has any change" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                        </label>
                        <div class="controls">
                            <table style='border:none; background:none;'>
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
                    <div class="control-group" style="width:100%; float:left;">
                        <label class="control-label">Notification
                            <img title="If you select YES, it will send notification to the selected people at above" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                        </label>
                        <div class="controls">
                            <table style='border:none; background:none;'>
                                <tr>
                                    <td>
                                        <label class="radio">
                                            <input type="radio" checked="checked" name="notify" value="1"/> YES
                                        </label>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label class="radio">
                                            <input type="radio" name="notify" value="0"/> NO
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
                        <a href="javascript:document.form.submit();" class="button-blue"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/ok.png'); ?>" style="padding-bottom: 1px;" />&nbsp; <?php  if ($this->title == 'Create') echo 'Create'; else echo 'Save changes'; ?></a>
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
    function delete_file(filename){
        if(confirm('Are you sure to remove this file?'))
        {
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to('ajax/deleteFileNotYetSaved') ?>',
                data: 'filename=' + filename,
                async: false
            }).responseText;  
            document.getElementById("attachment").innerHTML = "";
        }
    }
</script>