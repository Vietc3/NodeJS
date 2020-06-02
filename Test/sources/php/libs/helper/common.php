<?php

class Common {

    static public $gPriority = array(
        'key' => array(
            'Low', 'Normal', 'High', 'Urgent', 'Immediate'
        ),
        'value' => array(
            'Low'       => 0, 'Normal'    => 1, 'High'      => 2, 'Urgent'    => 3, 'Immediate' => 4
        )
    );

    static function FormatCurrency($num, $isFloat = true) {
        if ($isFloat) {
            $num = sprintf('%.2f', $num);
            $i   = strpos($num, '.');
            $tp  = substr($num, $i + 1);
            $num = substr($num, 0, $i);
        }
        else {
            $tp  = '';
            $num = "$num";
        }

        $x = '';
        for ($i = 0; $i < strlen($num); $i++) {
            if ($i > 0 && $i % 3 == 0) {
                $x = $num[strlen($num) - $i - 1] . ',' . $x;
            }else
                $x = $num[strlen($num) - $i - 1] . $x;
        }
        if ($tp != '')
            $x .= '.' . $tp;
        return $x;
    }

}

function isEmail($email) {
    return(preg_match("/^[-_.[:alnum:]]+@((([[:alnum:]]|[[:alnum:]][[:alnum:]-]*[[:alnum:]])\.)+(ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no|np|nr|nt|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$|(([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])\.){3}([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5]))$/i", $email));
}

function secure($string) {

    if (!is_array($string)) :
        $string = Database::getConn()->quote(trim($string));
    else :
        foreach ($string as $key => $value) :
            $string[$key] = Database::getConn()->quote(trim($value));
        endforeach;
    endif;

    return $string;
}

function redirect($url) {
    Header("Location: $url");
}

function createRandomPassword() {

    $chars = "abcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*()_-+=";
    srand((double) microtime() * 1000000);
    $i     = 0;
    $pass  = '';

    while ($i <= 10) {
        $num  = rand() % 33;
        $tmp  = substr($chars, $num, 1);
        $pass = $pass . $tmp;
        $i++;
    }

    return $pass;
}

function createSecretKey() {
    $chars = "abcdefghijkmnopqrstuvwxyz0123456789!@#&*_-+=";
    srand((double) microtime() * 1000000);
    $i     = 0;
    $pass  = '';

    while ($i <= 20) {
        $num  = rand() % 33;
        $tmp  = substr($chars, $num, 1);
        $pass = $pass . $tmp;
        $i++;
    }

    return $pass;
}


function xml2array($url, $get_attributes = 1, $priority = 'tag') {
    $contents = "";
    if (!function_exists('xml_parser_create')) {
        return array();
    }
    $parser = xml_parser_create('');
    if (!($fp     = @ fopen($url, 'rb'))) {
        return array();
    }
    while (!feof($fp)) {
        $contents .= fread($fp, 8192);
    }
    fclose($fp);
    xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, "UTF-8");
    xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
    xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
    xml_parse_into_struct($parser, trim($contents), $xml_values);
    xml_parser_free($parser);
    if (!$xml_values)
        return; //Hmm...
    $xml_array = array();
    $parents = array();
    $opened_tags = array();
    $arr = array();
    $current            = & $xml_array;
    $repeated_tag_index = array();
    foreach ($xml_values as $data) {
        unset($attributes, $value);
        extract($data);
        $result = array();
        $attributes_data = array();
        if (isset($value)) {
            if ($priority == 'tag')
                $result          = $value;
            else
                $result['value'] = $value;
        }
        if (isset($attributes) and $get_attributes) {
            foreach ($attributes as $attr => $val) {
                if ($priority == 'tag')
                    $attributes_data[$attr] = $val;
                else
                    $result['attr'][$attr]  = $val; //Set all the attributes in a array called 'attr'
            }
        }
        if ($type == "open") {
            $parent[$level - 1] = & $current;
            if (!is_array($current) or (!in_array($tag, array_keys($current)))) {
                $current[$tag]                           = $result;
                if ($attributes_data)
                    $current[$tag . '_attr']                 = $attributes_data;
                $repeated_tag_index[$tag . '_' . $level] = 1;
                $current                                 = & $current[$tag];
            }
            else {
                if (isset($current[$tag][0])) {
                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
                    $repeated_tag_index[$tag . '_' . $level]++;
                }
                else {
                    $current[$tag] = array(
                        $current[$tag],
                        $result
                    );
                    $repeated_tag_index[$tag . '_' . $level] = 2;
                    if (isset($current[$tag . '_attr'])) {
                        $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                        unset($current[$tag . '_attr']);
                    }
                }
                $last_item_index         = $repeated_tag_index[$tag . '_' . $level] - 1;
                $current                 = & $current[$tag][$last_item_index];
            }
        }
        elseif ($type == "complete") {
            if (!isset($current[$tag])) {
                $current[$tag]                           = $result;
                $repeated_tag_index[$tag . '_' . $level] = 1;
                if ($priority == 'tag' and $attributes_data)
                    $current[$tag . '_attr']                 = $attributes_data;
            }
            else {
                if (isset($current[$tag][0]) and is_array($current[$tag])) {
                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
                    if ($priority == 'tag' and $get_attributes and $attributes_data) {
                        $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                    }
                    $repeated_tag_index[$tag . '_' . $level]++;
                }
                else {
                    $current[$tag] = array(
                        $current[$tag],
                        $result
                    );
                    $repeated_tag_index[$tag . '_' . $level] = 1;
                    if ($priority == 'tag' and $get_attributes) {
                        if (isset($current[$tag . '_attr'])) {
                            $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                            unset($current[$tag . '_attr']);
                        }
                        if ($attributes_data) {
                            $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                        }
                    }
                    $repeated_tag_index[$tag . '_' . $level]++; //0 and 1 index is already taken
                }
            }
        }
        elseif ($type == 'close') {
            $current = & $parent[$level - 1];
        }
    }
    return ($xml_array);
}

