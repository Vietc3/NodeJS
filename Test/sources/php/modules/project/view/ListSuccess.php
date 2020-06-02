
<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);

$project = new AutoProject(); 
?>

<script type="text/javascript">
    function getList() {
        var rows = $("#rows").val();
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllProject?rows="); ?>'+rows,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllProjectCount?rows="); ?>'+rows,
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
            url: '<?php echo link_to("ajax/GetAllProject?rows="); ?>'+rows+'&page='+page,
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
            url: '<?php echo link_to("ajax/GetAllProject?rows="); ?>'+rows+'&page='+page,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
    }
    
    function setprojectdefault(id) {
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/SetDefaultProject?id="); ?>'+id,
            async: false
        }).responseText;
        
        if(result == '1') {
            var rows = $("#rows").val();
            var page = $("#page").text();
            var total_pages = $("#total_pages").text();
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllProject?rows="); ?>'+rows+'&page='+page,
                async: false
            }).responseText;
            $("#sample-table-sortable").html(result);
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllProjectCount?rows="); ?>'+rows,
                async: false
            }).responseText;
            if(total_pages > result) {
                page--;
                $("#page").text(page);
            }
            $("#total_pages").text(result);
        }
    }
    
    function deleteproject(id) 
    {
        $confirm = confirm('Are you sure you want to delete?');
        if($confirm)
        {
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/DeleteProject?id="); ?>'+id,
                async: false
            }).responseText;
            
            if(result == '1') 
            {
                alert("This project was deleted successfully!");
                
                var rows = $("#rows").val();
                var page = $("#page").text();
                var total_pages = $("#total_pages").text();
                var result = $.ajax({
                    type: 'POST',
                    url: '<?php echo link_to("ajax/GetAllProject?rows="); ?>'+rows+'&page='+page,
                    async: false
                }).responseText;
                $("#sample-table-sortable").html(result);
                var result = $.ajax({
                    type: 'POST',
                    url: '<?php echo link_to("ajax/GetAllProjectCount?rows="); ?>'+rows,
                    async: false
                }).responseText;
                if(total_pages > result) {
                    page--;
                    $("#page").text(page);
                }
                $("#total_pages").text(result);
            }
            else
                alert("Project is in used, can't be deleted! Please contact Administrator to delete this project");
        }
    }
</script>

<div class="row">
    <div class="span12">
        <div class="panel-wrapper">
            <div class="panel">
                <div class="title">
                    <h4>List Project
                        <div style="float: right; padding-top: 9px; padding-right: 10px;">
                            <a class="btn btn-success btn-title" href="<?php echo link_to("project/edit"); ?>">
                                <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/document-new.png') ?>"/> Create Project
                            </a>
                        </div>
                    </h4>
                </div>
                <table id="sample-table-sortable" class="table sortable">
                    <thead>
                        <tr>
                            <th width="20%">Name</th>
                            <th>Status</th>
                            <th>Completed</th>
                            <th>Default</th>
                            <th>Start date</th>
                            <th>End date</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                        <?php if(count($this->projects)>0) { foreach ($this->projects as $project) : ?>
                            <tr>
                                <td><a href="<?php echo link_to("project/view"); ?>&id=<?php echo $project->getId(); ?>"><?php echo $project->getName(); ?></a></td>
                                <td><?php echo $project->status; ?></td>
                                <td class="center"><?php echo $project->getCompletePercent(); ?> %</td>
                                <td class="center">
                                    <a title="Set default" href="javascript:setprojectdefault(<?php echo $project->getId(); ?>)"><img src="<?php if($project->is_project_default) echo href_to('templates/quickadmin/_layout/images/icons/icon-16-default.png'); else echo href_to('templates/quickadmin/_layout/images/icons/icon-16-notdefault.png'); ?>"></a>
                                </td>
                                <td class="center"><?php echo $project->getStartDate(); ?></td>
                                <td class="center"><?php echo $project->getEndDate(); ?></td>
                                <td class="center"><?php echo $project->getCreatedAt(); ?></td>
                                <td class="center">
                                    <a title="Assign user" href="<?php echo link_to("userrole/list"); ?>&project_id=<?php echo $project->getId(); ?>"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/group.png') ?>"></a>&nbsp;
                                    <a title="Edit" href="<?php echo link_to("project/edit"); ?>&id=<?php echo $project->getId(); ?>"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/page_white_edit.png') ?>"></a>&nbsp;
                                    <a title="Delete" href="javascript:deleteproject(<?php echo $project->getId(); ?>)"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/delete.png') ?>"></a>
                                </td>
                            </tr>
                        <?php endforeach; } else {?>
                            <tr><td style="text-align:center" colspan="8">There is no available projects!</td></tr>
                        <?php }?>
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
                    <option>10</option>
                    <option>20</option>
                    <option>30</option>
                    <option selected="selected">50</option>
                </select>
            </div>
            <a class="sissue-pagination-last" style="cursor: pointer;" onclick="nextpage()">>></a>
        </div>
    </div>
</div>