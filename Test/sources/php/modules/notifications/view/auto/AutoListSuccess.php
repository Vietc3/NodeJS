<div class="row">
    <div class="span7">
        <h2>Manage Notificationss</h2>
    </div>
    <div align="right"  class="span5">
        <a class="btn btn-success" href="<?php echo link_to("notifications/edit"); ?>">
            <i class="icon-plus-sign icon-white"></i> New Notificationss
        </a>
    </div>
</div>
<div class="row">
   <div class="panel-wrapper">
      <div class="panel">
         <div class="title">
            <h4>Notificationss</h4>
         </div>
         <div class="content">    
        <table id="sample-table-sortable" class="table table-bordered table-condensed sortable resizable">
            <thead>
                <tr>
   
                    <th>EmailAddress</th>
                 
   
                    <th>IsRead</th>
                 
   
                    <th>Subject</th>
                 
   
                    <th>Content</th>
                 
   
                    <th>ProjectId</th>
                 
   
                    <th>IssueId</th>
                 
   
                    <th>IsVisible</th>
                 
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                foreach ($this->notificationss as $notifications) {
                    echo "<tr>";
                    echo "<td>" . $notifications->getEmailAddress() . "</td>";
                    echo "<td>" . $notifications->getIsRead() . "</td>";
                    echo "<td>" . $notifications->getSubject() . "</td>";
                    echo "<td>" . $notifications->getContent() . "</td>";
                    echo "<td>" . $notifications->getProjectId() . "</td>";
                    echo "<td>" . $notifications->getIssueId() . "</td>";
                    echo "<td>" . $notifications->getIsVisible() . "</td>";

                    echo 
                    "<td>
                        <a href='". link_to('notifications/edit?id='.$notifications->getId()). "'>
                            <img src='".href_to('templates/quickadmin/_layout/images/icons/icon-edit.png'). "'/>
                        </a>
                        <a href='". link_to('notifications/delete?id='.$notifications->getId()). "' onclick='return confirm(\"Are you sure you want to delete?\");' >
                            <img src='".href_to('templates/quickadmin/_layout/images/icons/icon-delete.png')."'/>
                        </a>
                        
                    </td>";
                    echo "</tr>";
                }
                ?>
            </tbody>
        </table>
         </div>
      </div>
      <div class="shadow"></div>
   </div>
</div>
