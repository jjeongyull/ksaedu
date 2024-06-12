<?php
/**
 * This file processes the login request and sends back a token response
 * if successful.
 */


//if (isset($_POST['cmd'])) {$cmd = $_POST['cmd'];}
if (isset($_POST['username'])) {$username = $_POST['username'];}
if (isset($_POST['password'])) {$password = $_POST['password'];}

$cmd = isset($_POST['cmd']) ? $cmd = $_POST['cmd'] : "";

switch($cmd) {
    case 'login':
        if (($username == 'john.doe') && ($password == 'foobar')) {

            require_once('jwt.php');

            /** 
             * Create some payload data with user data we would normally retrieve from a
             * database with users credentials. Then when the client sends back the token,
             * this payload data is available for us to use to retrieve other data 
             * if necessary.
             */
            $userId = 'USER123456';

            /**
             * Uncomment the following line and add an appropriate date to enable the 
             * "not before" feature.
             */
            $nbf = strtotime('2023-03-05 00:00:01');

            /**
             * Uncomment the following line and add an appropriate date and time to enable the 
             * "expire" feature.
             */
            $exp = strtotime('2023-03-06 00:00:01');

            // Get our server-side secret key from a secure location.
            $serverKey = '5f2b5cdbe5194f10b3241568fe4e2b24';

            // create a token
            $payloadArray = array();
            $payloadArray['userId'] = $userId;
            if (isset($nbf)) {$payloadArray['nbf'] = $nbf;}
            if (isset($exp)) {$payloadArray['exp'] = $exp;}
            $token = JWT::encode($payloadArray, $serverKey);

            // return to caller
            $returnArray = array('token' => $token);
            $jsonEncodedReturnArray = json_encode($returnArray, JSON_PRETTY_PRINT);
            echo $jsonEncodedReturnArray;

        } 
        else {
            $returnArray = array('error' => 'Invalid user ID or password.');
            $jsonEncodedReturnArray = json_encode($returnArray, JSON_PRETTY_PRINT);
            echo $jsonEncodedReturnArray;
        }

        break;

    case 'checklogin':

        $token = null;

        if (!preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
          header('HTTP/1.0 400 Bad Request');
          echo 'Token not found in request';
          exit;
        }
        
        $token = $matches[1];
        if (! $token) {
          // No token was able to be extracted from the authorization header
          header('HTTP/1.0 400 Bad Request');
          $returnArray = array('error' => 'You are not logged in with a valid token.');
          exit;
        }
        else{
            require_once('jwt.php');
            echo $token;
            // Get our server-side secret key from a secure location.
            $serverKey = '5f2b5cdbe5194f10b3241568fe4e2b24';

            try {
                $payload = JWT::decode($token, $serverKey, array('HS256'));
                $returnArray = array('userId' => $payload->userId);
                if (isset($payload->exp)) {
                    $returnArray['exp'] = date(DateTime::ISO8601, $payload->exp);;
                }
            }
            catch(Exception $e) {
                $returnArray = array('error' => $e->getMessage());
            }
        } 
        
        // return to caller
        $jsonEncodedReturnArray = json_encode($returnArray, JSON_PRETTY_PRINT);
        echo $jsonEncodedReturnArray;

        break;

    default:
        $returnArray = array('error' => 'You have requested an invalid method.');
        $jsonEncodedReturnArray = json_encode($returnArray, JSON_PRETTY_PRINT);
        echo $jsonEncodedReturnArray;
}