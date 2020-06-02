<?php
echo $this->message;
Session::destroy(SESSION_MESSAGE);
if (isset($_SESSION['ISSUE_ID']))
    $issue = IssuePeer::RetrieveById($_SESSION['ISSUE_ID']);
?>

<style type="text/css" media="screen">
    @import "<?php echo href_to('templates/js/jqGrid/css/jquery-ui-1.7.2.custom.css') ?>";
    /*
     * Override styles needed due to the mix of three different CSS sources! For proper examples
     * please see the themes example in the 'Examples' section of this site
    */
</style>
<link href="<?php echo href_to('templates/js/jqGrid/css/ui.jqgrid.css') ?>" rel="stylesheet" type="text/css" />
<link href="<?php echo href_to('templates/js/jqGrid/css/ui.multiselect.css') ?>" rel="stylesheet" type="text/css" />

<script src="<?php echo href_to('templates/js/jquery-ui-1.8.1.custom.min.js') ?>" type="text/javascript"></script>
<script src="<?php echo href_to('templates/js/jquery.layout.js') ?>" type="text/javascript"></script>
<script src="<?php echo href_to('templates/js/grid.locale-en.js') ?>" type="text/javascript"></script>
<script src="<?php echo href_to('templates/js/ui.multiselect.js') ?>" type="text/javascript"></script>
<script src="<?php echo href_to('templates/js/jquery.jqGrid.js') ?>" type="text/javascript"></script>
<script src="<?php echo href_to('templates/js/jquery.tablednd.js') ?>" type="text/javascript"></script>
<script src="<?php echo href_to('templates/js/jquery.contextmenu.js') ?>" type="text/javascript"></script>

<div class="row">
    <div class="panel-wrapper">
        <div class="panel" style="border: none;">
            <div class="title">
                <h4>List Log time of Issue <b><a href="<?php if (isset($_SESSION['ISSUE_ID'])) echo "../issue/view?id=$_SESSION[ISSUE_ID]"; ?>"><?php if (isset($_SESSION['ISSUE_ID'])) echo $issue->getName(); ?></a></b>
                    <div style="float: right; padding-top: 9px; padding-right: 10px;">
                        <a class="btn btn-success btn-title" href="<?php echo link_to("issuetime/edit"); ?>">
                            <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/document-new.png') ?>"/> Create Log time
                        </a>&nbsp;&nbsp;&nbsp;
                        <a class="btn btn-success btn-title" href="javascript:edit()">
                            <img alt="" src="<?php echo href_to('templates/quickadmin/_layout/images/icons/page_white_edit.png') ?>"/> Edit Log time
                        </a>
                    </div>
                </h4>
            </div>
            <div class="content">    
                <table cellpadding="0" cellspacing="0" border="0" id="list4" style="line-height: 40px;">
                </table>
                <div id="pager">
                </div>
                <!-- ## / Panel Content  -->
            </div>
        </div>
        <!--        <div class="shadow"></div>-->
    </div>
</div>
<style>
    table td { height: 0px; border: none;}
    input { height: 24px;}
    span { color: #1D5897;}
    select { width: 240px; margin-top: 10px}
    input[type="button"] { height: 28px; width: 30px; margin-left: 5px;}
    .first { display: none;}
</style>
<script>
    jQuery().ready(function (){ 
        var grid = jQuery("#list4").jqGrid({
            url:'<?php echo link_to("ajax/GetAllIssueTime");?>', 
            editurl: "DeleteIssueTimeUrl",
            mtype: "get",
            datatype: "json", 
            colNames:['Id', 'Date', 'Hours', 'Description'], 
            colModel:[  { name:'id', index:'id', width:20, align: 'center', hidden: true}, 
                { name:'date', index:'date', width:100, align: 'center' }, 
                { name:'hours', index:'hours', width:100, align: 'center' }, 
                { name:'description', index:'description', width: 500 }
            ], 
            rowNum:10, 
            height: "100%",
            autowidth: true,
            shrinkToFit: true, 
            rowList:[10,20,30,50], 
            pager: jQuery('#pager'), 
            sortname: 'id', 
            viewrecords: true, 
            sortorder: "asc"
        }).navGrid('#pager',{
            edit:false,
            add:false,
            del:false,
            search:false,
            searchtext: "Search",
            deltext: "Delete selected row"
        },
        { 
            onSelectCell: function(rowid, cellname, value, iRow, iCol) { }
        }, // default settings for edit
        {}, // default settings for add
        {
            delData: {
                name: function() {
                    var id = grid.jqGrid('getGridParam', 'selrow');
                    $.post("<?php echo link_to("ajax/DeleteIssueTime?id="); ?>"+id);
                }
            }

        });  
    });
    
    function edit() {
        var id = jQuery("#list4").jqGrid('getGridParam', 'selrow');
        if(id == null)
            alert("Please select a row to edit")
        else
            window.location = "edit?id=" + id;
    }
    
</script>

