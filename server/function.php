<?php
/*
  HTTP 헤더로 부터 쿠키 정보를 구한다
    function getCookieFromHeader($cookieName)
  data를 josn data로 리턴
    function genJsonData($data) 
  랜던 문자 조합
    function passwordGenerator( $length=6 )
  암복호화 (e : 암호화, d : 복호화)
    function _crypt( $string, $action = 'e' )
*/    
declare(strict_types=1);

// 쿠키에 저장된 refresh token을 구한다. (rtoken)
function getCookieFromHeader($cookieName){
  try{
    $rtnValue = "";
    // 헤더에 cookie 및 Cookie로 대/소문자를 모두 구분해줘야 한다. 
    if (isset(getallheaders()['cookie'])){
      $headerCookies = explode('; ', getallheaders()['cookie']);
      foreach($headerCookies as $itm) {
        list($key, $val) = explode('=', $itm, 2);
        if ($key === $cookieName){
          $rtnValue = $val;
          break;
        }
      }
    }
    else{
      if (isset(getallheaders()['Cookie'])){
        $headerCookies = explode('; ', getallheaders()['Cookie']);
        foreach($headerCookies as $itm) {
          list($key, $val) = explode('=', $itm, 2);
          if ($key === $cookieName){
            $rtnValue = $val;
            break;
          }
        }
      }
    }
    return $rtnValue;
  }
  catch(Exception $e){
    echo ($e->getMessage());
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

function file_get_contents_curl($url) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);       

  $data = curl_exec($ch);
  curl_close($ch);

  return $data;
}

function getRequstContentType($sType){
  if(strpos($sType, 'json') !== false) {
    return "json";
  }
  elseif(strpos($sType, 'x-www-form-urlencoded') !== false) {
    return "urlencoded";
  }
  elseif(strpos($sType, 'text') !== false) {
    return "text";
  }
}

/*
 파라미터에서 html 및 mysql entity를 제거하고 리턴
 PDO 사용시에는 필요 없음
*/
function fn_EscapeString($param, $mysqli){
  $param = htmlentities($param, ENT_QUOTES); 
  $param = mysqli_real_escape_string($mysqli, $param);               
  return $param;
}

/* URI 파라미터 처리 : POST, GET*/
function fn_URIString($param, $ptype, $pdefault){
  if ($ptype == "string"){
      $tmpStr = isset($_POST[$param]) ? $_POST[$param] : $pdefault;           
      if ($tmpStr == ""){
          $tmpStr = isset($_GET[$param]) ? $_GET[$param] : $pdefault;         
      }     
  }   
  elseif ($ptype == "int"){
      $tmpStr = isset($_POST[$param]) ? $_POST[$param] : $pdefault;           
      if ($tmpStr == ""){
          $tmpStr = isset($_GET[$param]) ? $_GET[$param] : $pdefault;         
      }        
  }
  return$tmpStr;
}

/* URI 파라미터 처리 : requestbody */
function fn_URIString2($param, $ptype, $pdefault){
  if ($ptype == "string"){
    if (isset($param)){
      $tmpStr = trim($param); 
      if ($tmpStr == ""){
          $tmpStr = $pdefault;         
      }     
    }
  }elseif ($ptype == "int"){
    if (isset($param)){
      if (is_numeric($param)){
        $tmpStr = $param;
      }else{
        $tmpStr = -1;
      }
    }
    else{
      $tmpStr = $pdefault;           
    }
  }
  return $tmpStr;
}   

// PDO 디버깅 값을 스트링으로 출력하기 위해 (아래 구문을 선언해줘야 한다.)
// $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
function pdo_debugStrParams($stmt, $isDebug) {
  if ($isDebug){
    ob_start();
    $stmt->debugDumpParams();
    $r = ob_get_contents();
    ob_end_clean();
    return $r;
  }
}

