<?php

  include_once 'config.php';

  // Firebase-JWT 모듈 로딩
  include_once('vendor/autoload.php'); 
  use \Firebase\JWT\JWT;

  // axio에서 전달된 파라미터를 못받을 수 있으므로 헤드 정보 추가 (필요한지는 다시 한번 확인이 필요함)
  header("Access-Control-Allow-Origin: * ");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  // vue POST 파라미터를 전달 받기 위해 
  $request_body = file_get_contents('php://input');
  $data = json_decode($request_body, true);

  $user_id = trim(isset($data["user_id"]) ? $data["user_id"] : "");


  if ($user_id != ""){
    
    // JWT 관련 설정
    $secret_key = TOKEN_KEY;
    $issuer_claim = SERVER_URL;            // 토큰 사용 서버(일반적으로 서버 URL을 입력)
    $audience_claim = "userlogin";                                // 토큰 사용처
    $issuedat_claim = time();                                     // 토큰 생성 시간
    $notbefore_claim = $issuedat_claim;                           // 즉시 토큰 활성화
    $expire_claim = $issuedat_claim + 10;                         // 토큰 만료 시간 (60초, 1분) 

    $token = array(
      "iss" => $issuer_claim,
      "aud" => $audience_claim,
      "iat" => $issuedat_claim,
      "nbf" => $notbefore_claim,
      "exp" => $expire_claim,
      "data" => array(
          "mem_id" => $mem_id,
          "mem_name" => $mem_name,
          "mem_level" => $mem_level,
          "cmd"=>$cmd
      )
    );  
    http_response_code(200);

    // JWT 생성
    $jwt = JWT::encode($token, $secret_key, TOKEN_ALG);
    echo json_encode(
      array(
          "access_token" => $jwt,
          "user_id" => $user_id,
      ));
  }
  else{
    http_response_code(401) ;
  }
?>