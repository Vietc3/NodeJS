<?php

$projectstatus = $this->projectstatus;

echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);
?>


<div class="row">
   <div class="panel-wrapper">
      <div class="panel">
         <div class="title">
            <h4><?php _e($this->title . ' Project Status'); ?></h4>
         </div>
         <div class="content">  
            <!-- ## / Panel Content  -->
            <form class="" name="form" method="post" action="edit" id="projectstatus-form">  
               <div class="group fixed">
                  <label class="control-label" style="display:none;" for="id"><?php _e('Id'); ?></label>
                  <div class="controls">
                     <input type="hidden" class="input-xlarge" id="id" name="id" value="<?php echo $projectstatus->getId() ?>" placeholder="Projectstatus Id"/>
                  </div>
               </div>
               <div class="group fixed">
                  <label class="control-label" style="" for="name"><?php _e('Name'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="name" name="name" value="<?php echo $projectstatus->getName() ?>" placeholder="Projectstatus Name"/>
                  </div>
               </div>
               <div class="group fixed">
                  <label class="control-label" style="" for="description"><?php _e('Description'); ?></label>
                  <div class="controls">

                     <input type="text" class="input-xlarge" id="description" name="description" value="<?php echo $projectstatus->getDescription() ?>" placeholder="Projectstatus Description"/>
                  </div>
               </div>
               <div class="form-actions">
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