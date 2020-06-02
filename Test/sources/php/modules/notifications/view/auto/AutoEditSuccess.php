<?php

$notifications = $this->notifications;
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
               <div class="group fixed">
                  <label class="control-label" style="" for="project_id"><?php _e('ProjectId'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="project_id" name="project_id" value="<?php echo $notifications->getProjectId() ?>" placeholder="Notifications ProjectId"/>
                  </div>
               </div>
               <div class="group fixed">
                  <label class="control-label" style="" for="issue_id"><?php _e('IssueId'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="issue_id" name="issue_id" value="<?php echo $notifications->getIssueId() ?>" placeholder="Notifications IssueId"/>
                  </div>
               </div>
               <div class="group fixed">
                  <label class="control-label" style="" for="is_visible"><?php _e('IsVisible'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="is_visible" name="is_visible" value="<?php echo $notifications->getIsVisible() ?>" placeholder="Notifications IsVisible"/>
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
