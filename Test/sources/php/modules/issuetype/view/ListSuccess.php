<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);
?>

<script type="text/javascript">
    $(document).ready(function(){
        $.getScript("<?php echo href_to("templates/quickadmin/_layout/custom.js");?>");
    });
    function getList() {
        var rows = $("#rows").val();
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllIssueType?rows=");?>'+rows,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllIssueTypeCount?rows=");?>'+rows,
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
            url: '<?php echo link_to("ajax/GetAllIssueType?rows=");?>'+rows+'&page='+page,
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
            url: '<?php echo link_to("ajax/GetAllIssueType?rows=");?>'+rows+'&page='+page,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
    }
    
    function deletetype_issue(id) {
        $confirm = confirm('Are you sure you want to delete?');
        if($confirm){
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/DeleteIssueType?id=");?>'+id,
            async: false
        }).responseText;
        
        if(result == '1') {
            var rows = $("#rows").val();
            var page = $("#page").text();
            var total_pages = $("#total_pages").text();
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllIssueType?rows=");?>'+rows+'&page='+page,
                async: false
            }).responseText;
            $("#sample-table-sortable").html(result);
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllIssueTypeCount?rows=");?>'+rows,
                async: false
            }).responseText;
            if(total_pages > result) {
                page--;
                $("#page").text(page);
            }
            $("#total_pages").text(result);
        }
        else
        {
            alert("Issue type is in used, can't be deleted!");
        }
        }
    }
</script>

<div class="row">
    <div class="span12">
        <div class="panel-wrapper">
            <div class="panel">
                <div class="title">
                    <h4>List Issue Type
                        <div style="float: right; padding-top: 9px; padding-right: 10px;">
                            <a class="btn btn-success btn-title" href="<?php echo link_to("issuetype/edit"); ?>">
                                <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/document-new.png') ?>"/> Create Type
                            </a>
                        </div>
                    </h4>
                </div>
                <table id="sample-table-sortable" class="table sortable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th width='20%'>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                        <?php if(count($this->type_issues)>0) { foreach ($this->type_issues as $type_issue) : ?>
                        <tr style="background-color: <?php echo $type_issue->getColor(); ?>">
                                <td><a href="<?php echo link_to("issuetype/edit"); ?>&id=<?php echo $type_issue->getId(); ?>"><?php echo $type_issue->getName(); ?></a></td>
                                <td><?php echo $type_issue->getDescription(); ?></td>
                                <td class="center">
                                    <a title="Delete" href="javascript:deletetype_issue(<?php echo $type_issue->getId(); ?>)"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/delete.png') ?>"></a>
                                </td>
                            </tr>
                        <?php endforeach; } else {?>
                            <tr><td style="text-align:center" colspan="3">There is no available type!</td></tr>
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
                    <option>50</option>
                </select>
            </div>
            <a class="sissue-pagination-last" style="cursor: pointer;" onclick="nextpage()">>></a>
        </div>
    </div>
</div>