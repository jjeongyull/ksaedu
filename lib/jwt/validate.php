<?php
// 토큰 검사 조건
/*
    case1 : access token expire / refresh token expire
    case2 : access token expire / refresh token valid
    case3 : access token valid / refresh token expire
    case4 : access token valiid / refresh token valid
*/
declare(strict_types=1);

use Firebase\JWT\JWT;

require_once('vendor/autoload.php');

if (!preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
    header('HTTP/1.0 400 Bad Request');
    echo 'Token not found in request';
    exit;
}

$jwt = $matches[1];
if (! $jwt) {
    // No token was able to be extracted from the authorization header
    header('HTTP/1.0 400 Bad Request');
    exit;
}

echo $jwt;
die();
$secretKey  = TOKEN_KEY;
$token = JWT::decode($jwt, $secretKey, [TOKEN_ALG]);
$now = new DateTimeImmutable();
$serverName = SERVER_URL;

if ($token->iss !== $serverName )
{
    header('HTTP/1.1 401 Unauthorized - Invalid Server');
    exit;
}
else if ($token->nbf > $now->getTimestamp())
{
    header('HTTP/1.1 401 Unauthorized - Inactive Acess Token');
    exit;
}
else if ($token->exp < $now->getTimestamp())
{
    header('HTTP/1.1 401 Unauthorized - Expire Acess Token');
    exit;
}
else{
    $returnArray = array('mem_id' => $token->mem_id);
    if (isset($token->exp)) {
        $returnArray['exp'] = date(DateTime::ISO8601, $token->exp);;
    }    
    $returnArray['mem_id'] = $token['data']['mem_id'];
    // var_dump($returnArray);
    echo json_encode($returnArray, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
}

?>
