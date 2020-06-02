
<?php
global $module;
date_default_timezone_set("Asia/Bangkok");
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Issue & Project Tracking Site</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="google-site-verification" content="oNx9-OLYjTIVcKJJ9yJ6zVA8OSP8rO5ek5felKvjT2E" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Jigowatt PHP Login script">
        <meta name="author" content="Matt Gates | Jigowatt">

        <script type='text/javascript' src='<?php echo href_to('templates/js/jquery-1.6.2.min.js') ?>'></script>
        
        <link rel="stylesheet" href="<?php echo href_to('templates/quickadmin/bootstrap_quickadmin.css') ?>" type="text/css" media="screen" />
        <link rel="stylesheet" href="<?php echo href_to('templates/quickadmin/_layout/1140.css') ?>" type="text/css" media="screen" />
        <link rel="stylesheet" href="<?php echo href_to('templates/quickadmin/_layout/styles.css') ?>" type="text/css" media="screen" />
        <link rel='stylesheet' href='<?php echo href_to('templates/quickadmin/_themes/default.css') ?>' type='text/css' media='screen' />
        <link rel='stylesheet' href='<?php echo href_to('templates/quickadmin/font/font.css') ?>' type='text/css' />
        <link rel="shortcut icon" href="<?php echo href_to('templates/quickadmin/_layout/images/icons/ohtask_favicon.ico') ?>">
        
        <script>
            function new_window(link){ window.open(link,"OhTask","width=320,height=400,screenX=50,left=50,screenY=50,top=50,status=yes,menubar=yes"); }
        </script>
    </head>

    <body class="texture">

        <!-- Navigation================================================== -->
        <div id="header-wrapper" class="container">
            <div id="user-account" class="row" >
                <div class="threecol"> <span></span> </div>
                <div class="ninecol last"> 
                    <?php
                    if (isset($_SESSION[USER_ID]) && $_SESSION[USER_ID]) 
                    {
                    ?>
                        <a href="<?php echo link_to('user/logout') ?>">Logout</a> 
                        <span>|</span> 
                        <a href="<?php echo link_to('user/edit?id=' . $_SESSION[USER_ID]) ?>">My account</a> 
                        <span>|</span> 
                        <span>Welcome <strong><?php echo $_SESSION['FULL_NAME']; ?></strong></span>
                    <?php 
                    } 
                    ?>
                </div>
            </div>

            <!-- Main menu================================================== -->
            <div id="user-options" class="row">
                
                <!-- Logo ================================================== -->
                <div class="threecol">
                    <a href="<?php echo link_to('user/overview') ?>">
                        <img class="logo" src="<?php echo href_to('templates/quickadmin/_layout/images/ohtask_logo.png') ?>" />
                    </a>
                </div>
                
                
                <div class="ninecol last fixed">
                    
                    <ul class="nav-user-options">
                        <?php
                        if (isset($_SESSION[USER_ID]) && $_SESSION[USER_ID]) 
                        {
                            $totalUnreadNotification = NotificationsPeer::GetTotalNotYetRead($_SESSION[EMAIL_ADDRESS]);
                            ?> 
                            <li class="nav-user-options">
                                <a href="<?php echo link_to('notifications/list') ?>">
                                    <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/email.png') ?>" alt="Message" /> Message 
                                    <strong  id="<?php echo $totalUnreadNotification? "message_notification_number": "";  ?>" ><?php echo $totalUnreadNotification? $totalUnreadNotification : ""; ?> </strong>
                                </a>

                            </li>
                            
                        <!-- Menu My Issue -->
                             <li>
                               <a href="<?php echo link_to('issue/ListMyIssue') ?>">
                                            <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/report.png') ?>" alt="My Tasks" /> My Tasks
                               </a>
                            </li>
                        <!-- End Menu My Issue -->
                        
                            <li class="nav-user-options">
                                <a href="<?php echo link_to('project/list') ?>">
                                    <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/project_open.png') ?>" alt="Project" /> Project
                                </a>
                                <?php
                                if ($_SESSION[IS_ADMIN] == 1) 
                                {
                                    ?>
                                <ul>
                                    <li class="last first">
                                        <a href="<?php echo link_to('projectstatus/list') ?>">
                                            <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/blocks-gnome-netstatus-50-74.png') ?>" alt="Project Status" /> Project Status
                                        </a>
                                    </li>
                                    <li class="pin"></li>
                                </ul>
                                <?php
                                }
                                    ?>
                            </li>
                            
                            
                            <!--        Menu Issue          -->
                            <li class="nav-user-options">
                                <a href="<?php
                                    $_SESSION[FIRSTTIME] = true;
                                    echo link_to('issue/list')
                                        ?>">
                                    <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/stock_task.png') ?>" alt="Task" /> Task
                                </a>
                                <?php
                                if ($_SESSION[IS_ADMIN] == 1) 
                                {
                                    ?>
                                <ul>
                                    <li class="first" >
                                        <a href="<?php echo link_to('issuestatus/list') ?>">
                                            <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/blocks-gnome-netstatus-50-74.png') ?>" alt="Task Status" />&nbsp; Task Status
                                        </a>
                                    </li>
                                    <li class="last">
                                        <a href="<?php echo link_to('issuetype/list') ?>">
                                            <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/font_truetype.png') ?>" alt="Task Type" /> Task Type
                                        </a>
                                    </li>
                                    
                                    <li class="pin"></li>
                                </ul>
                                <?php
                                }
                                    ?>
                            </li>
                            
                            
                            <!--         Admin section          -->
                            <?php
                            if ($_SESSION[IS_ADMIN] == 1) 
                            {
                                ?>
                                <li class="nav-user-options">              
                                    <a href="<?php echo link_to('user/list') ?>">
                                        <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/preferences-contact-list.png') ?>" alt="Users" /> Users
                                    </a>
                                    <ul>
                                        <li class="first" >
                                            <a href="<?php echo link_to('role/list') ?>">
                                                <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/role.png') ?>" alt="Role" /> Role
                                            </a>
                                        </li>
                                        <li class="last" >
                                            <a href="<?php echo link_to('functions/list') ?>">
                                                <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/stock_show-draw-functions.png') ?>" alt="Function" /> Function
                                            </a>
                                        </li>
                                        <li class="pin"></li>
                                    </ul>
                                </li>
                            <?php 
                            } ?>
                            <!--         Admin section          -->
                            
                            
                <?php } ?>

                        <?php
                        if (!isset($_SESSION[USER_ID])) {
                            ?>
                            <li>
                                <a href="<?php echo link_to('user/overview') ?>">
                                    <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/overview.png') ?>" alt="Overview" /> Overview
                                </a>
                            </li>
                            <li>
                                <a href="<?php echo link_to('user/howtouse') ?>">
                                    <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/help_book.png') ?>" alt="How to use" /> Help
                                </a>
                            </li>
                            <li>
                                <a href="<?php echo link_to('user/login') ?>">
                                    <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/login.png') ?>" alt="Login" /> Log in
                                </a>
                            </li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
        </div>

        <!--  end Navigation
        ================================================== -->
        
        <div id="loadScreen">
            <div id="loadScr"></div>
            <div id="loader">
              <img src="<?php echo href_to('templates/quickadmin/_layout/images/icons/loadinfo.net.gif') ?>" alt="Loading" />
            </div>
         </div>
        
        <div class="row">
            <div class="span10">