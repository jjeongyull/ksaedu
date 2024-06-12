<?php

  include_once 'server/config.php';
  include_once "server/function.php";

  $data = "jhshin@additcorp.com";

  $cryptdata = _crypt($data);

  echo $cryptdata;

  $cryptdata = _crypt($cryptdata, 'd');

  echo $cryptdata;

?>