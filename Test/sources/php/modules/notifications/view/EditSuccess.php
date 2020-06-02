<?php

$notifications = $this->notifications;

echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);
?>
<div class="row">
   <div class="panel-wrapper">
      <div class="panel">
         <div class="title">
            <h4><?php _e($this->title . ' Notifications'); ?></h4>
         </div>
         <div class="content">  
            <form class="" method="post"  action="edit" id="notifications-form">  
               <div class="group fixed">
                  <label class="control-label" style="display:none;" for="id"><?php _e('Id'); ?></label>
                  <div class="controls">

                     <input type="hidden" class="input-xlarge" id="id" name="id" value="<?php echo $notifications->getId() ?>" placeholder="Notifications Id"/>
                  </div>
               </div>
               <div class="group fixed">
                  <label class="control-label" style="" for="email_address"><?php _e('EmailAddress'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="email_address" name="email_address" value="<?php echo $notifications->getEmailAddress() ?>" placeholder="Notifications EmailAddress"/>
                  </div>
               </div>
               <div class="group fixed">
                  <label class="control-label" style="" for="is_read"><?php _e('IsRead'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="is_read" name="is_read" value="<?php echo $notifications->getIsRead() ?>" placeholder="Notifications IsRead"/>
                  </div>
               </div>
               <div class="group fixed">
                  <label class="control-label" style="" for="subject"><?php _e('Subject'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="subject" name="subject" value="<?php echo $notifications->getSubject() ?>" placeholder="Notifications Subject"/>
                  </div>
               </div>
               <div class="group fixed">
                  <label class="control-label" style="" for="content"><?php _e('Content'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="content" name="content" value="<?php echo $notifications->getContent() ?>" placeholder="Notifications Content"/>
                  </div>
               </div>

               <div class="form-actions">
                  <button  class="btn button-blue">
<?php _e('Save changes'); ?>
                  </button>
                  <a href="list"><input type="button" class="btn button-white" value="<?php _e('Cancel'); ?>"/></a>
               </div>
            </form>
         </div>
      </div>
      <div class="shadow"></div>
   </div>
</div>
