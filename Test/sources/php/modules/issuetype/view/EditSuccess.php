<?php
$issuetype = $this->issuetype;
?>

<script type="text/javascript" src="<?php echo href_to('templates/js/colorpicker/jscolor.js') ?>"></script>

<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php echo $this->title; ?> Issue Type</h4>
            </div>
            <div class="content">  
                <!-- ## / Panel Content  -->
                <form class="form-horizontal" name="form" method="post" action="<?php echo link_to('issuetype/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <div style="width: 50%;">
                        <div class="control-group">
                            <label class="control-label" for="name"><?php _e('Type Name'); ?></label>
                            <div class="controls">
                                <input type="text" class="input-xlarge" id="name" name="name" placeholder="Type Name" value="<?php echo $issuetype->getName(); ?>">
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="description"><?php _e('Description'); ?></label>
                            <div class="controls">
                                <input type="text" class="input-xlarge" id="description" name="description" placeholder="Description" value="<?php echo $issuetype->getDescription(); ?>">
                            </div>
                        </div>
                    </div>
                    
                    <div style="width: 50%;">
                        <div class="control-group" style="width: 50%;">
                            <label class="control-label" for="name"><?php _e('Color'); ?></label>
                            <div class="controls" >
                                <input style="width: 50px;" name="color" class="color" value="<?php echo $issuetype->getColor() ?>">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <input type="hidden" name="id" value="<?php echo $issuetype->getId(); ?>"/>
                        <a href="javascript:document.form.submit();" class="button-blue"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/ok.png'); ?>" style="padding-bottom: 1px;" />&nbsp; <?php  if ($this->title == 'Create') echo 'Create'; else echo 'Save changes'; ?></a>
                        <a href="javascript:" onclick="history.go(-1); return false" class="button-white"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/cancel.png'); ?>" style="padding-bottom: 1px;" />&nbsp; Cancel</a>
                    </div>
                </form>
                <!-- ## / Panel Content  -->
            </div>
        </div>
        <div class="shadow"></div>
    </div>
</div>
