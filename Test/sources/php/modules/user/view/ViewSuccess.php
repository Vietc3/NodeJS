<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$user = $this->user;
?>
<style>
    .form-horizontal .control-label {
        padding-top: 13px;
    }
</style>
<div class="row" >
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php _e('View User'); ?></h4>
            </div>
            <div class="content">
                <form class="form-horizontal" method="post" action="<?php echo link_to('user/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <fieldset>
                        <div class="content">
                            <div class="control-group">
                                <label class="control-label" for="email_address">
                                    <?php _e('Email'); ?>
                                </label>
                                <div class="controls">
                                    <input readonly="true" type="text" class="input-xlarge" id="email" name="email" value="<?php echo $user->getEmailAddress() ?>" placeholder="Email">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="full_name">
                                    <?php _e('Full Name'); ?>
                                </label>
                                <div class="controls">
                                    <input readonly="true" type="text" class="input-xlarge" id="full_name" name="full_name" value="<?php echo $user->getFullName() ?>" placeholder="Full Name">
                                </div>
                            </div>
                    </fieldset>
            </div>
            </form>
        </div>
    </div>
</div>
</div>