function html_to_content($file) {
    $handle  = fopen($file, 'r');
    $content = fread($handle, filesize($file));
    fclose($handle);

    return $content;
}




//cookie and session
function process_setcookie() {
    setcookie("EMAIL_ADDRESS", $_SESSION[EMAIL_ADDRESS], time() + COOKIE_TIME_OUT);
    setcookie("FULL_NAME", $_SESSION[FULL_NAME], time() + COOKIE_TIME_OUT, '/', '');
    setcookie("USER_ID", $_SESSION[USER_ID], time() + COOKIE_TIME_OUT, '/', '');
    setcookie("PASSWORD", $_SESSION[PASSWORD], time() + COOKIE_TIME_OUT, '/', '');
    setcookie("IS_ADMIN", $_SESSION[IS_ADMIN], time() + COOKIE_TIME_OUT, '/', '');
}

function process_unsetcookie() 
{    
    setcookie("EMAIL_ADDRESS", '', time() - 3600, '/');
    setcookie("FULL_NAME", '', time() - 3600, '/');
    setcookie("USER_ID", '', time() - 3600, '/');
    setcookie("PASSWORD", '', time() - 3600, '/');
    setcookie("IS_ADMIN", '', time() - 3600, '/');
}

function process_setsession_fromcookie() {
    if (isset($_COOKIE["EMAIL_ADDRESS"]) && $_COOKIE["EMAIL_ADDRESS"] && !isset($_SESSION[EMAIL_ADDRESS]))
        $_SESSION[EMAIL_ADDRESS] = $_COOKIE["EMAIL_ADDRESS"];
    if (isset($_COOKIE["FULL_NAME"]) && $_COOKIE["FULL_NAME"] && !isset($_SESSION[FULL_NAME]))
        $_SESSION[FULL_NAME]     = $_COOKIE["FULL_NAME"];
    if (isset($_COOKIE["USER_ID"]) && $_COOKIE["USER_ID"] && !isset($_SESSION[USER_ID]))
        $_SESSION[USER_ID]       = $_COOKIE["USER_ID"];
    if (isset($_COOKIE["PASSWORD"]) && $_COOKIE["PASSWORD"] && !isset($_SESSION[PASSWORD]))
        $_SESSION[PASSWORD]      = $_COOKIE["PASSWORD"];
    if (isset($_COOKIE["IS_ADMIN"]) && $_COOKIE["IS_ADMIN"] && !isset($_SESSION[IS_ADMIN]))
        $_SESSION[IS_ADMIN]      = $_COOKIE["IS_ADMIN"];
}

function process_session_timeout() {
    if (isset($_SESSION[TIME_OUT_SESSION])) {
        $session_life = time() - $_SESSION[TIME_OUT_SESSION];
        if ($session_life > SESSION_TIME_OUT)
            redirect(link_to('user/logout'));
    }

    $_SESSION[TIME_OUT_SESSION] = time();
}

function parse_shortcodes($msg, $shortcodes) {
    if (is_array($shortcodes)) {
        foreach ($shortcodes as $code => $value)
            $msg = str_replace('{{' . $code . '}}', $value, $msg);
    }
    return $msg;
}



//upload file

function uploadfile() {
    if ($_FILES["attached_file"]["error"]) 
        return null;

    //upload file and save filename into DB   
    $file_name = date('Y-m-d H-i-s', time()) . '--' . $_FILES["attached_file"]["name"];

    if ($_FILES["attached_file"]["size"] <= MAX_FILE_SIZE_UPLOAD) {
        //upload file
        move_uploaded_file($_FILES["attached_file"]["tmp_name"], "uploads/attachment/" . $file_name);

        echo "<div class=\"notice success\"><span>Upload file successfully</span></div>";
        return $file_name;
    }

    echo "<div class=\"notice error\"><span><strong>Error:</strong>File size > " . MAX_FILE_SIZE_UPLOAD . "</span></div>";
    return null;
}




//issue action

