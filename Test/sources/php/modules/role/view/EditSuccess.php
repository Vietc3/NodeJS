<?php
$role = $this->role;
?>
<div class="row">
   <div class="panel-wrapper">
      <div class="panel">
         <div class="title">
            <h4><?php echo $this->title; ?> Role</h4>
         </div>
         <div class="content">
            <form class="form-horizontal" name="form" method="post" action="<?php echo link_to('role/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
               <div class="control-group">
                  <label class="control-label" for="rolename"><?php _e('Role Name'); ?></label>
                  <div class="controls">
                     <input type="text" class="input-xlarge" id="rolename" name="rolename" placeholder="Role Name" value="<?php echo $role->getName(); ?>">
                  </div>
               </div>
               </fieldset>
               <div class="form-actions">
                  <input type="hidden" name="id" value="<?php echo $role->getid(); ?>"/>
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