<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

?>
<style>
    .panel-login { margin: 72px auto 100px !important; }
</style>
<div id="forgot-form" class="modal hide fade">
    <div class="modal-header">
        <a class="close" data-dismiss="modal">&times;</a>
        <h3><?php _e('Account Recovery'); ?></h3>
    </div>
    <div class="modal-body">
        <div id="message"></div>
        <form action="<?php echo link_to('user/forgotpassword'); ?>" method="post" name="forgotform" id="forgotform" class="form-stacked forgotform normal-label">
            <div class="controlgroup forgotcenter">
                <label for="email"><?php _e('Email Address'); ?></label>
                <div class="control">
                    <input id="email" name="email" size="30" type="text"/>
                </div>
            </div>
            <button type="submit" data-loading-text="<?php _e('loading...'); ?>" data-complete-text="<?php _e('Done'); ?>" name="forgotten" class="btn btn-primary modal-btn" id="forgotsubmit"><?php _e('Submit'); ?></button>
        </form>
    </div>
    <div class="modal-footer"><p><?php _e('It\'ll be easy, I promise.'); ?></p></div>
</div>

<div class="panel-wrapper panel-login">
    <div class="panel">
        <div class="title">
            <h4><?php _e('Sign in'); ?></h4>
        </div>
        <div class="content">
            <!-- ## Panel Content  -->
            <form method="post" class="form normal-label" action="<?php echo link_to('user/login') ?>">
                <fieldset>

                    <div class="control-group">
                        <label for="email" class="login-label" style="padding-right:30px;"><?php _e('Email'); ?></label>
                        <div class="controls">
                            <input class="xlarge" id="email" name="email" size="30" type="text" value="<?php echo isset($this->email)? $this->email: "" ?>"/>
       <!--                     <span class="forgot"><a data-toggle="modal" href="#forgot-form" id="forgotlink" tabindex=-1><?php // _e('Trouble signing in');                ?></a>?</span>-->
                        </div>
                    </div>
                    <div class="control-group">
                        <label for="password" class="login-label"><?php _e('Password'); ?></label>
                        <div class="controls">
                            <input class="xlarge" id="password" name="password" size="30" type="password" value ="<?php echo isset($this->password)? $this->password: ""?>"/>
                        </div>
                    </div>
                </fieldset>
                <input type="hidden" name="token" value="<?php echo isset($_SESSION['token'])? $_SESSION['token'] : ""; ?>"/>
                <input type="hidden" name="url" value="<?php echo $_SERVER['REQUEST_URI']; ?>"/>

                <div style="margin-bottom: 30px;">
                    <div style="width: 30%; float: left;">
                        <input type="submit" value="<?php _e('Sign in'); ?>" class="button-blue" id="login-submit" name="login"/>
                    </div>
                    <div style="width: 40%; float: right; padding-top: 10px;">
                        Stay signed in
                        <input style="width: 10px !important;" type="checkbox" id="stay" name="stay" value="1"/>

                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="shadow"></div>
</div>
