<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4>Notifications</h4>
            </div>
            <div class="content">    
                <table id="sample-table-sortable" class="table table-bordered table-condensed sortable resizable">
                    <thead>
                        <tr>
                            <th>Subject</th> 
                            <th>Content</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $notifications = new Notifications();
                        foreach ($this->notificationss as $notifications) {
                                $issue = IssuePeer::RetrieveById($notifications->getIssueId());
                                if ($notifications->getIsRead() == 1)
                                    echo "<tr>";
                                else
                                    echo "<tr style='background-color:#F1FFC4;'>";

                                if ($issue) {
                                    echo "<td style='color:#389FCC ;'><a href='" . link_to('issue/view?id=' . $notifications->getIssueId()) . "'>" . $notifications->getSubject() . "</a>";
                                    if ($issue->getAttachment()) 
                                        echo  "&nbsp;<a href='".  href_to('uploads/attachment/'.$issue->getAttachment())."'><img alt='download this attached file' src='". href_to('templates/quickadmin/_layout/images/icons/attach.png')."'/></a>"; 
                                    echo "</td>";
                                }
                                else if ($notifications->getProjectId() != null)
                                    echo "<td style='color:#389FCC ;'><a href='" . link_to('project/view?id=' . $notifications->getProjectId()) . "'>" . $notifications->getSubject() . "</a></td>";
                                else
                                    echo "<td style='color:#389FCC ;'>" . $notifications->getSubject() . "</td>";

                                echo "<td>" . $notifications->getContent() . "</td>";
                                echo
                                "<td>
                        
                        <a href='" . link_to('notifications/invisible?id=' . $notifications->getId()) . "' onclick='return confirm(\"Are you sure you want to invisible?\");' >
                            <img title='Invisible' src='" . href_to('templates/quickadmin/_layout/images/icons/icon-delete.png') . "'/>
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
