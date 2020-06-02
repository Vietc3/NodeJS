<?php
/*
require_once 'libs/swiftmailer/swift_required.php';

$transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, "ssl")
  ->setUsername('sion.vn@gmail.com')
  ->setPassword('Easytech!007@gm');

$mailer = Swift_Mailer::newInstance($transport);

$message = Swift_Message::newInstance('Test Subject')
  ->setFrom(array('sion.vn@gmail.com' => 'ABC'))
  ->setTo(array('tiennguyen.aitt@gmail.com'))
  ->setBody('This is a test mail.');

$result = $mailer->send($message);

*/


require_once('libs/phpmailer/class.phpmailer.php');
    //include("class.smtp.php"); // optional, gets called from within class.phpmailer.php if not already loaded
    //date_default_timezone_set('America/Toronto');
    $mail = new PHPMailer();
    $mail->IsSMTP(); // telling the class to use SMTP
    $mail->SMTPDebug = 1;                     // enables SMTP debug information (for testing)
    $mail->SMTPSecure = 'ssl';                                       
	// 1 = errors and messages
    // 2 = messages only
    $mail->SMTPAuth = true;                  // enable SMTP authentication
    $mail->Host = 'smtp.gmail.com'; // sets the SMTP server
    $mail->Port = '465';                    // set the SMTP port for the GMAIL server
    $mail->Username = 'support@aitt.vn'; // SMTP account username
    $mail->Password = 'Aitt!6688@gm';        // SMTP account password
    $mail->CharSet='UTF-8';
    $mail->SMTPSecure = 'ssl';
	$mail->IsHTML(true);
	$mail->SetFrom("support@aitt.vn");

    $mail->Subject = "Test";
    //$mail->AltBody    = $msg; // optional, comment out and test
    $mail->MsgHTML("Nguyen van tien");
    $mail->AddAddress("sion.vn@gmail.com", "");
    //$mail->AddAttachment("images/phpmailer.gif");      // attachment
    //$mail->AddAttachment("images/phpmailer_mini.gif"); // attachment
    if (!$mail->Send()) {
        echo "Mailer Error: " . $mail->ErrorInfo;
        return false;
    } else {
		echo "OK";
        return true;
    }
	
	?>