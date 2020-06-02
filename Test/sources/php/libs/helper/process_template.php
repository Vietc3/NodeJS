<?php

function email_password_recovery($email, $newPassword)
{
    $subject    = "Password Recovery";
    $message    = html_to_content('templates/xml/passwordrecovery.html');
    $shortcodes = array(
        'newpassword' => $newPassword
    );

    if (sendEmail($email, $subject, $message, $shortcodes))
        Session::set(SESSION_MESSAGE, "<div class=\"notice info \"><span><strong>Information:</strong>" .
                _('We have just sent you a new password. Please check your email.') .
                "</span></div>");
    else
        Session::set(SESSION_MESSAGE, "<div class=\"notice error \"><span><strong>Error:</strong>" .
                _(' Mail not sent') .
                "</span></div>");
}

function email_signup($email, $newPassword, $link)
{
    $subject    = "Activate your account at OhTask";
    $message    = html_to_content('templates/xml/signup.html');
    $shortcodes = array(
        'newpassword' => $newPassword,
        'link'        => $link
    );
    sendEmail($email, $subject, $message, $shortcodes);
}

function email_create_user($email, $name, $password)
{
    $subject    = "New User";
    $message    = html_to_content('templates/xml/createuser.html');
    $shortcodes = array(
        'password' => $password,
        'fullname' => $name,
        'email'    => $email
    );
    sendEmail($email, $subject, $message, $shortcodes);
}

function parse_template($content, $shortcodes)
{
    while (true)
    {
        $pos                 = strpos($content, "{{IF_ISSET_STATEMENT}}");
        if ($pos === FALSE)
            return $content;
        $pos_end_of_variable = strpos($content, "}}", $pos + strlen("{{IF_ISSET_STATEMENT}}"));
        if ($pos_end_of_variable === FALSE)
            return $content;

        $variable_name = substr($content, $pos + strlen("{{IF_ISSET_STATEMENT}}") + 2, $pos_end_of_variable - $pos - strlen("{{IF_ISSET_STATEMENT}}") - 2);

        $pos_end = strpos($content, "{{END_STATEMENT}}", $pos);
        if ($pos_end === FALSE)
            return $content;

        $content1 = substr($content, 0, $pos);
        $content2 = substr($content, $pos_end + strlen("{{END_STATEMENT}}"));

        if (isset($shortcodes[$variable_name]) &&  $shortcodes[$variable_name] != NULL)
        {
            $strIfclause = substr($content, $pos_end_of_variable + 2, $pos_end - $pos_end_of_variable - 2);
            $content1.= $strIfclause;
        }
        $content     = $content1 . $content2;
    }
    return $content;
}

function email_change_user($email, $name)
{
    $subject = "Change User Information";
    $message = html_to_content('templates/xml/changeuser.html');

    $shortcodes = array(
        'fullname' => $name,
        'email'    => $email
    );
    $message   = parse_template($message, $shortcodes);
    sendEmail($email, $subject, $message, $shortcodes);
}

function email_create_project($email, $project_id, $creator, $project_name, $status_name, $start_date, $end_date, $description)
{
    $subject    = "[Project - $status_name] $project_name";
    $message    = html_to_content('templates/xml/projectcreate.html');
    $shortcodes = array(
        'link'         => link_to("project/view?id=" . $project_id),
        'creator'      => $creator,
        'project_name' => $project_name,
        'status_name'  => $status_name,
        'start_date'   => $start_date,
        'end_date'     => $end_date,
        'description'  => $description
    );
    sendEmail($email, $subject, $message, $shortcodes, null, $project_id);
}

function email_create_issue($email, $issue_id, $code, $creator, $type_name, $issue_name, $status_name, $priority, $start_date, $end_date, $assignee, $description, $project_id, $project_name)
{
    $subject    = "[$type_name #$code - $status_name] $issue_name";
    $message    = html_to_content('templates/xml/issuecreate.html');
    $shortcodes = array(
        'link'         => link_to("issue/view?id=" . $issue_id),
        'code'         => $code,
        'creator'      => $creator,
        'type_name'    => $type_name,
        'issue_name'   => $issue_name,
        'status_name'  => $status_name,
        'priority'     => $priority,
        'start_date'   => $start_date,
        'end_date'     => $end_date,
        'assignee'     => $assignee,
        'description'  => $description,
        'project_link' => $project_link,
        'project_name' => $project_name
    );
    sendEmail($email, $subject, $message, $shortcodes, null, $project_id, $issue_id);
}

function email_update_issue($email, $issue_id, $code, $modifier, $type_name, $issue_name, $status_name, $comment, $result, $project_id, $project_name)
{
    $subject    = "[$type_name #$code - $status_name] $issue_name";
    $message    = html_to_content('templates/xml/issueupdate.html');
    $shortcodes = array(
        'link'         => link_to("issue/view?id=" . $issue_id),
        'issue_name'   => $issue_name,
        'code'         => $code,
        'modifier'     => $modifier,
        'type_name'    => $type_name,
        'project_link' => link_to("project/view?id=" . $project_id),
        'project_name' => $project_name,
        'comment' => $comment
    );
    $shortcodes    = array_merge($shortcodes, $result);
    $message       = parse_template($message, $shortcodes);
    sendEmail($email, $subject, $message, $shortcodes, null, $project_id, $issue_id);
}
?>
