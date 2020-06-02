<?php

function sendEmail($to, $subj, $msg, $shortcodes = null, $from = null, $project_id = null, $issue_id = null) {

    $msg = parse_shortcodes($msg, $shortcodes);
    $msg = '<body style="margin: 10px;">
        <div style="width: 640px; font-family: Arial, Helvetica, sans-serif; font-size: 13px;">
        <div>' . $msg . '</div></body>';

    require_once('libs/phpmailer/class.phpmailer.php');
    //include("class.smtp.php"); // optional, gets called from within class.phpmailer.php if not already loaded
    //date_default_timezone_set('America/Toronto');
    $mail = new PHPMailer();
    $mail->IsSMTP(); // telling the class to use SMTP
    $mail->SMTPDebug = 0;                     
	// enables SMTP debug information (for testing)
	// 1 = errors and messages
    // 2 = messages only
    $mail->SMTPSecure = 'ssl';                                       	
    $mail->SMTPAuth = true;                  // enable SMTP authentication
    $mail->Host = MAIL_HOST; // sets the SMTP server
    $mail->Port = MAIL_PORT;                    // set the SMTP port for the GMAIL server
    $mail->Username = MAIL_USERNAME; // SMTP account username
    $mail->Password = MAIL_PASSWORD;        // SMTP account password
    $mail->CharSet='UTF-8';
	$mail->IsHTML(true);

    if ($from != null) {
        $mail->SetFrom($from);
        $mail->AddReplyTo($from);
    } else {
        $mail->SetFrom(MAIL_USERNAME, 'OhTask Notification');
        $mail->AddReplyTo(MAIL_USERNAME, "OhTask Notification");
    }

    $mail->Subject = $subj;
    //$mail->AltBody    = $msg; // optional, comment out and test
    $mail->MsgHTML($msg);
    $mail->AddAddress($to, "");
    //$mail->AddAttachment("images/phpmailer.gif");      // attachment
    //$mail->AddAttachment("images/phpmailer_mini.gif"); // attachment
    if (!$mail->Send()) {
        //echo "Mailer Error: " . $mail->ErrorInfo;
        return false;
    } else {
        $notifications = new Notifications();
        $notifications->setEmailAddress($to);
        $notifications->setContent($msg);
        $notifications->setSubject($subj);
        $notifications->setProjectId($project_id);
        $notifications->setIssueId($issue_id);
        $notifications->setIsRead(0);
        $notifications->setIsVisible(1);
        $notifications->save();
        return true;
    }
}

?>
