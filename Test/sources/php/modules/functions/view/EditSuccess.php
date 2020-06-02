<?php
$functions = $this->functions;
$categories = $this->list_categories;
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
                <h4><?php echo $this->title;
_e(' Function'); ?></h4>
            </div>
            <div class="content">
                <form class="form-horizontal" method="post" action="<?php echo link_to('functions/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <fieldset>
                        <div class="content">
                            <div class="control-group">
                                <label class="control-label" for="email_address">
                                    <?php _e('Name'); ?>
                                </label>
                                <div class="controls">
                                    <input type="text" class="input-xlarge" id="name" name="name" value="<?php echo $functions->getName() ?>" placeholder="Name"/>
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="full_name">
                                    <?php _e('Description'); ?>
                                </label>
                                <div class="controls">
                                    <input type="text" class="input-xlarge" id="description" name="description" value="<?php echo $functions->getDescription() ?>" placeholder="Description"/>
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="category">
                                    <?php _e('Category'); ?>
                                </label>
                                <div class="controls">
                                    <input type="text" class="input-xlarge" id="category" name="category" value="<?php echo $functions->getCategory() ?>" placeholder="Category"/>
                                   
                                </div>
                            </div>
                    </fieldset>
                    <div class="form-actions">
                        <input type="hidden" name="id" value="<?php echo $functions->getId(); ?>"/>
                        <input type="submit" value="<?php
                                        if ($this->title == 'Create')
                                            echo 'Create'; else
                                            echo 'Save changes';
                                        ?>" class="button-blue">
                        <a href="javascript:" onclick="history.go(-1); return false"><input style="width:150px;" type="button" class="button-white" value="<?php _e('Cancel'); ?>"/></a>
                    </div>
            </div>
            </form>
        </div>
    </div>
</div>
</div>