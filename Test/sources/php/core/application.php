<?php
include_once('config.php');
include_once('core/app/constants.php');
include_once('core/app/session.php');
include_once('core/app/app_config.php');
include_once('core/app/application_helper.php');
include_once('core/app/class.controller.php');

Session::start();

//send ouput to buffer
ob_start();

process_session_timeout();

if (!Database::connect())
    echo Database::getErrorMessage();
else
{
    retrieveModuleAction();
    
    loadModels();

    if (!isOnlyOutputContent())
        include_once('templates/header.php');
    
    if (isHasPermission())
    {
        loadController();
        
    } else
        echo PERMISSION_MESSAGE;

    if (!isOnlyOutputContent())
        include_once('templates/footer.php');
}

//print output to screen
ob_end_flush();
?>
