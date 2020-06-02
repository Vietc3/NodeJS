<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$user = new User();
$user = UserPeer::RetrieveById($_GET['userid']);
?>
<div class="panel-wrapper">
    <div class="panel">
        <div class="title">
            <h4><?php _e('Assign Role for User'); ?></h4>
        </div>
        <div class="content">
            <form class="form-horizontal" method="post" action="<?php echo link_to('user/assignrole'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                <div class="control-group">
                    <label class="control-label" for="email_address">
                        <?php _e('User'); ?>
                    </label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="email" name="email" disabled="true" value="<?php echo $user->getEmailAddress() ?>" placeholder="Email">
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label" for="role">
                        <?php _e('Role'); ?>
                    </label>
                    <div class="controls">
                            <?php
                            $list_all_role = RolePeer::RetrieveAll();
                            $list_role_id = UserRolePeer::RetrieveAllRoleIdByProjectIdUserId(0, $user->getId());
                            foreach ($list_all_role as $role) {
                                $count = 0;
                                for ($j = 0; $j < count($list_role_id); $j++) :
                                    if ($role->getId() == $list_role_id[$j]) {
                                        $count++;
                                        $checked = "checked='checked'";
                                        ?>
                                        <label class="checkbox">
                                            <input type="checkbox" <?php echo $checked; ?> id="<?php echo $role->getId(); ?>" name="roleids[]" value="<?php echo $role->getId() ?>"/>
                                            <?php echo $role->getName(); ?>
                                        </label>
                                        <?php
                                    }
                                endfor;
                                if ($count == 0) {
                                    ?>
                                    <label class="checkbox">
                                        <input type="checkbox" name="roleids[]" value="<?php echo $role->getId() ?>"/>
                                        <?php echo $role->getName(); ?>
                                    </label>
                                    <?php
                                }
                            }
                            ?>
                        </div>
                </div>
                <div class="form-actions">
                    <input type="hidden" name="userid" value="<?php echo $user->getId(); ?>"/>
                    <input type="submit"  value="Save changes" class="button-blue">
                    <a href="javascript:" onclick="history.go(-1); return false"><input style="width:150px;" type="button" class="button-white" value="<?php _e('Cancel'); ?>"/></a>
                </div>
            </form> 
            <!-- ## / Panel Content  -->
        </div>
    </div>
    <div class="shadow"></div>
</div>

</div>
<script>
    function check(value) {
        alert(value);
        if(value) {
            $(this).closet("span").removeClass("checked");
        }
    }
    
    function getRoles(project_id){
        <?php for ($i = 0; $i < count($list_project_id); $i++) : ?>
                $("#<?php echo $list_project_id[$i]; ?>").hide();    
        <?php endfor; ?>
        $("#" + project_id).show();
    }
</script>