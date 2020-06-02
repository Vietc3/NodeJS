<?php
echo Session::get(SESSION_MESSAGE);
Session::destroy(SESSION_MESSAGE);
?>
<link href="<?php echo href_to('templates/css/recurly.css') ?>" rel="stylesheet">
<script src="<?php echo href_to('templates/js/recurly.js') ?>"></script>
<script>
   Recurly.config({
      subdomain: 'sndmobile',
      currency: 'USD',
      country: 'US'
   });
   function check(){
      if(document.getElementById("mail_user").value != document.getElementById("verify_mail_user").value){
         document.getElementById("verify_error").style.display = "block";                 
         document.getElementById("verify_error").innerHTML = "Confirm email wrong";   
         return false;
      }else{
         var checkmail = '<?php echo link_to('ajax/checkvalidemail') ?>';       
         data = 'email='+ document.getElementById("mail_user").value ;
         var result = $.ajax({                                         
            type: 'POST',                 
            url: checkmail,           
            data: data,                 
            async: false      
         }).responseText;    
            
         if(result == '0'){
            document.getElementById("verify_error").style.display = "block";  
            document.getElementById("verify_error").innerHTML = "Email existed.";
            return false;
         }else{
            document.getElementById("verify_error").style.display = "none"; 
            document.getElementById("tos_check").checked = true;
         }
      }
   }
</script> 
<div class="span10"> 
   <form id="free-signup-user-form" action="<?php echo link_to('user/signup'); ?>" method="post">
      <div class="control-group" id="validate_email">
         <label class="control-label">Email</label>
         <div class="controls" >
            <input type="text" class="input-xlarge" name="email" id="email">
         </div>
         <span class="error" id="error">
         </span>
      </div>
      <div class="control-group">
         <label class="control-label">Full Name</label>
         <div class="controls" >
            <input type="text" class="input-xlarge" name="fullname" id="fullname">
         </div>
      </div>
      <div class="control-group">
         <label class="control-label">Password</label>
         <div class="controls" >
            <input type="password" class="input-xlarge" name="password" id="password">
         </div>
      </div>
      <div class="control-group">
         <label class="control-label">Re-Password</label>
         <div class="controls" >
            <input type="password" class="input-xlarge" name="repassword" id="repassword">
         </div>
      </div>
      <div >
         <button type="submit" class="button-blue" >Register</button>
         <button class="button-white">Cancel</button>
      </div>
   </form>
</div>
