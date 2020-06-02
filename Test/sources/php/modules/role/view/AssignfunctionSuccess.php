<?php
$role = new Role();
$role = RolePeer::RetrieveById($_GET['role_id']);
?>
<style>
    table td { border: none; background:none!important;}
    .form-horizontal .control-label { padding-top: 15px!important; }
</style>
<div class="panel-wrapper">
    <div class="panel">
        <div class="title">
            <h4><?php _e('Assign Functions'); ?></h4>
        </div>
        <div class="content">
            <form class="form-horizontal" method="post" action="<?php echo link_to('role/assignfunction'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                <div class="control-group">
                    <label class="control-label" for="name">
                        <?php _e('Name'); ?>
                    </label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="name" name="name" disabled="true" value="<?php echo $role->getName() ?>" placeholder="Name">
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label" for="role">
                        <?php _e('Function'); ?>
                    </label>
                    <div class="controls">
                        <?php
                        $list_all_categories = FunctionsPeer::RetrieveAllCategories();
                        $list_role_functions = RoleFunctionPeer::RetrieveAllByRoleId($role->getId());
                        echo "<table>";
                        foreach ($list_all_categories as $category) {
                            if($category == "User" || $category == "Role" || $category == "Function")
                                continue;
                            echo "<tr>";
                            echo "<td width='150px;'><b>" . $category . "</b><td/>";
                            echo "<td></td>";
                            echo "</tr>";
                            $list_all_functions = FunctionsPeer::RetrieveAllOrderByCategory($category);
                            foreach ($list_all_functions as $function) {
                                $count = 0;
                                foreach ($list_role_functions as $role_function) {
                                    if ($function->getId() == $role_function->getFunctionId()) {
                                        $count++;
                                        $checked = "checked='checked'";
                                        echo "<tr>"
                                        ?>
                                        <?php echo "<td>"; ?>
                                        <label class="checkbox">
                                            <input type="checkbox" <?php echo $checked; ?> name="functionids[]" value="<?php echo $function->getId() ?>"/>
                                            <?php echo $function->getName(); ?>
                                        </label>
                                        <?php echo "</td>"; ?>
                                        <?php echo "<td>"; ?>
                                        <label>
                                            <?php echo $function->getDescription(); ?>
                                        </label>
                                        <?php echo "</td>"; ?>
                                        <?php
                                        echo "</tr>";
                                    }
                                }
                                if ($count == 0) {
                                    ?>
                                    <?php echo "<tr>"; ?>
                                    <?php echo "<td>"; ?>
                                    <label class="checkbox">
                                        <input type="checkbox" name="functionids[]" value="<?php echo $function->getId() ?>"/>
                                        <?php echo $function->getName(); ?>
                                    </label>
                                    <?php echo "</td>"; ?>
                                    <?php echo "<td>"; ?>
                                    <label>
                                        <?php echo $function->getDescription(); ?>
                                    </label>
                                    <?php echo "</td>"; ?>
                                    <?php echo "</tr>"; ?>
                                    <?php
                                }
                            }
                        }
                        echo "</table>";
                        ?>
                    </div>
                </div>
                <div class="form-actions">
                    <input type="hidden" name="role_id" value="<?php echo $role->getId(); ?>"/>
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
</script>