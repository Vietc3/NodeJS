<?php
?>
<style>
    .box-item {
        display: inline-block;
        padding: 0px 20px 20px;
    }

    .hcontent {
        border-bottom: 1px solid #D5D5D5;
        display: inline-block;
        padding-bottom: 20px;
    }

    .htitle {
        font-size: 16px;
        font-weight: bold;
        margin-top: 35px;
    }

    .hleft {
        float:left;
        width: 30%;
        margin-right: 75px;
    }

    .hleft p {
        font-size:15px;
        width:425px;
    }

    .hright {
        float:right;
        width: auto;
    }
</style>
<div class="row" >
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php _e('How to use'); ?></h4>
            </div>
            <div class="content">
                <form class="form-horizontal" method="post" action="<?php echo link_to('user/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <fieldset>
                        <div class="content">
                            <div class="box-item">
                                <div class="hcontent">
                                    <div class="hleft">
                                        <p><span class="htitle">Create or Edit a Project</span></p>
                                        <p>Please click the Project menu link to go to the Project List screen.</p>
                                        <p>Click the New Project button to create a new project</p>
                                        <p>You will redirect to the Create Project screen which you can input the information of your project such as Project Name, Desciption, Status, Start date, End date</p>
                                        <p>After creating the project, you will redirect back to this list project screen again. In this screen, please choose a Project row and click the Edit Project button.</p>
                                        <p>The Edit Project screen is the same as the Create Project screen.</p>
                                    </div> 
                                    <div class="hright"> <iframe width="560" height="315" src="http://www.youtube.com/embed/ZZYNkKUDh4w" frameborder="0" allowfullscreen></iframe> </div>
                                </div>
                            </div>
                            <div class="box-item">
                                <div class="hcontent">
                                    <div class="hleft">
                                        <p><span class="htitle">Create or Edit an Issue</span></p>
                                        <p>Please click the Issue menu link to go to the Issue List screen. There will be no available issue now.</p>
                                        <p>You can only go to this page after you have already had one or more available project.</p>
                                        <p>Click the New Issue button to create a new issue</p>
                                        <p>You will redirect to the Create Issue screen which you can input the information of the project issue such as Issue Name, Desciption, Type, Start date, End date, ...</p>
                                        <p>After creating the issue, you will redirect back to this list issue screen again. In this screen, please choose an Issue row and click the Edit Issue button.</p>
                                        <p>The Edit Issue screen is the same as the Create Issue screen.</p>
                                        <p><b>Notice</b>: Only the user has right to Edit the project can do this. This is the assign role part of the user has administrator right.</p>
                                        <p>The Email System will automatically send to the one who is assigned to do this issue and also all the watchers who are relavant to this issue.</p>
                                    </div> 
                                    <div class="hright"> <iframe width="560" height="315" src="http://www.youtube.com/embed/G83m3ehymbU" frameborder="0" allowfullscreen></iframe> </div>
                                </div>
                            </div>
                            <div class="box-item">
                                <div class="hcontent">
                                    <div class="hleft">
                                        <p><span class="htitle">Update an Issue</span></p>
                                        <p>Please choose an issue and click the Update Issue button to update the issue.</p>
                                        <p>The Update Issue page will be the same as the Edit Issue screen but it only has some important field for the user who is assigned to do this update it.</p>
                                        <p>There's also the Comment field for him/her to write down what he/she wants to reply.</p>
                                        <p>The Email System will also automatically send to the one who is assigned to do this issue and also all the watchers who are relavant to this issue.</p>
                                    </div> 
                                    <div class="hright"> <iframe width="560" height="315" src="http://www.youtube.com/embed/zf0WIlIxbiE" frameborder="0" allowfullscreen></iframe> </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
            </div>
            </form>
        </div>
    </div>
</div>
</div>