<?php
  //error_reporting(0);
  // 실배포 시 
  error_reporting(E_ALL);
  ini_set( "display_errors", 1 );
  
  // define(constant_name, value, case_insensitive)
  // php8 > 이상에서는 더이상 사용되지 않는다.
  // case_insensitive가 true일 경우 대소문자 구분 없음
  //define("TOKEN_KEY", "68V0zWFrS72GbpPreidkQFLfj4v9m3Ti+DXc8OB0gcM=");
  // 토큰키를 랜덤하게 신규 생성 (32자리 이상 생성, 48자리로 생성)

  // http를 붙이면 안된다.
  define("SERVER_URL", "https://www.ks-edu.kr/");
  define("DOMAIN", "www.ks-edu.kr");

  // 토큰 알고리즘
  define("TOKEN_ALG", 'HS256');
  // refresh 토큰 길이
  define("TOKEN_LENGTH", 48);
  // Refresh Token 시간(초단위)
  define("REFRESH_TIME", 172800); // 24시간
  define("ACCESS_TIME", 300);   // 5분

  // 암복호화 알고리즘 (aes-128-cbc, aes-256-cbc, aria-256-cbc ....)
  // https://www.php.net/manual/en/function.openssl-get-cipher-methods.php
  define("CRYPT_ALG", "AES-128-CBC");  
  // 암호화 Key, iv
  define('SECRET_KEY', "4a0c605da26c413f0304188615da9139");
  define('SECRET_IV', "3c4909a6557fc2b9855351afaca45e54");

  
  // 토큰키를 변경
  define("TOKEN_KEY", "ba0daa7a2c1e9668abe52add679078bf094c061f524b0ef7");

  define("DEBUG_MODE", true);

  // 데이터베이스 연결 설정
  define("DB_SERVER_NAME", "localhost");
  define("DB_USER_NAME", "ksaedu");
  define("DB_USER_PASSWORD", "zEu!t@ljuAyR&6?RC7s9d");
  define("DB_NAME", "ksaedu");
  define("DB_PORT", "3306");

  // 메일 전송 설정 (메일 계정 및 비밀번호 변경 필요)
  define("SMTP_SERVER", "smtp.naver.com");
  define("FROM_MAIL", "additsnsman@naver.com");
  define("FROM_NAME", "한국표준협회 관리자");
  define("FROM_MAIL_PASS", "!additsnsman#");
  define("SMTP_PORT", 465);

  // 테이블 정보
  // 학습 시간
  define("TBL_CLASS_TIME", "class_time");
  // 교육 과정 기본 정보(교육과정명 등)
  define("TBL_CLASS_NAME", "class_name");
  // 교육 과정 신청 정보
  define("TBL_SUSB_CALSS", "subs_class");
  // 관리자 정보
  define("TBL_MANAGER", "manager");

  define("bDebug", TRUE);
?>