// 랜덤 문자 조합 생성
function passwordGenerator($length=6 ){
  $counter = ceil($length/4);
  // 0보다 작으면 안된다.
  $counter = $counter > 0 ? $counter : 1;            

  $charList = array( 
      array("0", "1", "2", "3", "4", "5","6", "7", "8", "9", "0"),
      array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"),
      array("!", "@", "#", "%", "^", "&", "*") 
              );
  $password = "";
  for($i = 0; $i < $counter; $i++)
  {
    $strArr = array();
    for($j = 0; $j < count($charList); $j++)
    {
      $list = $charList[$j];

      $char = $list[array_rand($list)];
      $pattern = '/^[a-z]$/';
      // a-z 일 경우에는 새로운 문자를 하나 선택 후 배열에 넣는다.
      if( preg_match($pattern, $char) ) array_push($strArr, strtoupper($list[array_rand($list)]));
      array_push($strArr, $char);
    } 
    // 배열의 순서를 바꿔준다.
    shuffle( $strArr );

    // password에 붙인다.
    for($j = 0; $j < count($strArr); $j++) $password .= $strArr[$j];
  }
  // 길이 조정
  return substr($password, 0, $length);
}

// 암호화
function _crypt( $string, $action = 'e' ) {

  $output = false;
  $key = hash( 'sha256', SECRET_KEY );
  $iv = substr( hash( 'sha256', SECRET_IV ), 0, 16 );

  if( $action == 'e' ) {
      $output = base64_encode(openssl_encrypt($string, CRYPT_ALG, $key, 0, $iv));
  }
  else if( $action == 'd' ){
      $output = openssl_decrypt(base64_decode($string), CRYPT_ALG, $key, 0, $iv);
  }

  return $output;
}

// 16진수 형태의 암호화 키를 랜덤하게 생성하는 함수
function getRandomHexLoop($iSize=64) {
	$arrHex = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
	$strHex = '';
	for($i=0; $i<$iSize; $i++){
		$iRand = rand(0, 15);
		$strHex .= $arrHex[$iRand];
	}
	return $strHex;
}

// 16진수 형태의 암호화 키를 OpenSSL 함수를 이용하여 랜덤하게 생성하는 함수
function getRandomHexOpenSSL($iSize=64) {
	return bin2hex(openssl_random_pseudo_bytes($iSize));
}

// utf8_encode 대체, php 8.2 부터는 없어짐
function iso8859_1_to_utf8(string $s) {
  $s .= $s;
  $len = \strlen($s);

  for ($i = $len >> 1, $j = 0; $i < $len; ++$i, ++$j) {
      switch (true) {
          case $s[$i] < "\x80": $s[$j] = $s[$i]; break;
          case $s[$i] < "\xC0": $s[$j] = "\xC2"; $s[++$j] = $s[$i]; break;
          default: $s[$j] = "\xC3"; $s[++$j] = \chr(\ord($s[$i]) - 64); break;
      }
  }
  return substr($s, 0, $j);
}

// utf8_decode 대체, php 8.2 부터는 없어짐
function utf8_to_iso8859_1(string $string): string {
  $s = (string) $string;
  $len = \strlen($s);

  for ($i = 0, $j = 0; $i < $len; ++$i, ++$j) {
      switch ($s[$i] & "\xF0") {
          case "\xC0":
          case "\xD0":
              $c = (\ord($s[$i] & "\x1F") << 6) | \ord($s[++$i] & "\x3F");
              $s[$j] = $c < 256 ? \chr($c) : '?';
              break;

          case "\xF0":
              ++$i;
              // no break

          case "\xE0":
              $s[$j] = '?';
              $i += 2;
              break;

          default:
              $s[$j] = $s[$i];
      }
  }

  return substr($s, 0, $j);
}


/* exception이 아닌 warning, notice 등에 대한 오류를 처리
/* php > 8.0 */
/*
function exception_error_handler(int $errno, string $errstr, string $errfile = null, int $errline) {
  if (!(error_reporting() & $errno)) {
      // This error code is not included in error_reporting
      return;
  }
  throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
}
*/

/* php > 7.0 */
function exception_error_handler(int $errno, string $errstr, string $errfile = null, int $errline) {
  if (!(error_reporting() & $errno)) {
    // This error code is not included in error_reporting
    return;
  }
  throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
}

?>
