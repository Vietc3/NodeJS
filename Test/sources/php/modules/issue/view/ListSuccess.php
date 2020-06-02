<?php
    echo Session::get(SESSION_MESSAGE);
    Session::destroy(SESSION_MESSAGE);
?>

<script type="text/javascript">
    
    $(document).keyup(function(e)
    {
        if (e.keyCode != 13 && e.keyCode != 46 && e.keyCode != 8) return;
        var search_text = $("#search").val();
        if (search_text !='' && e.keyCode != 13) return;
        
        getList(0, 0, '', '', search_text);
    });

    function getList(page, rows, orderby_column, closed_hide, search_text) 
    {
        $("#loadScreen").css({"display" : 'block'});
        
        var project_id = $("#project_id").val();
        
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllIssue?project_id="); ?>' + project_id + "&page=" + page + "&rows=" + rows + "&orderby=" + orderby_column + "&closed_hide=" + closed_hide,
            data: {search_text: search_text},
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
        
        result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllIssueCount"); ?>',
            data: {search_text: search_text},
            async: false
        }).responseText;
        
        var arr = result.split(",");
        
        $("#total_pages").text(arr[0]);
        $("#page").text(arr[1]);
        $("#rows").val(arr[2]);
        if (arr[3]==1)
            $("#closed_hide").attr("checked", true);
        else
            $("#closed_hide").attr("checked", false);

        $("#loadScreen").css({"display" : 'none'});
    }
    
    function getListByRows() 
    {
        var rows = $("#rows").val();
        getList(1, rows, '', '');
    }
    
    function getListByClosedHide() 
    {
        var closed_hide = $("#closed_hide").attr('checked') ? 1 : 0;
        getList(0, 0, '', closed_hide);
    }
    
    function backpage() 
    {
        var page = $("#page").text();
        if(page < 2)
            return;
        page--;
        getList(page, 0, '', '');
    }
    
    function nextpage() 
    {
        var page = $("#page").text();
        var total_pages = $("#total_pages").text();
        if(page >= total_pages)
            return;
        page++;
        
        getList(page, 0, '', '');
    }
    
    function deleteissue(id) {
        $confirm = confirm('Are you sure you want to delete?');
        
        if($confirm){
            
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/DeleteIssue?id="); ?>'+id,
                async: false
            }).responseText;
            
            if (result == 1)
                alert("This issue was deleted successfully!");
            else
                alert("Can not delete this issue!");
            
            getList(0, 0, '', '');
        }        
    }
    
    function createissue()
    {
        var project_id = $("#project_id").val();
        $("#createissue").attr('href','<?php echo link_to("issue/edit?project_id="); ?>' + project_id);
        
    }
</script>

<div class="row">
    <div class="span12">
        <div class="panel-wrapper">
            <div class="panel">
                <div class="title">
                    <h4>Search
                        <input type="text"  id="search" name="search">
                        <img title="Press Enter get a search result" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/Help-icon.png') ?>"/>
                    </h4>
                </div>
            </div>
        </div>
        <div class="panel-wrapper">
            <div class="panel">
                <div class="title">
                    
                    <h4>List Task of 
                        
                        <select id="project_id" name="project_id" onchange="getList( 0, 0, '', '')">
                            <?php 
                            foreach ($this->projects_list as $project)
                            {
                                $check = $project->getId() == $this->project_id ? 'selected="selected"' : '';
                                ?>
                                <option <?php echo $check; ?> value="<?php echo $project->getId(); ?>">
                                    <?php echo $project->getName(); ?>
                                </option>
                            <?php 
                            } ?>
                        </select>
                        &nbsp;&nbsp;&nbsp;
                        <input type="checkbox" name="closed_hide" id="closed_hide" onchange="getListByClosedHide()" <?php if ($this->closed_hide) echo 'checked="checked"';?> >&nbsp;&nbsp;Hide closed
                        <div style="float: right; padding-top: 9px; padding-right: 10px;">
                            <a name="createissue" id="createissue" class="btn btn-success btn-title" href="<?php echo link_to("issue/edit"); ?>" onclick="createissue();">
                                <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/document-new.png') ?>"/> Create Task
                            </a>
                        </div>
                    </h4>
                </div>
                <table id="sample-table-sortable" class="table sortable">
                    <?php $this->loadViewFile("modules/issue/view/TableContentSuccess.php"); ?>
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
                <select class="sissue-pagination-select" id="rows" name="rows" onchange="getListByRows()">
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