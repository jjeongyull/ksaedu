<?php
  //error_reporting(0);
  // 실배포 시 
  error_reporting(E_ALL);

  // define(constant_name, value, case_insensitive)
  // php8 > 이상에서는 더이상 사용되지 않는다.
  // case_insensitive가 true일 경우 대소문자 구분 없음
  //define("TOKEN_KEY", "68V0zWFrS72GbpPreidkQFLfj4v9m3Ti+DXc8OB0gcM=");
  // 토큰키를 랜덤하게 신규 생성 (32자리 이상 생성, 48자리로 생성)

  define("SERVER_URL", "http://additdev.iptime.org:8000");
  define("TOKEN_ALG", 'HS256');

  // 암복호화 관련 Key, iv
  $key = pack("H*", "4a0c605da26c413f0304188615da9139");
  $iv =  pack("H*", "3c4909a6557fc2b9855351afaca45e54");

  $token_key = "";
?>