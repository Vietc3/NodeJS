<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$project = $this->project;
?>

<style>
    .group label { line-height: 20px!important;}
</style>

<script type='text/javascript' src='<?php echo href_to('templates/quickadmin/_layout/scripts/nicEdit/nicEdit.js') ?>'></script>
<!-- calendar-->
<script language="javascript" src="<?php echo href_to('templates/calendar/calendar_us.js') ?>"></script>
<script language="javascript" src="<?php echo href_to('templates/calendar/charscounter.js') ?>"></script>
<link rel="stylesheet" href="<?php echo href_to('templates/calendar/calendar.css') ?>"/>
<script src="<?php echo href_to('templates/js/ckeditor/ckeditor.js') ?>" type="text/javascript"></script>

<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php _e($this->title . ' Project'); ?></h4>
            </div>
            <div class="content">  
                <!-- ## / Panel Content  -->
                <form class="form-horizontal" name="form" method="post" action="<?php echo link_to('project/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <div>
                        <div class="group fixed">
                            <label class="control-label" for="name"><?php _e('Name'); ?></label>
                            <div class="controls">
                                <input type="text" style="width: 902px !important" class="input-xlarge" id="name" name="name" placeholder="Project Name" value="<?php echo $project->getName(); ?>">
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="description"><?php _e('Description'); ?></label>
                            <div class="group fixed">
                                <div class="controls">
                                    <textarea id="description" name="description">
                                        <?php echo $project->getDescription(); ?>
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
                            <label class="control-label" for="project_status_id"><?php _e('Status'); ?></label>
                            <div class="controls">
                                <select id="status_id" name="project_status_id">
                                    <?php
                                    foreach ($this->list_status as $status) {
                                        if ($project->getProjectStatusId() == $status->getId())
                                            $check = 'selected="selected"';
                                        else
                                            $check = '';
                                        ?>
                                        <option <?php echo $check; ?> value="<?php echo $status->getId(); ?>">
                                            <?php echo $status->getName(); ?>
                                        </option>
                                    <?php } ?>
                                </select>
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
                                        foreach ($this->list_users as $user) {
                                            $selected = "";
                                            if ($project->getCreatorId() == $user->getId())
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
                    <!--       Right Column        -->
                    <div style="width: 57%; float: right;">
                        <div class="group fixed">
                            <label class="control-label" for="start_date"><?php _e('Start date'); ?></label>
                            <div class="controls">
                                <?php if ($this->title == "Create") { ?>
                                    <!-- Calendar -->
                                    <input id="start_date" name="start_date" value="<?php
                                    if ($project->getStartDate() != null) {
                                        echo $date = date("m/d/Y", strtotime($project->getStartDate()));
                                    } else {
                                        echo $date = date("m/d/Y", time());
                                    }
                                    ?>" type="text" class="input-xlarge" onkeyup="check_calender();">
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
                                    <span class="alert alert-error" style="display: none;" id="controls_p1" for="" generated="true"></span>
                                    <!-- End Calendar -->
                                <?php } else { ?>
                                    <input id="start_date" name="start_date" value="<?php
                                    if ($project->getStartDate() != null) {
                                        echo $date = date("m/d/Y", strtotime($project->getStartDate()));
                                    } else {
                                        echo $date = date("m/d/Y", time());
                                    }
                                    ?>" type="text" class="input-xlarge" readonly="true">
                                       <?php } ?>
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="end_date"><?php _e('End date'); ?></label>
                            <div class="controls">
                                <?php if ($this->title == "Create") { ?>
                                    <!-- Calendar -->
                                    <input id="end_date" name="end_date" value="<?php
                                    if ($project->getEndDate() != null) {
                                        echo $date = date("m/d/Y", strtotime($project->getEndDate()));
                                    } else {
                                        echo $date = date("m/d/Y", strtotime('+1 year'));
                                    }
                                    ?>" type="text" class="input-xlarge" onkeyup="check_calender();">
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
                                    <span class="alert alert-error" style="display: none;" id="controls_p2" for="" generated="true"></span>
                                    <!-- End Calendar -->
                                <?php } else { ?>
                                    <input id="end_date" name="end_date" value="<?php
                                    if ($project->getEndDate() != null) {
                                        echo $date = date("m/d/Y", strtotime($project->getEndDate()));
                                    } else {
                                        echo $date = date("m/d/Y", time());
                                    }
                                    ?>" type="text" class="input-xlarge" readonly="true">

                                    <span style="visibility: hidden;"><script type="text/javascript">
                                        var o_cal = new tcal ({
                                            //                                                            'formname': 'filterForm',
                                            'controlname': 'start_date'
                                        }, {'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                            'weekdays' : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                                            'yearscroll':false, 'weekstart':1, 'centyear': 70,
                                            'imgpath':'http://live.yeptext.com/js/tigra_calendar/img/'});
                                        </script>
                                    </span>  
                                <?php } ?>
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" style="" for="created_at"><?php _e('Created At'); ?></label>
                            <div class="controls">
                                <!-- Calendar -->
                                <?php if ($this->title == "Create") { ?>
                                    <input id="created_at" name="created_at" value="<?php
                                    if ($project->getCreatedAt() != null) {
                                        echo $date = date("m/d/Y", strtotime($project->getCreatedAt()));
                                    } else {
                                        echo $date = date("m/d/Y", time());
                                    }
                                    ?>" type="text" class="input-xlarge" onkeyup="check_calender();"/>
                                    <span style="margin-right: 5px;"><script type="text/javascript">
                                        var o_cal = new tcal ({ 'controlname': 'created_at'}, {
                                            'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                            'weekdays' : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                                            'yearscroll':false, 'weekstart':1, 'centyear': 70,
                                            'imgpath':'http://live.yeptext.com/js/tigra_calendar/img/'});
                                        </script>
                                    </span>
                                <?php } else { ?>
                                    <input id="created_at" name="created_at" value="<?php
                                    if ($project->getCreatedAt() != null) {
                                        echo $date = date("m/d/Y", strtotime($project->getCreatedAt()));
                                    } else {
                                        echo $date = date("m/d/Y", time());
                                    }
                                    ?>" type="text" class="input-xlarge" readonly="true"/>
                                       <?php } ?>
                            </div>
                        </div>
                        <!--       end right col           -->
                    </div>
                    <div style="clear:both;"></div>
                    <div class="form-actions">
                        <input type="hidden" name="id" value="<?php echo $project->getId(); ?>"/>
                        <a href="javascript:document.form.submit();" class="button-blue"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/ok.png'); ?>" style="padding-bottom: 1px;" />&nbsp; <?php  if ($this->title == 'Create') echo 'Create'; else echo 'Save changes'; ?></a>
                        <a href="javascript:" onclick="history.go(-1); return false" class="button-white"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/cancel.png'); ?>" style="padding-bottom: 1px;" />&nbsp; Cancel</a>
                    </div>
                </form>
            </div>
            <!-- ## / Panel Content  -->
        </div>
    <div class="shadow"></div>
    </div>
</div>
<script>
    function check_calender(){
        if(document.getElementById("created_at").value == "" ){
            document.getElementById("controls_p3").innerHTML = "You must choose the Date.";
            document.getElementById("controls_p3").style.display = "block";
            $('#controls3').addClass('error'); 
            $('#controls3').removeClass('success');
            return false;
        }
        else
        {
            var mdy = document.getElementById("created_at").value.split('/')
            var date = new Date(mdy[2], mdy[0]-1, mdy[1]);
            var currentDate = new Date();

            if(date < currentDate) {
                document.getElementById("controls_p3").innerHTML = "You must choose valid Date.";
                document.getElementById("controls_p3").style.display = "block";
                $('#controls3').addClass('error'); 
                $('#controls3').removeClass('success');
                return false;
            } 
            document.getElementById("controls_p3").style.display = "none"; 
            $('#controls3').removeClass('error');
            $('#controls3').addClass('success');
        }
         
        if(document.getElementById("end_date").value == ""){
            document.getElementById("controls_p2").innerHTML = "You must choose the Date.";
            document.getElementById("controls_p2").style.display = "block";
            $('#controls_p2').addClass('error'); 
            $('#controls_p2').removeClass('success');
            return false;
        }else
        {
            var mdy = document.getElementById("end_date").value.split('/')

            var date = new Date(mdy[2], mdy[0]-1, mdy[1]);
            var currentDate = new Date();

            if(date < currentDate) {
                document.getElementById("controls_p2").innerHTML = "You must choose valid Date.";
                document.getElementById("controls_p2").style.display = "block";
                $('#controls_p2').addClass('error'); 
                $('#controls_p2').removeClass('success');
                return false;
            } 
            document.getElementById("controls_p2").style.display = "none"; 
            $('#controls_p2').removeClass('error');
            $('#controls_p2').addClass('success');
        }
         
        if(document.getElementById("start_date").value == "")
        {
            document.getElementById("controls_p1").innerHTML = "You must choose the Date.";
            document.getElementById("controls_p1").style.display = "block";
            $('#controls_p1').addClass('error'); 
            $('#controls_p1').removeClass('success');
            return false;
        }
        else{
            var mdy = document.getElementById("start_date").value.split('/')

            var date = new Date(mdy[2], mdy[0]-1, mdy[1]);
            var currentDate = new Date();

            if(date < currentDate) {
                document.getElementById("controls_p1").innerHTML = "You must choose valid Date.";
                document.getElementById("controls_p1").style.display = "block";
                $('#controls_p1').addClass('error'); 
                $('#controls_p1').removeClass('success');
                return false;
            } 
            document.getElementById("controls_p1").style.display = "none"; 
            $('#controls_p1').removeClass('error');
            $('#controls_p1').addClass('success');
        }
        return true;
    }
</script>