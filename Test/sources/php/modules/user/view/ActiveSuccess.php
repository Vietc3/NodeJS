<?php
?>
<div class="row-fluid">
   <div class="span12">
      <?php echo Session::get(SESSION_MESSAGE);
      Session::destroy(SESSION_MESSAGE); ?>
   </div>
</div>