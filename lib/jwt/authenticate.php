<?php

  // 엄격하게 스칼라 타입 검사
  declare(strict_types=1);
  
  require_once "function.php";

  //echo http_response_code(505) ;
  //die();

  // JWT 클래스 선언
  use Firebase\JWT\JWT;
  require_once('vendor/autoload.php');

  // Validate the credentials in the database, or in other data store.
  // For the purposes of this application, we'll consider that the credentials are valid.
  $hasValidCredentials = true;

  // extract credentials from the request
  if ($hasValidCredentials) {
    $secret_Key  = 'greenpot_key';                                        // 토큰 비밀 키
    // $date   = new DateTimeImmutable();
    $issuedat_claim = time();                                             // 토큰 생성 시간
    //$expire_claim     = $date->modify('+6 minutes')->getTimestamp();    // 토큰 만료 시간 
    $expire_claim = $issuedat_claim + 60;                                 // 토큰 만료 시간, 60초 이후 만료
    $notbefore_claim = $issuedat_claim;                              // 토큰 활성화 시간
    $issuer_claim = "http://additdev.iptime.org:8000";                    // 토큰 관련 도메인 (보통 서버 주소)

    // Create the token as an array
    $request_data = [
        //'iat'  => $date->getTimestamp(),        // 
        'iat' => $issuedat_claim,                 // 토큰 생성 시간
        'iss' => $issuer_claim,                   // 토큰 생성자 
        'nbf' => $notbefore_claim,                // 해당 시간 이후에 토큰이 활성화 됨
        'exp' => $expire_claim,                   // 토큰 만료 시간
        'data' => array(                          // 임의의 데이터 값 (POST 전달값 등을 입력/값 전송을 확인하기 위해)
          "userid" => "jhshin",
          "username" => "신종훈"          
        )
    ];

    // Encode the array to a JWT string.
    echo JWT::encode(
        $request_data,      //Data to be encoded in the JWT
        $secret_Key, // The signing key
        'HS512'     // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
    );
}
?>
