<?php
function DoBackpage()
{
    redirect($_SERVER['HTTP_REFERER']);
}
?>