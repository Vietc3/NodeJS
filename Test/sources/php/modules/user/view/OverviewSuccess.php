<link href='<?php echo href_to('templates/slide/bx_styles/bx_styles.css') ?>' rel='stylesheet' type='text/css' />
<script type='text/javascript' src='<?php echo href_to('templates/slide/jquery.bxSlider.min.js') ?>'></script>
<script type='text/javascript' src='<?php echo href_to('templates/slide/jquery.easing.1.3.js') ?>'></script>
<script type="text/javascript">
    $(document).ready(function(){
        $('#overview').bxSlider({
            auto:true,
            easing: 'easeInQuad'
        });
        $(".notice").fadeOut(5000);
    });
</script>
<style>
    .box-item {
        display: inline-block;
        width: 1010px !important;
        padding-right: 1000px;
    }
    
    .bx-child {
        width: 1010px !important;
    }
    
    .bx-window {
        width: 1010px !important;
        margin-left: 35px;
    }
    
    .bx-wrapper {
        width: 1000px !important;
    }

    .hcontent {
        display: inline-block;
    }

    .htitle {
        font-size: 16px;
        font-weight: bold;
        margin-top: 35px;
    }

    .hleft {
        float:left;
        width: 50%;
        margin-right: 30px;
    }

    .hleft p {
        font-size:15px;
        width:517px;
        text-align: justify;
    }

    .hright {
        float:right;
        width: 462px;
    }
    
    .none {
        background: none !important;
        border: none !important;
    }
    a:focus {
        outline: none;
    }
</style>
<div class="row">
    <div class="panel-wrapper">
        <div class="panel">
            <div class="title">
                <h4><?php _e('Overview'); ?></h4>
            </div>
            <div class="content">
                <form class="form-horizontal" method="post" action="<?php echo link_to('user/edit'); ?>" id ="edit-user-form" enctype="multipart/form-data" >
                    <fieldset>
                        <div class="content" id="overview">
                            <div class="box-item">
                                <div class="hcontent">
                                    <div class="hleft">
                                        <p><span class="htitle">OhTask projects management keeps everything together</span></p>
                                        <p>With an entire project on one page, nothing gets lost and your team always knows where things are</p>
                                        <p>No matter how many projects you have, or how many people you have working on them, OhTask keeps everything organized.</p>
                                    </div> 
                                    <div class="hright"> <img width="462px" height="auto" alt="" src="<?php echo href_to('media/images/overview-01.png') ?>"> </div>
                                </div>
                            </div>
                            <div class="box-item">
                                <div class="hcontent">
                                    <div class="hleft">
                                        <p><span class="htitle">Easy to manage your projects will all the issues</span></p>
                                        <p>With the list of issues in project, you can keep track up everything happening with it. All the types are marked by the color defined.</p>
                                    </div> 
                                    <div class="hright"> <img width="462px" height="auto" alt="" src="<?php echo href_to('media/images/overview-02.png') ?>"> </div>
                                </div>
                            </div>
                            <div class="box-item">
                                <div class="hcontent">
                                    <div class="hleft">
                                        <p><span class="htitle">Assign the people in charge, the list of Watchers</span></p>
                                        <p>The Create / Edit issue screen is clear and friendly. It's very easy for you to know how to use it. You can choose what user is assigned for this and who are the Watchers.</p>
                                    </div> 
                                    <div class="hright"> <img width="462px" height="auto" alt="" src="<?php echo href_to('media/images/overview-03.png') ?>"> </div>
                                </div>
                            </div>
                            <div class="box-item">
                                <div class="hcontent">
                                    <div class="hleft">
                                        <p><span class="htitle">Smart Email Notification System</span></p>
                                        <p>The Email System will automatically send to the one who is assigned to do this issue and also all the watchers who are relavant to the issue.</p>
                                        <p>Anything happens to the issue will be sent to you for your watching! So you will always keep track up everything.</p>
                                    </div> 
                                    <div class="hright"> <img width="462px" height="auto" alt="" src="<?php echo href_to('media/images/overview-04.png') ?>"> </div>
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