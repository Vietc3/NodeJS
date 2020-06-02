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
            url: '<?php echo link_to("ajax/GetAllUser?rows=");?>'+rows,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/GetAllUserCount?rows=");?>'+rows,
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
            url: '<?php echo link_to("ajax/GetAllUser?rows=");?>'+rows+'&page='+page,
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
            url: '<?php echo link_to("ajax/GetAllUser?rows=");?>'+rows+'&page='+page,
            async: false
        }).responseText;
        $("#sample-table-sortable").html(result);
    }
    
    function setActiveUser(id) {
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/setActiveUser?id=");?>'+id,
            async: false
        }).responseText;
        
        if(result == 1) {
            var rows = $("#rows").val();
            var page = $("#page").text();
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllUser?rows=");?>'+rows+'&page='+page,
                async: false
            }).responseText;
            $("#sample-table-sortable").html(result);
        }
    }
    
    function deleteuser(id) {
        $confirm = confirm('Are you sure you want to delete?');
        if(!$confirm) return;
        
        var result = $.ajax({
            type: 'POST',
            url: '<?php echo link_to("ajax/DeleteUser?id=");?>'+id,
            async: false
        }).responseText;
        
        if(result == '1') {
            var rows = $("#rows").val();
            var page = $("#page").text();
            var total_pages = $("#total_pages").text();
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllUser?rows=");?>'+rows+'&page='+page,
                async: false
            }).responseText;
            $("#sample-table-sortable").html(result);
            var result = $.ajax({
                type: 'POST',
                url: '<?php echo link_to("ajax/GetAllUserCount?rows=");?>'+rows,
                async: false
            }).responseText;
            if(total_pages > result) {
                page--;
                $("#page").text(page);
            }
            $("#total_pages").text(result);
        }
    }
</script>

<div class="row">
    <div class="span12">
        <div class="panel-wrapper">
            <div class="panel">
                <div class="title">
                    <h4>List Users
                        <div style="float: right; padding-top: 9px; padding-right: 10px;">
                            <a class="btn btn-success btn-title" href="<?php echo link_to("user/edit"); ?>">
                                <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/document-new.png') ?>"/> Create User
                            </a>
                        </div>
                    </h4>
                </div>
                <table id="sample-table-sortable" class="table sortable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Activated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                        <?php if(count($this->users)>0) { foreach ($this->users as $user) : ?>
                            <tr>
                                <td><a href="<?php echo link_to("user/edit"); ?>&id=<?php echo $user->getId(); ?>"><?php echo $user->getFullName(); ?></a></td>
                                <td><?php echo $user->getEmailAddress(); ?></td>
                                <td class="center">
                                    <a href="javascript:setActiveUser(<?php echo $user->getId(); ?>)"><img src="<?php if ($user->getIsActive()) echo href_to('templates/quickadmin/_layout/images/icons/tick.png'); else echo href_to('templates/quickadmin/_layout/images/icons/publish_x.png'); ?>"></a>
                                </td>
                                <td class="center">
                                    <a href="<?php echo link_to("user/assignrole"); ?>&userid=<?php echo $user->getId(); ?>" title="Assign role"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/group.png') ?>"></a>
                                    &nbsp;
                                    <a title="Delete" href="javascript:deleteuser(<?php echo $user->getId(); ?>)"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/delete.png') ?>"></a>
                                </td>
                            </tr>
                        <?php endforeach; } else {?>
                            <tr><td style="text-align:center" colspan="4">There is no available users!</td></tr>
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