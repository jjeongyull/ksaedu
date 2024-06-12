<?php
// 설치 : composer require firebase/php-jwt
 
declare(strict_types=1);

require_once('../lib/jwt/autoload.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/* 토큰 발행
   $secret_key : 토큰 키
   $algorithm : 알고리즘
   $domain : 발급 도메인
   $time : 유효 시간
   return : array("token"=>"", "exp"=>"")
*/
function genToken($secret_key, $algorithm, $domain, $time, 
            $mem_id, $mem_name, $mem_level){

  try{
    $token_subject = "subject";
    $issuer_claim = $domain;                          // 토큰 사용 서버(일반적으로 서버 URL을 입력), 
    $audience_claim = "intialize token";              // 토큰 사용처
    $issuedat_claim = time();                         // 토큰 생성 시간 1970년 1월 1일 0시 0분 0초부터 세기 시작한 시간을 의미
    $notbefore_claim = $issuedat_claim;               // 즉시 토큰 활성화
    $expire_claim = $issuedat_claim +  $time;         // 토큰 만료 시간 초단위, 일반적 5분, 리프레시 토큰은 24시간

    $access_token = array(                            // (Registered Claim)
      "iss" => $issuer_claim,                         // 토큰 발급자
      "aud" => $audience_claim,                       // 토큰 대상자
      "iat" => $issuedat_claim,                       // 토큰 발급 시각, Numeric Data 형식
      "nbf" => $notbefore_claim,                      // 토큰 활성화 시각, Numeric Data 형식, 해당 시각전에는 토근이 유효하지 않음.
      "exp" => $expire_claim,                         // 토큰 만료 시각, Numeric Data 형식
      "sub" => $token_subject,                        // 토큰 제목  
      "data" => array(
          "manager_id" => $mem_id,
          "manager_name" => $mem_name,
          "mem_level" => $mem_level,
      )
    ); 

    // JWT 생성
    $jwt_token = JWT::encode($access_token, $secret_key, $algorithm);
    //$dateDifference  = abs($refresh_expire_claim - $expire_claim);
    //$years  = floor($dateDifference / (365 * 60 * 60 * 24));
    //$months = floor(($dateDifference - $years * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
    //$days   = floor(($dateDifference - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 *24) / (60 * 60 * 24));
    //$exp_period = $days;

    // return json_encode(
    //   array(
    //       "token" => $jwt_token,
    //       "exp" => $expire_claim,
    //   ), JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT
    // );
    return json_encode(array(
          "token" => $jwt_token,
          "exp" => $expire_claim,
    ), JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);

  }
  catch(Exception $e)
  {
    return $e->getMessage(); 
  }
}

/*
function decode_error_desc($code){
  $rtnValue = "";
  switch ($code){
    case 400 : $rtnValue = '토큰키가 존재하지 않습니다.'; break;
    case 401 : $rtnValue = '형식이 올바르지 않습니다.(.)'; break;
    case 402 : $rtnValue = '헤더가 올바르지 않습니다.'; break;
    case 403 : $rtnValue = '페이로더가 올바르지 않습니다.'; break;
    case 404 : $rtnValue = '시그너처가 올바르지 않습니다.'; break;
    case 405 : $rtnValue = '알고르즘이 지정되지 않았습니다.'; break;
    case 406 : $rtnValue = '지원되지 않는 알고리즘입니다.'; break;
    case 407 : $rtnValue = '지원되지 않는 알고리즘입니다.'; break;
    case 408 : $rtnValue = '"kid" invalid, unable to lookup correct key'; break;
    case 409 : $rtnValue = '"kid" empty, unable to lookup correct key'; break;
    case 410 : $rtnValue = '시그너처 검증 실패'; break;
    case 411 : $rtnValue = '타임 라인 오류(nbf) '; break;
    case 412 : $rtnValue = '타임 라인 오류(iat) '; break;
    case 413 : $rtnValue = '타임 라인 오류(exp)'; break;
    case 414 : $rtnValue = "OpenSSL unable to sign data"; break;
    case 415 : $rtnValue = 'Null result with non-null input'; break;
    case 416 : $rtnValue = 'libsodium is not available'; break;
    case 417 : $rtnValue = 'unkwon error'; break;
    case 418 : $rtnValue = 'Maximum stack depth exceeded'; break;
    case 419 : $rtnValue = 'Invalid or malformed JSON'; break;
    case 420 : $rtnValue = 'Unexpected control character found'; break;
    case 421 : $rtnValue = 'Syntax error, malformed JSON'; break;
    case 422 : $rtnValue = 'Malformed UTF-8 characters'; break;
  }
  return $rtnValue;
}

// http_response_code 
if (!function_exists('http_response_code')) {
  function http_response_code($code = NULL) {
    if ($code !== NULL) {
        switch ($code) {
            case 100: $text = 'Continue'; break;
            case 101: $text = 'Switching Protocols'; break;
            case 200: $text = 'OK'; break;
            case 201: $text = 'Created'; break;
            case 202: $text = 'Accepted'; break;
            case 203: $text = 'Non-Authoritative Information'; break;
            case 204: $text = 'No Content'; break;
            case 205: $text = 'Reset Content'; break;
            case 206: $text = 'Partial Content'; break;
            case 300: $text = 'Multiple Choices'; break;
            case 301: $text = 'Moved Permanently'; break;
            case 302: $text = 'Moved Temporarily'; break;
            case 303: $text = 'See Other'; break;
            case 304: $text = 'Not Modified'; break;
            case 305: $text = 'Use Proxy'; break;
            case 400: $text = 'Bad Request'; break;
            case 401: $text = 'Unauthorized'; break;
            case 402: $text = 'Payment Required'; break;
            case 403: $text = 'Forbidden'; break;
            case 404: $text = 'Not Found'; break;
            case 405: $text = 'Method Not Allowed'; break;
            case 406: $text = 'Not Acceptable'; break;
            case 407: $text = 'Proxy Authentication Required'; break;
            case 408: $text = 'Request Time-out'; break;
            case 409: $text = 'Conflict'; break;
            case 410: $text = 'Gone'; break;
            case 411: $text = 'Length Required'; break;
            case 412: $text = 'Precondition Failed'; break;
            case 413: $text = 'Request Entity Too Large'; break;
            case 414: $text = 'Request-URI Too Large'; break;
            case 415: $text = 'Unsupported Media Type'; break;
            case 500: $text = 'Internal Server Error'; break;
            case 501: $text = 'Not Implemented'; break;
            case 502: $text = 'Bad Gateway'; break;
            case 503: $text = 'Service Unavailable'; break;
            case 504: $text = 'Gateway Time-out'; break;
            case 505: $text = 'HTTP Version not supported'; break;
            default:
                exit('Unknown http status code "' . htmlentities($code) . '"');
            break;
        }

        $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');

        header($protocol . ' ' . $code . ' ' . $text);

        $GLOBALS['http_response_code'] = $code;

    } else {
        $code = (isset($GLOBALS['http_response_code']) ? $GLOBALS['http_response_code'] : 200);
    }
    return $code;
    }
}
*/

/* @token validation 체크
  $jwt : JWT 토큰
  $algorithm : 알고리즘
  $domain : 도메인
  $token_key : 토큰 키
  result : 성공하면 토큰으로부터 구해진 데이터 정보 배열 리턴
*/
function ValidateToken($jwt, $algorithm, $domain, $token_key, &$data){

    // 토큰 검사 조건
    /*
        case1 : access token expire
        case2 : access token expire
        case3 : access token valid
        case4 : access token valiid
    */
    try{
      JWT::$leeway += 60;
      $token = JWT::decode($jwt, new Key($token_key, $algorithm));
      $now = new DateTimeImmutable();
      // 토큰 유효 시작 시간
      if ($token->nbf > $now->getTimestamp())     
      {
        $data["error"] = "jwt error : nbf";
        return 400;
      }
      // 토큰 만료 시작 시간
      else if ($token->exp < $now->getTimestamp())
      {
        $data["error"] = "jwt error : exp";
        return 400;
      }
      // 도메인명
      else if ($token->iss !== $domain)
      {
        $data["error"] = "jwt error : iss";
        return 400;
      }
      // else{
      //   return $token->iss;    // 토큰 발급자
      //   exit;
      // }
      // 토큰으로부터 정보를 구한다.
      $data["manager_id"] = $token->data->manager_id;
      $data["manager_name"] = $token->data->manager_name;
      $data["mem_level"] = $token->data->mem_level;
      return 200;
    }
    catch (Exception $e){
      $data["error"] = $e->getMessage();
      return 400;
    }
}


?>