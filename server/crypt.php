<?php
class AESCrypt
{   

  var $skey;
  var $iv;
                                    
  function setKey($KEY, $IV)
  {
      $this->skey = $KEY;    
      $this->iv = $IV;   
  }

  
  function encrypt ($value)        
  {                      
    $output = openssl_encrypt($value, CRYPT_ALG, $this->skey, 0, $this->iv);
    $output = $this->pkcs5_unpad($output); 
    return $this->filter($output);        
  }    

  function decrypt ($value)        
  {                      
    // PHP7.2 이상부터
    $output = openssl_decrypt($value, CRYPT_ALG, $this->skey, 0, $this->iv);
    $output = $this->pkcs5_unpad($output); 
    return $this->filter($output);        
  }    
 
  // pkcs5과 자바스크립트 CryptoJS.pad.Pkcs7은 동일
  function pkcs5_unpad($text) 
  {
      if($text == "") {
          return $text;
      }
      $len = strlen($text);
      $pad = ord( $text[$len-1] );
      if ($pad > $len) {
        return $text;
      }
      if (!strspn($text, chr($pad), $len - $pad)) {
        return $text;
      }
      return substr($text, 0, -1 * $pad);
  }

  function filter($par)
  {
      $par = htmlspecialchars($par);
      $par = strip_tags($par);
      $par = str_replace("'","\"",$par);
      $par = str_replace("`","\"",$par);
      $par = trim($par);
      return $par;
  }
}
?>