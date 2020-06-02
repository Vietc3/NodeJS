<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$project = $this->project;
$project_id = $project->getId();
?>

<script type="text/javascript">
    $(document).ready(function(){
        $.getScript("<?php echo href_to("templates/quickadmin/_layout/custom.js");?>");
    });
    function getList() {
        var rows = $("#rows").val();
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllUserRole?project_id=".$project_id."&rows=");?>'+rows,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllUserRoleCount?project_id=".$project_id."&rows=");?>'+rows,
            async: false
        }).responseText;
        $("#total_pages").text(result);
        
        if(result == '0')
            $("#page").text('0');
        else
            $("#page").text('1');
    }
    
    function backpage() {
        var rows = $("#rows").val();
        var page = $("#page").text();
        if(page < 2)
            return;
        page--;
        $("#page").text(page);
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllUserRole?project_id=".$project_id."&rows=");?>'+rows+'&page='+page,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
    }
    
    function nextpage() {
        var rows = $("#rows").val();
        var page = $("#page").text();
        var total_pages = $("#total_pages").text();
        if(page >= total_pages)
            return;
        page++;
        $("#page").text(page);
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllUserRole?project_id=$project_id&rows=");?>'+rows+'&page='+page,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
    }
    
    function deleteuserrole(user_id) {
        $confirm = confirm('Are you sure you want to delete?');
        if($confirm){
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/DeleteUserRole?project_id=$project_id&user_id=");?>'+user_id,
            async: false
        }).responseText;
        
        if(result == '1') {
            var rows = $("#rows").val();
            var page = $("#page").text();
            var total_pages = $("#total_pages").text();
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllUserRole?project_id=$project_id&rows=");?>'+rows+'&page='+page,
                async: false
            }).responseText;
            $("#sample-table-sortable").html(result);
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllUserRoleCount?project_id=$project_id&rows=");?>'+rows,
                async: false
            }).responseText;
            if(total_pages > result) {
                page--;
                $("#page").text(page);
            }
            $("#total_pages").text(result);
        }
        }
    }
</script>

<div class="row">
    <div class="span12">
        <div class="panel-wrapper">
            <div class="panel">
                <div class="title">
                    <h4>List Users of <b><a href="<?php echo link_to("project/view?id=$project_id"); ?>"><?php echo $project->getName(); ?></a></b>
                        <div style="float: right; padding-top: 9px; padding-right: 10px;">
                            <a class="btn btn-success btn-title" href="<?php echo link_to("userrole/edit?project_id=$project_id"); ?>">
                                <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/document-new.png') ?>"/> Add User
                            </a>
                        </div>
                    </h4>
                </div>
                <table id="sample-table-sortable" class="table sortable">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                        <?php 
                        $user_role = new UserRole();
                        foreach ($this->user_role_list as $user_role)
                        {
                            $user = UserPeer::RetrieveById($user_role->getUserId());
                            $role = RolePeer::RetrieveById($user_role->getRoleId());
                            
                            $user_role_list[$user_role->getUserId()]['user_name'] = $user->getFullName();
                            $user_role_list[$user_role->getUserId()]['id'] = $user_role->getId();
                            
                            if (isset($user_role_list[$user_role->getUserId()]['role_names']))
                                $user_role_list[$user_role->getUserId()]['role_names'] .= $role->getName() . ", ";
                            else
                                $user_role_list[$user_role->getUserId()]['role_names'] = $role->getName() . ", ";
                            
                        }
                        foreach ($user_role_list as $key =>$value)
                        {
                        ?>
                            <tr>
                                <td><a href="<?php echo link_to("userrole/edit?id=". $user_role_list[$key]['id']."&project_id=$project_id"); ?>"><?php echo $user_role_list[$key]['user_name']; ?></a></td>
                                <td><?php echo substr($user_role_list[$key]['role_names'], 0 , strlen($user_role_list[$key]['role_names']) - 2); ?></td>
                                <td class="center" width="20%">
                                    <a title="Delete" href="javascript:deleteuserrole(<?php echo $key; ?>)"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/delete.png') ?>"></a>
                                </td>
                            </tr>
                        <?php 
                        }
                        if (count($this->user_role_list) == 0)
                        {
                        ?>
                            <tr><td style="text-align:center" colspan="4">There is no available users!</td></tr>
                        <?php 
                        }?>
                    </tbody>
                </table>
            </div>
            <div class="shadow"></div>
        </div>
        <div class="sissue-pagination">
            <a class="sissue-pagination-first" style="cursor: pointer;" onclick="backpage()"><<</a>
            <div class="sissue-pagination-middle">Page</div>
            <div class="sissue-pagination-middle"><label id="page"><?php if (isset($this->page)) echo $this->page; else echo "0"; ?></label></div>
            <div class="sissue-pagination-middle">of</div>
            <div class="sissue-pagination-middle"><label id="total_pages"><?php if (isset($this->total_pages)) echo $this->total_pages; else echo "0"; ?></label></div>
            <div class="sissue-pagination-middle-select">
                <select class="sissue-pagination-select" id="rows" name="rows" onchange="getList()">
                    <option <?php if ($this->rows == 10) echo "selected"; ?>>10</option>
                    <option <?php if ($this->rows == 20) echo "selected"; ?>>20</option>
                    <option <?php if ($this->rows == 30) echo "selected"; ?>>30</option>
                    <option <?php if ($this->rows == 50) echo "selected"; ?>>50</option>
                </select>
            </div>
            <a class="sissue-pagination-last" style="cursor: pointer;" onclick="nextpage()">>></a>
        </div>
    </div>
</div>