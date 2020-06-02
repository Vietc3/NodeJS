<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$user_role = $this->user_role;
$project_id = $this->project_id;
$user_list  = $this->user_list;

$project = ProjectPeer::RetrieveById($project_id);
$user = UserPeer::RetrieveById($user_role->getUserId());
$all_role_list = RolePeer::RetrieveAll();
?>

<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php _e($this->title . ' User for '); ?> <b><a href="<?php echo link_to("project/view?id=$project_id"); ?>"><?php echo $project->getName(); ?></a></b> </h4>
            </div>
            <div class="content">  
                <!-- ## / Panel Content  -->
                <form class="form-horizontal" name="form" method="post" action="<?php echo link_to('userrole/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <div>
                        <?php 
                        if ($user != null) 
                        { 
                        ?>
                            <div class="group fixed">
                                <label class="control-label" for="name"><?php _e('Name'); ?></label>
                                <div class="controls">
                                    <input type="hidden" class="input-xlarge" id="user_id" name="user_id" value="<?php echo $user->getId() ?>" />
                                    <input type="text" class="input-xlarge" id="name" name="name" value="<?php echo $user->getFullName() ?>" />
                                </div>
                            </div>
                            <div class="control-group">
                                    <label class="control-label" for="role">
                                        <?php _e('Role'); ?>
                                    </label>
                                    <div class="controls">
                                        <?php
                                        $role_id_list = UserRolePeer::RetrieveAllRoleIdByUserIdAndProjectId($user->getId(), $project_id);

                                        foreach ($all_role_list as $role) 
                                        {
                                            $checked = "";
                                            if (in_array($role->getId(), $role_id_list))
                                                $checked = "checked='checked'";
                                        ?>
                                            <label class="checkbox">
                                                <input type="checkbox" <?php echo $checked; ?> id="<?php echo $role->getId(); ?>" name="role_ids[]" value="<?php echo $role->getId() ?>"/>
                                                <?php echo $role->getName(); ?>
                                            </label>
                                        <?php
                                        }
                                        ?>
                                    </div>
                                </div>
                        <?php 
                        }
                        else 
                        {
                        ?>
                            <div class="group fixed">
                                <label class="control-label" for="user_id"><?php _e('Name'); ?></label>
                                <div class="controls">
                                    <select id="user_id" name="user_id">
                                        <?php
                                        foreach ($user_list as $user)
                                        {
                                            ?>
                                            <option value="<?php echo $user->getId(); ?>">
                                                <?php echo $user->getFullName(); ?>
                                            </option>
                                        <?php 
                                        }
                                        ?>
                                    </select>
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="role">
                                    <?php _e('Role'); ?>
                                </label>
                                <div class="controls">
                                    <?php
                                    foreach ($all_role_list as $role) 
                                    {
                                    ?>
                                    <label class="checkbox">
                                        <input type="checkbox" id="<?php echo $role->getId(); ?>" name="role_ids[]" value="<?php echo $role->getId() ?>"/>
                                        <?php echo $role->getName(); ?>
                                    </label>
                                <?php
                                    }
                                    ?>
                                </div>
                            </div>
                        <?php } ?>
                        <div style="clear:both;"></div>
                        <div class="form-actions">
                            <input type="hidden"  id="id" name="id" value="<?php echo $user_role->getId() ?>" />
                            <input type="hidden" name="project_id" id="project_id" value="<?php echo $project_id?>"/>
                            <a href="javascript:document.form.submit();" class="button-blue"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/ok.png'); ?>" style="padding-bottom: 1px;" />&nbsp; <?php  if ($this->title == 'Create') echo 'Create'; else echo 'Save changes'; ?></a>
                        <a href="javascript:" onclick="history.go(-1); return false" class="button-white"><img src="<?php echo href_to('/templates/quickadmin/_layout/images/icons/cancel.png'); ?>" style="padding-bottom: 1px;" />&nbsp; Cancel</a>
                        </div>
                    </div>
                </form>
                <!-- ## / Panel Content  -->
            </div>
        </div>
        <div class="shadow"></div>
    </div>
</div>