<?php
$issue_time = $this->issue_time;
$issue = IssuePeer::RetrieveById($issue_time->getIssueId());
?>

<!-- calendar-->
<script language="javascript" src="<?php echo href_to('templates/calendar/calendar_us.js') ?>"></script>
<script language="javascript" src="<?php echo href_to('templates/calendar/charscounter.js') ?>"></script>
<link rel="stylesheet" href="<?php echo href_to('templates/calendar/calendar.css') ?>"/>
<script src="<?php echo href_to('templates/js/ckeditor/ckeditor.js') ?>" type="text/javascript"></script>

<style>
    .group label { line-height: 18px!important;}
</style>

<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4>Spent time</h4>
            </div>
            <div class="content">  
                <!-- ## / Panel Content  -->
                <form class="form-horizontal" method="post" action="<?php echo link_to('issuetime/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <!--       one Column        -->
                    <div>
                        <div class="group fixed">
                            <label class="control-label" for="name"><?php _e('Issue Name'); ?></label>
                            <div class="controls">
                                <input disabled="disable" type="text" style="box-shadow: none!important; font-weight: bold;" id="name" name="name" placeholder="Issue Name" value="<?php echo $issue->getName(); ?>">
                            </div>
                        </div>
                        <div class="group fixed">
                            <label class="control-label" for="description"><?php _e('Description'); ?></label>
                            <div class="group fixed">
                                <div class="controls">
                                    <textarea id="description" name="description">
                                        <?php echo $issue_time->getDescription(); ?>
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
                    <div class="group fixed">
                        <label class="control-label" for="_date"><?php _e('Date'); ?></label>
                        <div class="controls">
                            <!-- Calendar -->
                            <input id="_date" name="_date" value="<?php
                                        if ($issue_time->getDate() != null) {
                                            echo $date = date("m/d/Y", strtotime($issue_time->getDate()));
                                        }
                                        ?>" type="text" class="input-xlarge"/>
                            <span style="margin-right: 5px;"><script type="text/javascript">
                                var o_cal = new tcal ({
                                    //                                                            'formname': 'filterForm',
                                    'controlname': '_date'
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
                        <label class="control-label" for="hours"><?php _e('Hours'); ?></label>
                        <div class="controls">
                            <input type="text" class="input-xlarge" id="hours" name="hours" value="<?php echo $issue_time->getHours(); ?>">
                        </div>
                    </div>
                    <div style="clear:both"></div>
                    <div class="form-actions">
                        <input type="hidden" value="<?php echo $issue->getId(); ?>" name="issue_id"/>
                        <input type="submit" value="<?php if ($this->title == 'Create') echo 'Create'; else echo 'Save changes'; ?>" class="button-blue">
                        <a href="javascript:" onclick="history.go(-1); return false"><input style="width:150px;" type="button" class="button-white" value="<?php _e('Cancel'); ?>"/></a>
                    </div>
                </form>
            </div>
            <!-- ## / Panel Content  -->
        </div>
    </div>
    <div class="shadow"></div>
</div>