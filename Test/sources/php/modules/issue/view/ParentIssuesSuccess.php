<option  value="0"></option>
    <?php
    foreach ($this->list_issue_parent as $issuse_parent) 
    {
        $seleted = '';
        if ($this->issue && $issuse_parent->getId() == $this->issue->getParentIssueId())
            $seleted = 'selected="selected"';

        echo "<option $seleted  value=' ". $issuse_parent->getId() . "'>";
        echo str_repeat("&nbsp;&nbsp;&nbsp;", $issuse_parent->getLevel()). "#" . $issuse_parent->getCode() . " : " . $issuse_parent->getName() . "";
    }
    ?>
</option>
