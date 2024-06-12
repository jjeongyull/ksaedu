<?php

declare(strict_types=1);

require_once('config.php');
require_once('vendor/autoload.php');
require_once("phprandom.php");
use Firebase\JWT\JWT;

// refresh 토큰을 발행한다.
function getRefreshToken(){
$refresh_token = new PHPRandom();
return $refresh_token->getString(32);
}

// 쿠키에 저장된 refresh token을 구한다. (rtoken)
function getCookieFromHeader($cookieName){
  $rtnValue = "";
  $headerCookies = explode('; ', getallheaders()['Cookie']);
  foreach($headerCookies as $itm) {
    list($key, $val) = explode('=', $itm, 2);
    if ($key === $cookieName){
      $rtnValue = $val;
      break;
    }
  }
  return $rtnValue;
}

function decode_error_desc($code){
  $rtnValue = "";
  switch ($code){
    case 400 : $rtnValue = 'Key may not be empty'; break;
    case 401 : $rtnValue = 'Wrong number of segments'; break;
    case 402 : $rtnValue = 'Invalid header encoding'; break;
    case 403 : $rtnValue = 'Invalid claims encoding'; break;
    case 404 : $rtnValue = 'Invalid signature encoding'; break;
    case 405 : $rtnValue = 'Empty algorithm'; break;
    case 406 : $rtnValue = 'Algorithm not supported'; break;
    case 407 : $rtnValue = 'Algorithm not allowed'; break;
    case 408 : $rtnValue = '"kid" invalid, unable to lookup correct key'; break;
    case 409 : $rtnValue = '"kid" empty, unable to lookup correct key'; break;
    case 410 : $rtnValue = 'Signature verification failed'; break;
    case 411 : $rtnValue = 'Cannot handle token prior to '; break;
    case 412 : $rtnValue = 'Cannot handle token prior to '; break;
    case 413 : $rtnValue = 'Expired token'; break;
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

// access token을 구한다.
function genAccessToken($token_key){

  $token_subject = "subject";
  $issuer_claim = SERVER_URL;                       // 토큰 사용 서버(일반적으로 서버 URL을 입력), 
  $audience_claim = "gen token";              // 토큰 사용처
  $issuedat_claim = time();                         // 토큰 생성 시간 1970년 1월 1일 0시 0분 0초부터 세기 시작한 시간을 의미
  $notbefore_claim = $issuedat_claim;               // 즉시 토큰 활성화
  $expire_claim = $issuedat_claim + 10;             // 토큰 만료 시간 (10초), 실제는 30분 이내

  $access_token = array(                            // (Registered Claim)
    "iss" => $issuer_claim,                         // 토큰 발급자
    "aud" => $audience_claim,                       // 토큰 대상자
    "iat" => $issuedat_claim,                       // 토큰 발급 시각, Numeric Data 형식
    "nbf" => $notbefore_claim,                      // 토큰 활성화 시각, Numeric Data 형식, 해당 시각전에는 토근이 유효하지 않음.
    "exp" => $expire_claim,                         // 토큰 만료 시각, Numeric Data 형식
    "sub" => $token_subject
    /*,                        // 토큰 제목  
    "data" => array(
        "rtoken" => $refresh_token
    )
    */
  ); 

  // JWT 생성
  $access_jwt = JWT::encode($access_token, $token_key, TOKEN_ALG);
  //$dateDifference  = abs($refresh_expire_claim - $expire_claim);
  //$years  = floor($dateDifference / (365 * 60 * 60 * 24));
  //$months = floor(($dateDifference - $years * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
  //$days   = floor(($dateDifference - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 *24) / (60 * 60 * 24));
  //$exp_period = $days;

  return json_encode(
    array(
        "a_token" => $access_jwt
    ), JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT
  );
}

/* @access token validation을 체크한다
  @date : 2023-03-06
  @writer : additcorp dev
*/
function ValidateToken($jwt, $token_key){

    // 토큰 검사 조건
    /*
        case1 : access token expire
        case2 : access token expire
        case3 : access token valid
        case4 : access token valiid
    */
    try{
      $week = new DateTime('+1 week');
      setcookie('error', "", $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
      JWT::$leeway += 60;
      $token = JWT::decode($jwt, $token_key, [TOKEN_ALG]);
      $now = new DateTimeImmutable();
      $serverName = SERVER_URL;

      setcookie('expire', strval($token->exp), $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);

      if ($token->iss !== $serverName )
      {
        return 401;
        exit;
      }
      else if ($token->nbf > $now->getTimestamp())
      {
        return 402;
        exit;
      }
      else if ($token->exp < $now->getTimestamp())
      {
        setcookie('error', 'expire', $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
        return 403;
        exit;
      }
      else{
        setcookie('error', 'success', $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
        return 200;
        exit;
      }
    }
    catch (Exception $e){
      return $e->getMessage();
    }
}

// 전송 받은 데이터를 JSON 구조로 리턴한다.
function genJsonData($data){
  // html 특수 문자를 처리한다.
  $tmp = htmlspecialchars_decode($data);
  // escape 문자 처리
  $tmp = stripslashes($tmp);
  return json_decode($tmp, true);
}
?>