function getMaxRootParentId(&$issue_hash, $parent_issue, $deep)
{
    $parent_issue_higher = isset($issue_hash[$parent_issue->getParentIssueId()]) ? $issue_hash[$parent_issue->getParentIssueId()] : null;
    
    if ($parent_issue_higher && $deep < 10)
        return getMaxRootParentId ($issue_hash, $parent_issue_higher, $deep + 1);
    
    return $parent_issue->getId();
}

function getLevel(&$issue_hash, $parent_issue, $deep)
{
    $parent_issue_higher = isset($issue_hash[$parent_issue->getParentIssueId()]) ? $issue_hash[$parent_issue->getParentIssueId()] : null;
    
    //gioi  han 10 de tranh truong hop issue parent xoay vong tron
    if ($parent_issue_higher && $deep < 10)
        return getLevel($issue_hash, $parent_issue_higher, $deep + 1);
    
    return $deep;
}

function UpdateOrderAndLevelOfAllIssue()
{
    $issues_list = IssuePeer::RetrieveAll();
    foreach ($issues_list as $issue)
        $issue_hash[$issue->getId()] = $issue;
    
    foreach ($issues_list as $issue)
    {
        $parent_issue = isset($issue_hash[$issue->getParentIssueId()]) ? $issue_hash[$issue->getParentIssueId()] : null;
        if (!$parent_issue)
        {
            $issue->setOrderId($issue->getId());
            $issue->setLevel(0);
        }
        else
        {
            $issue->setOrderId(getMaxRootparentId($issue_hash, $parent_issue, 0));
            $issue->setLevel(getLevel($issue_hash, $parent_issue, 0) + 1);
        }
        $issue->save();
    }
}

function UpdateChildIdsOfAllIssue()
{
    $issues_list = IssuePeer::RetrieveAll();
    foreach ($issues_list as $issue)
    {
        $issue_hash[$issue->getId()] = $issue;
        $issue->setChildIds("");
        $issue->save();
    }
    foreach ($issues_list as $issue)
    {
        $parent_issue = isset($issue_hash[$issue->getParentIssueId()]) ? $issue_hash[$issue->getParentIssueId()] : null;
        
        if (!$parent_issue) continue;
        
        $parent_child_ids_str = $parent_issue->getChildIds();
        if (!empty($parent_child_ids_str))
        {
            $child_ids = explode(',', $parent_child_ids_str);
            if(($key = array_search($issue->getId(), $child_ids)) === false) 
                $parent_issue->setChildIds($parent_child_ids_str  . ",". $issue->getId());
        }
        else 
            $parent_issue->setChildIds($issue->getId());

        $parent_issue->save();
    }
}

function TryUpdateChildIssues(&$issue_hash, $issue_id)
{
    $child_ids_str = $issue_hash[$issue_id]->getChildIds();
    if (!empty($child_ids_str))
    {
        $child_ids = explode(',', $child_ids_str);
        foreach ($child_ids as $child_id)
        {
            $issue_hash[$child_id]->setOrderId($issue_hash[$issue_id]->getOrderId());
            $issue_hash[$child_id]->setLevel($issue_hash[$issue_id]->getLevel() + 1);
            $issue_hash[$child_id]->save();
            TryUpdateChildIssues($issue_hash, $child_id);
        }
    }
}

function UpdateChildIssuesOfIssue($issue_id)
{
    $issue_hash = array();
    $issues_list = IssuePeer::RetrieveAll();
    foreach ($issues_list as $issue)
        $issue_hash[$issue->getId()] = $issue;
    TryUpdateChildIssues($issue_hash, $issue_id);
}

function UpdateOldParentIssueOfIssue($old_parent_issue_id, $issue_id)
{
    $old_parent_issue = null;
    if ($old_parent_issue_id)
        $old_parent_issue = IssuePeer::RetrieveById ($old_parent_issue_id);
    if (!$old_parent_issue) return;
    
    $child_ids = explode(',', $old_parent_issue->getChildIds());
    if(($key = array_search($issue_id, $child_ids)) !== false) 
        unset($child_ids[$key]);
    
    if (count($child_ids))
        $old_parent_issue->setChildIds(implode(',', $child_ids));
    else
        $old_parent_issue->setChildIds('');
    
    $old_parent_issue->save();
}

function UpdateParentIssueOfIssue($parent_issue, $issue_id)
{
    if (!$parent_issue) return;
    
    //ham explode bi loi khi explode mot chuoi rong van tra ve ket qua la mot mang voi 1 thanh phan la chuoi rong, khong phai null
    //khong the su dung empty voi goi ham, chi su dung cho bien, wtf
    $child_ids_str = $parent_issue->getChildIds();
    if (empty($child_ids_str))
        $parent_issue->setChildIds($issue_id);
    else
    {
        $child_ids = explode(',', $child_ids_str);
        if(($key = array_search($issue_id, $child_ids)) !== false) 
            return;
        $child_ids[count($child_ids)] = $issue_id;
        $parent_issue->setChildIds(implode(',', $child_ids));
    }
    
    $parent_issue->save();
}

?>