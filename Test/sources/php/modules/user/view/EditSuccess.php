<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$user = $this->user;
?>
<style>
    .form-horizontal .control-label {
        padding-top: 15px;
    }
</style>
<div class="row" >
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php echo $this->title; ?><?php _e(' User'); ?></h4>
            </div>
            <div class="content">
                <form class="form-horizontal" name="form" method="post" action="<?php echo link_to('user/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <fieldset>
                        <div class="content">
                            <div class="control-group">
                                    <label class="control-label" for="email_address"> Email</label>
                                    <div class="controls">
                                        <input type="text" <?php if ($user->getEmailAddress()) echo 'readonly="true"'; ?> class="input-xlarge" id="email" name="email" value="<?php echo $user->getEmailAddress() ?>" placeholder="Email">
                                    </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="full_name">Full Name</label>
                                <div class="controls">
                                    <input type="text" class="input-xlarge" id="full_name" name="full_name" value="<?php echo $user->getFullName() ?>" placeholder="Full Name">
                                </div>
                            </div>
                            <?php if ($user->getEmailAddress()) 
                            {
                            ?>
                            <div class="control-group">
                                <label class="control-label" for="old_password"><?php _e('Old Password'); ?></label>
                                <div class="controls">
                                    <input type="password" class="input-xlarge" id="old_password" name="old_password" placeholder=" Old Password">
                                </div>
                            </div>
                            <?php 
                            }
                            ?>
                            <div class="control-group">
                                <label class="control-label" for="password"><?php _e('New Password'); ?></label>
                                <div class="controls">
                                    <input type="password" class="input-xlarge" id="password" name="password" placeholder=" New Password">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="confirm_password"><?php _e('Confirm Password'); ?></label>
                                <div class="controls">
                                    <input type="password" class="input-xlarge" id="confirm_password" name="confirm_password"  placeholder="Confirm Password">
                                </div>
                            </div>
                            <?php
                            if ($_SESSION[IS_ADMIN] == 1) 
                            {
                                ?>
                            <div class="control-group">
                                <label style="padding-top: 6px;" class="control-label" style="" for="is_active"><?php _e('Active'); ?></label>
                                <div class="controls">
                                    <?php
                                    if ($user->getIsActive() == 1)
                                        $checked = "checked='checked'";
                                    else
                                        $checked = '';
                                    ?>
                                    <input type="checkbox" style="outline: none;" id="is_active" name="is_active" <?php echo $checked; ?> value="<?php echo $user->getIsActive() ?>" />
                                </div>
                            </div>
                            <div class="control-group">
                                <label style="padding-top: 6px;" class="control-label" style="" for="is_admin"><?php _e('Is Admin'); ?></label>
                                <div class="controls">
                                    <?php
                                    if ($user->getIsAdmin() == 1)
                                        $checked = "checked='checked'";
                                    else
                                        $checked = '';
                                    ?>
                                    <input type="checkbox" style="outline: none;" id="is_admin" name="is_admin" <?php echo $checked; ?> value="<?php echo $user->getIsAdmin() ?>" />
                                </div>
                            </div>
                            <?php
                            }
                                ?>
                    </fieldset>
                    <div class="form-actions">
                        <input type="hidden" name="id" value="<?php echo $user->getId(); ?>"/>
                        <input type="hidden" name="create_at" value="<?php echo $user->getCreatedAt(); ?>"/>
                        <a href="javascript:document.form.submit();" class="button-blue"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/ok.png'); ?>" style="padding-bottom: 1px;" />&nbsp; <?php  if ($this->title == 'Create') echo 'Create'; else echo 'Save changes'; ?></a>
                        <a href="javascript:" onclick="history.go(-1); return false" class="button-white"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/cancel.png'); ?>" style="padding-bottom: 1px;" />&nbsp; Cancel</a>
                    </div>
            </div>
            </form>
        </div>
    </div>
</div>
</div>