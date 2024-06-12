<?php

use PHPMailer\PHPMailer\PHPMailer;       
use PHPMailer\PHPMailer\Exception;

// PHPMailer 설치 경로를 설정해 준다.
require '../lib/PHPMailer/src/Exception.php';
require '../lib/PHPMailer/src/PHPMailer.php';
require '../lib/PHPMailer/src/SMTP.php';

// 메일 본문 생성
// 필요에 맞게 변경해야 한다.
function get_mail_body($data, $regenpassword){
  $mail_html = "";
  $mail_html = $mail_html . '<div style="border-radius:10px; width:450px; height:auto; display:block;';
  $mail_html = $mail_html . 'margin:0 auto; background-color: #fff; border-bottom:1px solid #ccc';
  $mail_html = $mail_html . 'padding:20px; @media screen and (max-width: 600px) { width: 90%; }">';
  $mail_html = $mail_html . '<div style="width:100%; padding:25px; border-bottom: 5px solid #004b55">';
  $mail_html = $mail_html . '<img src="https://www.menteimo.com/img/logo_edu.png" style="width:100px; display: block;">';        
  $mail_html = $mail_html . '</div>';        
  $mail_html = $mail_html . '<div style="padding:20px; width:100%">';        
  $mail_html = $mail_html . '<h1 style="font-size:21px; color:#333; font-weight:700; margin-bottom:22px;">비밀번호 재설정 안내</h1>';
  $mail_html = $mail_html . '<h3 style="color:#333; margin-bottom:10px; font-size:15px; font-weight:500;">비밀번호가 재설정 되었습니다.</h3>';
  $mail_html = $mail_html . '<div style="background-color:#f8f8f8; border-top:1px solid #b3b3b3; border-bottom:1px solid #b3b3b3; padding:25px 15px; margin-bottom:15px;">';
  $mail_html = $mail_html . '<h2 style="width:100%; display:flex;"><p style="font-size:16px; font-weight:500; color:#333; display:block; width:30%;">비밀번호</p><p style="font-size:16px; font-weight:700; color:#000; display:block; width:70%;">' . $regenpassword . '</p></h2>';
  $mail_html = $mail_html . '</div>';
  $mail_html = $mail_html . '<a style="padding:8px 12px;'; 
  $mail_html = $mail_html . 'background-color:#256677; color:#fff; font-size:12px; text-decoration:none;"';
  $mail_html = $mail_html . ' href="http://www.ks-edu.kr/" target="_blank">홈페이지 바로가기</a>';
  $mail_html = $mail_html . '</div>';
  $mail_html = $mail_html . '</div>';  
  $mail_html = $mail_html . '<div style="width:70%; padding:10px 20px;"><p style="color:#808080; font-size:14px; font-weight:400;">본 메일은 발신 전용입니다.</p></div>';    
  return $mail_html;
}


function sendMail($smtp_server, $smtp_port, $from_mail, $from_mail_pass, $from_name, 
          $to_mail, $title, $mail_html){
  $mail = new PHPMailer(true);                    // Passing `true` enables exceptions
  try {
    // Naver SMTP를 사용할 경우
    $mail->SMTPDebug = false;                       // 1:에러+메시지, 2:메시지만 출력
        
    $mail->isSMTP();                            // SMTP 활성화
    $mail->Host = $smtp_server;                 // email 보낼때 사용할 서버를 지정
    $mail->SMTPAuth = true;                     // SMTP 인증을 사용함
    $mail->Username = $from_mail;               // 메일플러그 계정
    $mail->Password = $from_mail_pass;          // 패스워드
    $mail->SMTPSecure = 'ssl';                  // SSL을 사용함 (tls일 경우 587포트)
    $mail->Port = $smtp_port;                   // email 보낼때 사용할 포트를 지정
    $mail->CharSet = "utf-8";
    $mail->ContentType = "text/html";

    $from_name = $from_name;

    //Recipients
    $mail->setFrom($from_mail, $from_name);
    //$mail->addAddress($to_mail, $to_name);     
    $mail->addAddress($to_mail);                // 받는 사람 이름은 왜 지정을 하나???
    $mail_html =  $mail_html;

    //Content
    $mail->isHTML(true);                       
    $mail->Subject = $title;
    $mail->Body    = $mail_html;
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    
    // Gmail로 메일을 발송하기 위해서는 CA인증이 필요
    // CA 인증을 받지 못한 경우에는 아래 설정하여 인증체크를 해지하여야 한다.
    /*
    $mail->SMTPOptions = array(
        "ssl"=>array(
              "verify_peer"=> false
              , "verify_peer_name"=> false
              , "allow_self_signed"=> true
        )
    );
    */    
    
    $sendresult = $mail->send();
    if($sendresult){
        $rtnvalue = 'ok';
    }
  } catch(Exception $e) {
    $rtnvalue = $mail->ErrorInfo;
  }
  return $rtnvalue;
}
?>