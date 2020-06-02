<thead>
    <tr>
        <th onclick="getList('code')">Code</th>
        <th onclick="getList('name')">Name</th>
        <th onclick="getList('assignee')">Assignee</th>
        <th onclick="getList('type')">Type</th>
        <th onclick="getList('status')">Status</th>
        <th onclick="getList('complete_percent')">Completed</th>
        <th onclick="getList('priority')">Priority</th>
        <th onclick="getList('start_date')">Start date</th>
        <th onclick="getList('end_date')">End date</th>
        <?php
        if ($_SESSION[IS_ADMIN]) 
            echo 
                "<th>Time</th>";
        ?>
        <th>Actions</th>
    </tr>
</thead>
<tbody id="tbody">
    <?php
        $issue = new Issue();
        foreach ($this->issues_list as $issue) 
        {
            $type = IssueTypePeer::RetrieveById($issue->getTypeId());
            $status = IssueStatusPeer::RetrieveById($issue->getStatusId());
        ?>
            <tr>
                <td class='center'><?php echo $issue->getCode(); ?></td>
                <td><?php echo str_repeat('<span class="parent-children">|&mdash;</span>', $issue->getLevel()); ?><a href="<?php echo link_to("issue/view?id=".$issue->getId()); ?>" title="<?php echo $issue->getName(); ?>">
                    <?php echo substr($issue->getName(), 0, TITLE_CHAR_LIMIT); if(strlen($issue->getName())>TITLE_CHAR_LIMIT) echo '...' ?> </a>
                    &nbsp;
                    <?php if ($issue->getAttachment()) echo  "<a href='".  href_to('uploads/attachment/'.$issue->getAttachment())."'><img alt='download this attached file' src='". href_to('templates/quickadmin/_layout/images/icons/attach.png')."'/></a>"; ?>
                </td>
                <td><?php echo $issue->assignee; ?></td>
                <td style="background-color: <?php echo $type? $type->getColor() : "" ; ?> !important" ><?php echo $issue->type; ?></td>
                <td style="background-color: <?php echo $status? $status->getColor() : "" ; ?> !important" ><?php echo $issue->status; ?></td>
                <td style="background-color: <?php echo $status? $status->getColor() : "" ; ?> !important"  class="center"><?php echo $issue->getCompletePercent(); ?> %</td>
                <td><?php echo $issue->getPriority(); ?></td>
                <td class="center"><?php echo $issue->getStartDate(); ?></td>
                <td class="center"><?php echo $issue->getEndDate(); ?></td>
                <?php
                if ($_SESSION[IS_ADMIN]) 
                    echo '<td class="center">' . $issue->getHours() . "</td>";
                ?>
                <td class="center">
                    <a title="Update" href="<?php echo link_to("issue/update?id=" . $issue->getId()); ?>"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/update.png') ?>"></a>&nbsp;
                    <a title="Edit" href="<?php echo link_to("issue/edit?id=" . $issue->getId()); ?>"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/page_white_edit.png') ?>"></a>&nbsp;
                    <a title="Delete" href="javascript:deleteissue(<?php echo $issue->getId(); ?>)"><img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/delete.png') ?>"></a>
                </td>
            </tr>
    <?php 
        }
        if (count($this->issues_list) == 0){ ?>
            <tr><td style="text-align:center" colspan="9">There is no available issues!</td></tr>
    <?php } ?>
</tbody>

