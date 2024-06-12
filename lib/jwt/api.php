<?php

/* session_start() 대신 session_start_samesite() 를 사용 
    => PHP 7.3 이상에서 session.cookie_secure = true; session.cookie_httponly = false; session.cookie_samesite = "None"; 한 것과 동일한 효과
*/
// 보안을 위한 쿠키 설정
// HTTPS일 경우에만 쿠키를 서버로 쿠키를 전송할 수 있음.
//ini_set('session.cookie_secure',1);
// 브라우저에서 쿠키 조회 불가, 서버로 Request할 경우에만 쿠키 사용
ini_set('session.cookie_httponly',1);
ini_set('session.cookie_samesite','None');
session_start();

/*
<?php
$arr_cookie_options = array (
                'expires' => time() + 60*60*24*30, 
                'path' => '/', 
                'domain' => '.example.com', // leading dot for compatibility or use subdomain
                'secure' => true,     // or false
                'httponly' => true,    // or false
                'samesite' => 'None' // None || Lax  || Strict
                );0
setcookie('TestCookie', 'The Cookie Value', $arr_cookie_options);    
?>
*/
  /* JWT 
    jwt 검증 : https://jwt.io/
    jwt : 헤더 (Header), 페이로드 (Payload), 서명 (Signature) 세 부분으로 구성, 각 구성요소는 점 (.) 으로 분리
      => Header.Payload.Signature
  */

  include_once 'config.php';
  include_once 'database.php';
  include_once "crypt.php";
  include_once "function.php";
  include_once "phprandom.php";
                

  // axio에서 전달된 파라미터를 못받을 수 있으므로 헤드 정보 추가 (필요한지는 다시 한번 확인이 필요함)
  header("Access-Control-Allow-credentials: true");
  header("Access-Control-Allow-Origin: additdev.iptime.org");
  header("Content-Type: text/html; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  // X-Requested-With : 요청이 Ajax라는 것을 의미
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  // request payload 로 전송될 때 
  $request_body = file_get_contents('php://input');


  // rtoken 쿠키가 존재하지 않을 경우 accesstoken 생성 및 rtoken 생성
  $rtoken = getCookieFromHeader("rtoken");
  $week = new DateTime('+1 week');

  setcookie('desc', '', $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
  setcookie('error', '', $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
  setcookie('code', '', $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
  if ($rtoken === ""){
    // refresh token을 생성한다. (랜덤 32비트 값)
    $random_value = new PHPRandom();
    $token_key = $random_value->getHexString(48);

    setcookie('rtoken', $token_key, $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
    setcookie('desc', 'new', $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
    echo rawurlencode(bin2hex(genAccessToken()));
  }
  else
  {
    // access token을 검증한다.
    // Header 추출 및 토큰 데이터 확인
    // 1) 쿠키가 존재하면서 Acess Token이 존재하지 않을 경우 토큰을 재발급한다.
    if (! preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
      setcookie('desc', 'new1', $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
      echo rawurlencode(bin2hex(genAccessToken()));
      exit;
    }
    else{
      $jwt = $matches[1];
      if (!$jwt) {
        // 토근을 활용할 수 없을 경우 토큰을 재발급한다.
        setcookie('desc', 'new2', $week->getTimestamp(), '/', 'additdev.iptime.org', false, true);
        echo rawurlencode(bin2hex(genAccessToken()));
        exit;
      }
      else{
        $rtncode = ValidateToken($jwt);
        setcookie('code', $rtncode , $week->getTimestamp(), '/', 'additdev.iptime.org', null, true);
        switch($rtncode){
          case 401 : // 헤더 인증 정보 없음 (Bearer 없음)
            header('HTTP/1.1 401 Unauthorized - Invalid Server');
            break;
          case 402 : // 토큰 활성화 시간 오류
            header('HTTP/1.1 401 Unauthorized - Inactive Acess Token');
            break;
          case 403 : // 토큰 만료, access token이 만료되고 refresh token이 존재할 경우 신규 토큰 발행
            setcookie('desc', 'new3', $week->getTimestamp(), '/', 'additdev.iptime.org', null, true);
            echo rawurlencode(bin2hex(genAccessToken()));
            break;
          case 413 : // exception expired
            setcookie('desc', 'new4', $week->getTimestamp(), '/', 'additdev.iptime.org', null, true);
            echo rawurlencode(bin2hex(genAccessToken()));
            break;
          default :
            setcookie('desc', $rtncode , $week->getTimestamp(), '/', 'additdev.iptime.org', null, true);
//            http_response_code(200);
            break;
        }
      }
    }
  }
  die();

// 최초 전송시에는 acess token을 발행한다.

// 암호화를 진행
$mcrypt = new AESCrypt();
$mcrypt->setKey($key,$iv);                
$data = $mcrypt->decrypt($data);

// $json으로 만들기
$data_json = genJsonData($data);
$cmd = (isset($data_json["cmd"]) ? $data_json["cmd"] : "");
$user_id = trim(isset($data_json["user_id"]) ? $data_json["user_id"] : "");
$user_password = trim(isset($data_json["user_password"]) ? $data_json["user_password"] : "");

$tmp_json = array();
// 데이터베이스 연결
$databaseService = new DatabaseService();
$conn = $databaseService->getConnection();
$conn = NULL;
if ($conn === NULL)
{
  echo "aaaa";
  http_response_code(500);  
  die();
}


  // urlecoding 전송 데이터에 대한 urlencoding
  $data = urldecode($request_body);

  if (empty($data)){
    http_response_code(500);  
    die();
  }


  $MEMBER_TABLE = "aw_member";

  try{
    $query = "SELECT * FROM " . $MEMBER_TABLE . " WHERE mem_id = :user_id AND mem_password = :user_password";
    $stmt = $conn->prepare($query);


    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);

    $password_hash = hash("sha256", utf8_encode($user_password));
    $stmt->bindParam('user_password', $password_hash, PDO::PARAM_STR);

    $stmt->execute();
    $num = $stmt->rowCount();

    if ($num > 0){
      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $mem_id = $row['mem_id'];
        $mem_name = $row['mem_name'];
        $mem_level = $row['mem_level'];
      }
      //echo $mem_id . $mem_name . $mem_level;
      
      // Base64 인코딩 시 마지막에 붙는 = 또는 == 은 제거하도록 한다.
      // JWT 관련 설정
      // const jwt = `${encodedHeader}.${encodedPayload}.${signature}`
      function genAccessToken($secret_key){
        $secret_key = TOKEN_KEY;

        $token_subject = "subject";
        $issuer_claim = SERVER_URL;                       // 토큰 사용 서버(일반적으로 서버 URL을 입력), 
        $audience_claim = "intialize token";              // 토큰 사용처
        $issuedat_claim = time();                         // 토큰 생성 시간 1970년 1월 1일 0시 0분 0초부터 세기 시작한 시간을 의미
        $notbefore_claim = $issuedat_claim;               // 즉시 토큰 활성화
        $expire_claim = $issuedat_claim + 10;             // 토큰 만료 시간 (10초), 실제는 30분 이내

        $access_token = array(                            // (Registered Claim)
          "iss" => $issuer_claim,                         // 토큰 발급자
          "aud" => $audience_claim,                       // 토큰 대상자
          "iat" => $issuedat_claim,                       // 토큰 발급 시각, Numeric Data 형식
          "nbf" => $notbefore_claim,                      // 토큰 활성화 시각, Numeric Data 형식, 해당 시각전에는 토근이 유효하지 않음.
          "exp" => $expire_claim,                         // 토큰 만료 시각, Numeric Data 형식
          "sub" => $token_subject,                        // 토큰 제목  
          /*
          "data" => array(
              "mem_id" => $mem_id,
              "mem_name" => $mem_name,
              "mem_level" => $mem_level,
              "cmd"=>$cmd
          )
          */
        ); 

        // $refresh_token 을 생성한다.

        // http_response_code(200);  
        // JWT 생성
        $access_jwt = JWT::encode($access_token, $secret_key, TOKEN_ALG);
        //$dateDifference  = abs($refresh_expire_claim - $expire_claim);
        //$years  = floor($dateDifference / (365 * 60 * 60 * 24));
        //$months = floor(($dateDifference - $years * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
        //$days   = floor(($dateDifference - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 *24) / (60 * 60 * 24));
        //$exp_period = $days;

        return json_encode(
          array(
              "access_token" => $access_jwt,
              //"refresh_token" => $refresh_token,
              //"mem_id" => $mem_id,
              //"cmd" => $cmd,
              "access_exp" => $expire_claim,
              //"refresh_exp" => $refresh_expire_claim,
              //"exp_period" => $exp_period
          ), JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT
        );
      }
      echo $rtnJSON;
      //echo rawurlencode($rtnJSON);
    }
    else{
      http_response_code(405);  
    }
  }
  catch(PDOException $e){
    $tmp_json["value"] = "fail";
    $tmp_json["desc"] = $e->getMessage();
    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
    echo($return_data);      
  }

    // 암호화
  /*
  $data = array();
  $tmp_json = array();

  $tmp_json["value"] = "fail";
  $tmp_json["desc"] = "우리나라 대한민국 '어서빨리'";
  // 데이터 인코딩
  $tmp_json["desc"] = urlencode($tmp_json["desc"]);
  // json 문자 형식으로 인코딩
  $data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);

  $mcrypt = new AESCrypt();
  $mcrypt->setKey($key,$iv);
  $data = $mcrypt->encrypt($data);
  echo $data;
 
  die();
  */

?>

