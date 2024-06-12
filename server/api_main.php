<?php

  ini_set('session.cookie_httponly',1);
  ini_set('session.cookie_samesite','Lax');
  session_start();

  include_once 'config.php';
  include_once 'database.php';
  include_once "function.php";
  include_once "jwt_func.php";

  include_once "api_member.php";      // 회원등록, 비밀번호 재발행 처리
  include_once "api_login.php";       // 로그인 처리

  include_once "sendmail.php";    


  // axio에서 전달된 파라미터를 못받을 수 있으므로 헤드 정보 추가 (필요한지는 다시 한번 확인이 필요함)
  header("Access-Control-Allow-credentials: true");
  header("Access-Control-Allow-Origin: " . DOMAIN);
  // header("Access-Control-Allow-Origin: *");
  //header("Content-Type: text/html; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST, GET");
  header("Access-Control-Max-Age: 3600");
  // X-Requested-With : 요청이 Ajax라는 것을 의미
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  // 리턴 변수 선언
  $rtn_access_token = "";     // 리턴될 Access Token
  $rtnmessage = "";
  $data_array = array();      // 임시 배열 선언
  $bregen = false;            // 엑세스 토큰 재발행 여부 확인
  $resultdata = array();      // 결과 JSON 저장 배열
  $tokendata = array();       // 토큰에 포함된 데이터를 저장하기 위한 변수

  // Request Content Type를 구한다.
  $requestContentType = getRequstContentType($_SERVER['CONTENT_TYPE']);

  $request_body = file_get_contents('php://input');

  switch ($requestContentType) {
    case "json" :
      $request_body = json_decode($request_body);
      $cmd = $request_body->cmd;
      break;
    case "urlencoded" : // 텍스트 파싱
      $cmd = fn_URIString("cmd", "string", "");
      break;
    case "text" :
      $paramdata = $request_body;
      break;
    default :
      $cmd = "";
      break;
  }

  if ($cmd == ""){
    $cmd = isset($_POST['cmd']) ? $_POST['cmd'] : "";
    if ($cmd == ""){
      ReturnData(500, "error", "명령 파라미터 전달 오류", "", "", NULL);
      die();
    }
  
  }else if ($cmd == "logout"){
    // 쿠키를 초기화한다.
    setcookie('rtoken', "", time() - 3600,'/', DOMAIN, false, true);
    // 쿠키를 저장한 테이블이 존재할 경우 삭제한다.
    $resultdata["status"] = 200;
    ReturnData($resultdata["status"], $cmd, "", "", "", NULL);
    die();
  }

  // 데이터베이스 연결
  $databaseService = new DatabaseService(DB_SERVER_NAME, 
        DB_USER_NAME, DB_USER_PASSWORD, DB_NAME, DB_PORT);
  $conn = $databaseService->getConnection();
  if ($conn === NULL)
  {
    http_response_code(500);  
    ReturnData(500, "dbcon", "데이터베이스 연결 오류", "", "", NULL);
    die();
  }
  // PDO 실행 에러를 처리 하기 위해 
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // 로그인 없이 처리되어야하는 정보
  $param = new stdClass();
  switch ($cmd){
    // 비밀번호 재발행
    case "regen_userpassword" :
      $param->login_type  = "";
      if (isset($request_body->mem_id)) {
        $param->mem_id = $request_body->mem_id;
        // 관리자 로그인 시 1, 일반 로그인 시 0
        $param->login_type = $request_body->login_type;
        $param->cmd = $cmd;
      }
      else{
        ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
        die();
      } 
      if ($param->login_type == "1"){
        $param->table_name = "manager";
      }
      else{
        $param->table_name = TBL_SUSB_CALSS;
      }
      $regenpassword = "";
      if (regen_password($param, $conn, "", $regenpassword)){
        // 비밀번호 재발행 후 메일 발송      
        $title = "[한국표준협회] 비밀번호가 재설정되었습니다.";
        $mail_html = get_mail_body($param,  $regenpassword);
        $sendresult = "";
        // sendmail.php 파일내의 메일 본문 생성 함수 변경 (get_mail_body)
        $sendresult = sendMail(SMTP_SERVER, SMTP_PORT, FROM_MAIL, FROM_MAIL_PASS, FROM_NAME,
              $param->mem_id, $title, $mail_html);
        if ($sendresult == "ok"){
          ReturnData(200, $param->cmd, "", "", "", $conn);
        }
        else{
          ReturnData(500, $param->cmd, $sendresult, "", "", $conn);
        }
      }
      die();
      break;
    case "subs_class_check" : // 사용자 신청 정보확인
      if (isset($request_body->mem_id) && isset($request_body->mem_password)) {
        $mem_id = $request_body->mem_id;
        $mem_password = $request_body->mem_password;
        $cmd = $cmd;
      }
      else{
        ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
        die();
      } 
      try{
        //$sql = "SELECT a.idx, a.subs_type, a.subs_user_payment, a.subs_date, b.class_name_ch, b.class_name_en, c.class_time";
        $sql = "SELECT a.*, b.class_name_ch, b.class_manager_ch, b.class_manager_en, b.class_info_tel, b.class_info_fax, ";
        $sql = $sql . "b.class_info_email, b.class_name_en, b.pay_dal_ch, b.pay_ch_ch, b.pay_kr_en, b.pay_en_en, c.class_time,";
        $sql = $sql . "b.pay_dal_ch_1, b.	pay_ch_ch_1, c.class_type";
        $sql .= " FROM subs_class as a";
        $sql .= " LEFT JOIN class_info as b ON a.class_idx = b.idx";
        $sql .= " LEFT JOIN class_time as c ON a.subs_class_time_idx = c.idx"; // 조인할 세 번째 테이블 및 조인 조건을 추가합니다.
        $sql .= " WHERE a.subs_user_email = :mem_id AND a.subs_user_password = :mem_password";


        $stmt = $conn->prepare($sql);
        // 이메일 비교
        $cryptdata = "";
        $cryptdata = _crypt($mem_id);
        $stmt->bindValue(":mem_id", $cryptdata, PDO::PARAM_STR);

        // 비밀번호 비교
        $cryptdata = "";
        $cryptdata = hash("sha256", iso8859_1_to_utf8($mem_password));
        $stmt->bindValue(':mem_password', $cryptdata, PDO::PARAM_STR);
        //$stmt->debugDumpParams();
        $stmt->execute();
        //$stmt->debugDumpParams();

        $row = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data_array = $row;
        $result_data["tabledata"] = $data_array;
        ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);

      }
      catch(PDOException $e){
          ReturnData(600, $cmd, $e->getMessage(), "", "", $conn);
      }
      die();
      break;
    //case 
    // class_id, lagn code에 해당되는 교육 일정(시간) 정보를 리턴
    case "load_classtime" :
      if (isset($request_body->class_idx) && isset($request_body->class_lang)){
        $class_idx = $request_body->class_idx;
        $class_lang = $request_body->class_lang;
      } 
      else{
        ReturnData(500, $cmd, "Error Parameter", "", "", $conn);
        $conn = null;
        die();
      }
      try{
        $sql = "SELECT * FROM class_time WHERE class_idx = :class_idx AND class_lang = :class_lang";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":class_idx", $class_idx, PDO::PARAM_INT);
        $stmt->bindParam(':class_lang', $class_lang, PDO::PARAM_STR);
        //$stmt->debugDumpParams();
        $stmt->execute();
        //$stmt->debugDumpParams();

        $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($row){
          $data_array = $row;
          $result_data["tabledata"] = $data_array;
          ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
        }else{
          $result_data["message"] = "Not exists class time info";
          ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
        }
      }
      catch(PDOException $e){
          ReturnData(600, $cmd, $e->getMessage(), "", "", $conn);
      }
      die();
      break;
    // 관리자일 경우 모든 클래스 로드
    // 사용자일 경우 활성화된 클래스 로드
    case "load_class_list" :
      try{
        $sql = "SELECT * FROM class_info ORDER BY idx";
        $stmt = $conn->prepare($sql);
        //$stmt->debugDumpParams();
        $stmt->execute();
        //$stmt->debugDumpParams();

        $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($row){
          $data_array = $row;
          $result_data["tabledata"] = $data_array;
          ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
        }else{
          $result_data["message"] = "Not exists class info";
          ReturnData(500, $cmd, $rtnmessage, "", $result_data, $conn);
        }
      }
      catch(PDOException $e){
          ReturnData(600, $cmd, $e->getMessage(), "", "", $conn);
      }
      die();
      break;
    // 교육 수강 신청 정보 등록
    // 조건 : class_info의 class_max_usercount 을 초과할 경우 subs_type = 1로 설정 등록
    // 중복 수강 신청은 어떻게 구분할 것인가?
    case "insert_user_subs_class" : 
      if ( isset($request_body->class_idx) && isset($request_body->subs_user_name_ch) 
      && isset($request_body->subs_user_name_en) && isset($request_body->subs_company_position)
      && isset($request_body->subs_sex) && isset($request_body->subs_identity_number)
      && isset($request_body->subs_phone_number) && isset($request_body->subs_user_email) && isset($request_body->subs_user_zipcode)
      && isset($request_body->subs_company_name_ch) && isset($request_body->subs_company_name_en)
      && isset($request_body->subs_company_address_ch) && isset($request_body->subs_company_address_en)
      && isset($request_body->subs_agent_name) && isset($request_body->subs_agent_manager)
      && isset($request_body->subs_agent_phone_number) && isset($request_body->subs_agent_email)
      && isset($request_body->subs_currency) && isset($request_body->subs_user_password)
      && isset($request_body->subs_country) && isset($request_body->subs_class_time_idx)
      && isset($request_body->subs_depositor_name) && isset($request_body->subs_user_wechat)
      && isset($request_body->subs_agent_wechat) && isset($request_body->subs_birth)
      && isset($request_body->subs_company_name_ko) && isset($request_body->subs_ceo_name) 
      ){
        $class_idx = $request_body->class_idx;
        $subs_user_name_ch = $request_body->subs_user_name_ch;
        $subs_user_name_en = $request_body->subs_user_name_en;
        $subs_user_wechat = $request_body->subs_user_wechat;
        $subs_company_position = $request_body->subs_company_position;
        $subs_sex = $request_body->subs_sex;
        $subs_birth = $request_body->subs_birth;
        $subs_identity_number = $request_body->subs_identity_number;
        $subs_phone_number = $request_body->subs_phone_number;
        $subs_user_email = $request_body->subs_user_email;
        $subs_user_zipcode = $request_body->subs_user_zipcode;
        $subs_company_name_ch = $request_body->subs_company_name_ch;
        $subs_company_name_en = $request_body->subs_company_name_en;
        $subs_company_name_ko = $request_body->subs_company_name_ko;
        $subs_company_address_ch = $request_body->subs_company_address_ch;
        $subs_company_address_en = $request_body->subs_company_address_en;
        $subs_agent_name = $request_body->subs_agent_name;
        $subs_agent_manager = $request_body->subs_agent_manager;
        $subs_agent_phone_number = $request_body->subs_agent_phone_number;
        $subs_agent_email = $request_body->subs_agent_email;
        $subs_agent_wechat = $request_body->subs_agent_wechat;
        $subs_currency = $request_body->subs_currency;
        $subs_depositor_name = $request_body->subs_depositor_name;
        $subs_user_password = $request_body->subs_user_password;
        $subs_country = $request_body->subs_country;
        $subs_class_time_idx = $request_body->subs_class_time_idx;
        $subs_ceo_name = $request_body->subs_ceo_name;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
          /**
           * class_idx에 개수를 구한다
           * class_time 테이블의 class_max_usercount 를 구한다.
           * class_max_usercount > class_idx 개수보다 클 경우 subs_type = 1로 설정 (대기 인원)
          */
          /* subs_class 테이블에서 해당 클래스를 신청한 수를 구한다. */
          // 삭제된 subs_delete가 1인것은 제외하고 카운트
          $sql = "SELECT count(class_idx) as cnt FROM " . TBL_SUSB_CALSS . " WHERE subs_class_time_idx = :subs_class_time_idx AND subs_delete = 0";
          $stmt = $conn->prepare($sql);
          $stmt->bindValue(":subs_class_time_idx", $subs_class_time_idx, PDO::PARAM_INT);
          $stmt->execute();
          $applycount = $stmt->fetchColumn();
          //var_dump('$applycount', $applycount);
          /* class_time 테이블에서 강의(idx)에 해당되는 최대 신청 수를 구한다. */
          $sql = "SELECT class_max_count cnt FROM " . TBL_CLASS_TIME . " WHERE idx = :subs_class_time_idx";
          $stmt = $conn->prepare($sql);
          $stmt->bindValue(":subs_class_time_idx", $subs_class_time_idx, PDO::PARAM_INT);
          $stmt->execute();
          $maxcount = $stmt->fetchColumn();
          //var_dump('$maxcount', $maxcount);
          
          $subs_type = 0;
          if ($applycount >= $maxcount){
            $subs_type = 1;
          }

          // $subs_type = 0;
          // if ($count > 0){
          //   $subs_type = 1;
          // }

          /* 중복 신청 체크 : 강의 일자 + 이름 + 이메일이 동일하면 중복*/
          /* 이름은 중문? 영문? 각각 체크를 해야 할까? langcode를 */
          if ($subs_country == "ch"){
            $sql = "SELECT idx as cnt FROM " . TBL_SUSB_CALSS . " WHERE ";
            $sql = $sql . " subs_class_time_idx = :subs_class_time_idx AND ";
            $sql = $sql . " subs_user_name_ch = :subs_user_name_ch AND ";
            $sql = $sql . " subs_user_email = :subs_user_email";
          }
          else{
            $sql = "SELECT idx as cnt FROM " . TBL_SUSB_CALSS . " WHERE ";
            $sql = $sql . " subs_class_time_idx = :subs_class_time_idx AND ";
            $sql = $sql . " subs_user_name_en = :subs_user_name_en AND ";
            $sql = $sql . " subs_user_email = :subs_user_email";
          }
          $stmt = $conn->prepare($sql);
          $stmt->bindValue(":subs_class_time_idx", $subs_class_time_idx, PDO::PARAM_INT);
          if ($subs_country == "ch"){
            $stmt->bindValue(":subs_user_name_ch", $subs_user_name_ch, PDO::PARAM_STR);
          }
          else{
            $stmt->bindValue(":subs_user_name_en", $subs_user_name_en, PDO::PARAM_STR);
          }
          $encodeEmail = _crypt($subs_user_email);
          $stmt->bindValue(":subs_user_email", $encodeEmail, PDO::PARAM_STR);
          $stmt->execute();
          $count = $stmt->fetchColumn();
          // 중복신청이면 리턴한다.
          if ($count > 0){
            // 메시지는 협의 후 처리, 중복 처리에 대한 리턴 코드 변경 필요 (200 -> ???)
            $rtnmessage = "이미 신청한 강의입니다."; 
            ReturnData(500, $cmd, $rtnmessage, $rtn_access_token, "", $conn);
            die();
          }

          $sql = "INSERT INTO " . TBL_SUSB_CALSS . " (class_idx, subs_class_time_idx, subs_user_name_ch, subs_user_name_en, subs_user_wechat, subs_company_position, subs_sex, subs_birth,";
          $sql = $sql . " subs_identity_number, subs_phone_number, subs_user_email, subs_user_zipcode, subs_ceo_name, subs_company_name_ch, subs_company_name_en, subs_company_name_ko,";
          $sql = $sql . " subs_company_address_ch, subs_company_address_en, subs_agent_name, subs_agent_manager, subs_agent_phone_number,";
          $sql = $sql . " subs_agent_email, subs_agent_wechat, subs_currency, subs_user_password, subs_depositor_name, subs_country, subs_type, subs_date)";
          $sql = $sql . " VALUES (:class_idx, :subs_class_time_idx, :subs_user_name_ch, :subs_user_name_en, :subs_user_wechat, :subs_company_position, :subs_sex, :subs_birth,";
          $sql = $sql . " :subs_identity_number, :subs_phone_number, :subs_user_email, :subs_user_zipcode, :subs_ceo_name, :subs_company_name_ch, :subs_company_name_en, :subs_company_name_ko,";
          $sql = $sql . " :subs_company_address_ch, :subs_company_address_en, :subs_agent_name, :subs_agent_manager, :subs_agent_phone_number,";
          $sql = $sql . " :subs_agent_email, :subs_agent_wechat, :subs_currency, :subs_user_password, :subs_depositor_name, :subs_country, :subs_type, now())";
          // PDO 준비
          //$conn->beginTransaction();
          $stmt = $conn->prepare($sql);
  
          // 파라미터 바인딩, ?로 할 경우 bindValue로 
          $stmt->bindValue(":class_idx", $class_idx, PDO::PARAM_INT);
          $stmt->bindValue(":subs_class_time_idx", $subs_class_time_idx, PDO::PARAM_INT);
          $stmt->bindValue(":subs_user_name_ch", $subs_user_name_ch, PDO::PARAM_STR);
          $stmt->bindValue(":subs_user_name_en", $subs_user_name_en, PDO::PARAM_STR);
          $stmt->bindValue(":subs_user_wechat", $subs_user_wechat, PDO::PARAM_STR);
          $stmt->bindValue(":subs_company_position", $subs_company_position, PDO::PARAM_STR);
          $stmt->bindValue(":subs_sex", $subs_sex, PDO::PARAM_INT);
          $stmt->bindValue(":subs_birth", $subs_birth, PDO::PARAM_INT);
  
          // 신분번호 암호화
          $cryptdata = "";
          $cryptdata = _crypt($subs_identity_number);
          $stmt->bindValue(":subs_identity_number", $cryptdata, PDO::PARAM_STR);
  
          // 전화번호 암호화
          $cryptdata = "";
          $cryptdata = _crypt($subs_phone_number);
          $stmt->bindValue(":subs_phone_number", $cryptdata, PDO::PARAM_STR);
  
          // 이메일 암호화
          $cryptdata = "";
          $cryptdata = _crypt($subs_user_email);
          $stmt->bindValue(":subs_user_email", $cryptdata, PDO::PARAM_STR);
  
          $stmt->bindValue(":subs_user_zipcode", $subs_user_zipcode, PDO::PARAM_STR);
          $stmt->bindValue(":subs_ceo_name", $subs_ceo_name, PDO::PARAM_STR);
          $stmt->bindValue(":subs_company_name_ch", $subs_company_name_ch, PDO::PARAM_STR);
          $stmt->bindValue(":subs_company_name_en", $subs_company_name_en, PDO::PARAM_STR);
          $stmt->bindValue(":subs_company_name_ko", $subs_company_name_ko, PDO::PARAM_STR);
          $stmt->bindValue(":subs_company_address_ch", $subs_company_address_ch, PDO::PARAM_STR);
          $stmt->bindValue(":subs_company_address_en", $subs_company_address_en, PDO::PARAM_STR);
          $stmt->bindValue(":subs_agent_name", $subs_agent_name, PDO::PARAM_STR);
          $stmt->bindValue(":subs_agent_manager", $subs_agent_manager, PDO::PARAM_STR);
          $stmt->bindValue(":subs_agent_phone_number", $subs_agent_phone_number, PDO::PARAM_STR);
          $stmt->bindValue(":subs_agent_email", $subs_agent_email, PDO::PARAM_STR);
          $stmt->bindValue(":subs_agent_wechat", $subs_agent_wechat, PDO::PARAM_STR);
          $stmt->bindValue(":subs_depositor_name", $subs_depositor_name, PDO::PARAM_STR);
          $stmt->bindValue(":subs_currency", $subs_currency, PDO::PARAM_STR);
  
          // 비밀번호 암호화
          $cryptdata = "";
          $cryptdata = hash("sha256", iso8859_1_to_utf8($subs_user_password));
          $stmt->bindValue(":subs_user_password", $cryptdata, PDO::PARAM_STR);
  
          $stmt->bindValue(":subs_country", $subs_country, PDO::PARAM_STR);
  
          // 수강신청 유형 (0 : 일반 신청, 1: 대기 신청)
          $stmt->bindValue(":subs_type", $subs_type, PDO::PARAM_STR);

          $stmt->execute();
          $count = $stmt->rowCount();
          if ($count == 1){
            $rtnmessage = "신청을 완료했습니다.";
            if ($subs_type == "1"){
              $rtnmessage = "신청을 완료했습니다.(인원수 초과로 대기 상태로 신청)";
            }
            ReturnData(200, $cmd, $rtnmessage, $rtn_access_token, "", $conn);
          }
          else{
              // $stmt->debugDumpParams();
              ReturnData(500, $cmd, $sql, $rtn_access_token, "", $conn);
          }
      }
      catch(PDOException $e){
          //$conn->rollback();
          ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }
      die();
        break;
    default:
      break;
  }

  // JWT LOGIN 체크
  if (!jwt_login($conn, TBL_MANAGER, $request_body, $rtn_access_token, $rtnmessage, $tokendata))
  {
    die();
  }

    // 페이지 처리 루틴
  $b_nowpage  = isset($request_body->p_nowpage) ? fn_URIString2($request_body->p_nowpage, "int", 1) : 1;
  // $b_loadcount가 -1일 경우 모두 출력한다.
  $b_loadcount = isset($request_body->p_loadcount) ?fn_URIString2($request_body->p_loadcount, "int", 10) : 0;
  // 시작 페이지가 0보다 작을 경우 0으로 설정, 읽어들일 개수물 시작점
  $b_startcount = ($b_nowpage-1) * $b_loadcount;
  if ($b_startcount < 0) { $b_startcount = 0;}

  // 검색 관련
  $b_searchdata = isset($request_body->p_searchdata) ? fn_URIString2($request_body->p_searchdata, "string", "") : "";
  
  switch ($cmd){
    case "login" :
    case "login_token" :
      $memdata["manager_id"] = $tokendata["manager_id"];
      $memdata["manager_name"] = $tokendata["manager_name"];
      $memdata["mem_level"] = $tokendata["mem_level"];
      ReturnData(200, $cmd, $rtnmessage, $rtn_access_token, $memdata, $conn);
      break;
    
      case "load_user_subs_info":                                  
        if (isset($request_body->subs_user_email) && isset($request_body->subs_user_password)){
          $subs_user_email = $request_body->subs_user_email;
          $subs_user_password = $request_body->subs_user_password;
        } 
        else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn_webzine);
          $conn_webzine = null;
          die();
        }
        try{
          $sql = "SELECT * FROM subs_class WHERE subs_user_email = :subs_user_email AND subs_user_password = :subs_user_password";
          $stmt = $conn->prepare($sql);
          $stmt->bindParam(":subs_user_email", $subs_user_email, PDO::PARAM_STR);
          $password_hash = hash("sha256", utf8_encode($subs_user_password));
          $stmt->bindParam('subs_user_password', $password_hash, PDO::PARAM_STR);
          //$stmt->debugDumpParams();
          $stmt->execute();
          //$stmt->debugDumpParams();
  
          $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
          if ($row){
            $data_array = $row;
            $result_data["tabledata"] = $data_array;
            ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          }else{
            $result_data["message"] = "일치하는 정보가 없습니다.";
            ReturnData(500, $cmd, $rtnmessage, "", $result_data, $conn);
          }
        }
        catch(PDOException $e){
            ReturnData(600, $cmd, $e->getMessage(), "", "", $conn);
        }
        die();
      break;    
    case "admin_regen_userpassword" :
      if (isset($request_body->idx) && isset($request_body->manager_id)
        && isset($request_body->manager_email)
      ) {
        $param->idx = $request_body->idx;
        $param->manager_id = $request_body->manager_id;
        $param->mem_id = $request_body->manager_id;
        $param->manager_email = $request_body->manager_email;
        $param->cmd = $cmd;
      }
      else{
        ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
        die();
      } 
      $param->table_name = TBL_MANAGER;
      $regenpassword = "";
      if (admin_regen_password($param, $conn, "", $regenpassword)){
        // 비밀번호 재발행 후 메일 발송      
        $title = "[한국표준협회] 비밀번호 재설정되었습니다.";
        $mail_html = get_mail_body($param,  $regenpassword);
        $sendresult = "";
        // sendmail.php 파일내의 메일 본문 생성 함수 변경 (get_mail_body)
        $sendresult = sendMail(SMTP_SERVER, SMTP_PORT, FROM_MAIL, FROM_MAIL_PASS, FROM_NAME,
              $param->manager_email, $title, $mail_html);
        if ($sendresult == "ok"){
          ReturnData(200, $param->cmd, "", "", "", $conn);
        }
        else{
          ReturnData(500, $param->cmd, $sendresult, "", "", $conn);
        }
      }
      die();
      break;
    case "change_password" :
        if (isset($request_body->manager_id) && isset($request_body->before_pw)
          && isset($request_body->manager_pw)
        ) {
          $manager_id = $request_body->manager_id;
          $before_pw = $request_body->before_pw;
          $manager_pw = $request_body->manager_pw;
        }
        else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
        } 
        try{
          $sql = "SELECT * FROM manager WHERE manager_id = :manager_id AND manager_password = :before_pw";
          $stmt = $conn->prepare($sql);
          $change_password = hash("sha256", iso8859_1_to_utf8($before_pw));
          $stmt->bindValue(":manager_id", $manager_id, PDO::PARAM_STR);
          $stmt->bindValue(":before_pw", $change_password, PDO::PARAM_STR);
          $stmt->execute();
          $count = $stmt->rowCount();
          if ($count < 1){
            // 비밀번호가 동일한지 비교
            ReturnData(500, $cmd, "비밀번호가 일치하지 않습니다.", "", "", $conn);
            return false;
          }else{
            $sql = "UPDATE manager SET manager_password = :manager_password WHERE manager_id = :manager_id";
            $stmt = $conn->prepare($sql);
            $change_password = hash("sha256", iso8859_1_to_utf8($manager_pw));
            $stmt->bindValue('manager_id', $manager_id, PDO::PARAM_STR);
            $stmt->bindValue('manager_password', $change_password, PDO::PARAM_STR);
            $stmt->execute();
            $count = $stmt->rowCount();
            if ($count > 0){
              ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
            }else{
              ReturnData(501, $cmd, "업데이트 항목이 없거나 처리중 오류가 발생했습니다.", 
                        $rtn_access_token, "", $conn);
              die();  
            }
          }
        }catch(PDOException $e){
          ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
        }

      die();
      break;
      case "load_subs_list":                                  
        try {
          $sql = "SELECT a.*, b.class_name_ch, b.class_manager_ch, b.class_manager_en, b.class_info_tel, b.class_info_fax, ";
          $sql = $sql . "b.class_info_email, b.class_name_en, b.pay_dal_ch, b.pay_ch_ch, b.pay_kr_en, b.pay_en_en, c.class_time,";
          $sql = $sql . "b.pay_dal_ch_1, b.	pay_ch_ch_1, c.class_type";
          $sql .= " FROM subs_class as a";
          $sql .= " LEFT JOIN class_info as b ON a.class_idx = b.idx";
          $sql .= " LEFT JOIN class_time as c ON a.subs_class_time_idx = c.idx ORDER BY a.idx DESC";
          $stmt = $conn->prepare($sql);
          $stmt->execute();
      
          $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
          if ($rows) {
              $data_array = $rows;
              foreach ($data_array as &$value) {
                  // Decrypting encrypted values
                  $emaildecode = $value['subs_user_email'];
                  $temEmailRtn = _crypt($emaildecode, 'd');
                  $value['subs_user_email'] = $temEmailRtn;
      
                  $phoedecode = $value['subs_phone_number'];
                  $temPhoneRtn = _crypt($phoedecode, 'd');
                  $value['subs_phone_number'] = $temPhoneRtn;
      
                  $idendecode = $value['subs_identity_number'];
                  $tempidenRtn = _crypt($idendecode, 'd');
                  $value['subs_identity_number'] = $tempidenRtn;
              }
              $result_data["tabledata"] = $data_array;
              ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          } else {
              $result_data["message"] = "데이터가 없습니다.";
              ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          }
        } catch (PDOException $e) {
            ReturnData(600, $cmd, $e->getMessage(), "", "", $conn);
        }
        die();
      case "load_member_list":                                  
        try {
          $sql = "SELECT * FROM manager ORDER BY idx DESC";
          $stmt = $conn->prepare($sql);
          $stmt->execute();
      
          $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
          if ($rows) {
              $data_array = $rows;
              foreach ($data_array as &$value) {
                // Decrypting encrypted values
                $emaildecode = $value['manager_email'];
                if($emaildecode){
                  $temEmailRtn = _crypt($emaildecode, 'd');
                  $value['manager_email'] = $temEmailRtn;
                }
             
            }
              $result_data["tabledata"] = $data_array;
              ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          } else {
              $result_data["message"] = "유저가 없습니다.";
              ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          }
        } catch (PDOException $e) {
            ReturnData(600, $cmd, $e->getMessage(), "", "", $conn);
        }
        die();
      break;    
      case "load_down_list":                                  
        try {
          $sql = "SELECT * FROM log_download ORDER BY idx DESC";
          $stmt = $conn->prepare($sql);
          $stmt->execute();
      
          $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
          if ($rows) {
              $data_array = $rows;
              $result_data["tabledata"] = $data_array;
              ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          } else {
              $result_data["message"] = "다운로드 리스트가 없습니다.";
              ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          }
        } catch (PDOException $e) {
            ReturnData(600, $cmd, $e->getMessage(), "", "", $conn);
        }
        die();
      break;    
      case "load_class_time_admin":                                  
        try{
          $sql = "SELECT * FROM class_time ORDER BY class_lang, class_time ASC";
          $stmt = $conn->prepare($sql);
          //$stmt->debugDumpParams();
          $stmt->execute();
          //$stmt->debugDumpParams();
  
          $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
          if ($row){
            $data_array = $row;
            $result_data["tabledata"] = $data_array;
            ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          }else{
            $result_data["message"] = "일치하는 정보가 없습니다.";
            ReturnData(200, $cmd, $rtnmessage, "", $result_data, $conn);
          }
        }
        catch(PDOException $e){
            ReturnData(600, $cmd, $e->getMessage(), "", "", $conn);
        }
        die();
      break;    
    case "insert_member" : // 관리자 계정 추가
      if ( isset($request_body->manager_id) && isset($request_body->manager_password) 
      && isset($request_body->manager_name) && isset($request_body->mem_level)
      && isset($request_body->manager_email) 
      ){
        $manager_id = $request_body->manager_id;
        $manager_email = $request_body->manager_email;
        $manager_password = $request_body->manager_password;
        $manager_name = $request_body->manager_name;
        $mem_level = $request_body->mem_level;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
  
      try{
          // 동일한 정보가 존재하는지 확인한다.
          $sql = "SELECT COUNT(manager_id) as cnt FROM manager WHERE manager_id = '" . $manager_id . "'";
          $stmt = $conn->prepare($sql);
          $stmt->execute();
          $resultcount = $stmt->fetchColumn();
          if ($resultcount > 0){
              ReturnData(500, $cmd, "해당 아이디는 이미 사용중입니다.", $rtn_access_token, "", $conn);
              die();    
          }

          $cryptdata = "";
          $cryptdata = _crypt($manager_email);

          $sql = "SELECT COUNT(manager_email) as cnt FROM manager WHERE manager_email = '" . $cryptdata . "'";
          $stmt = $conn->prepare($sql);
          $stmt->execute();
          $resultcount = $stmt->fetchColumn();
          if ($resultcount > 0){
              ReturnData(500, $cmd, "해당 이메일은 이미 사용중입니다.", $rtn_access_token, "", $conn);
              die();    
          }

          if ($manager_id == 'admin'){
            ReturnData(500, $param->cmd, "허용되지 않는 아이디입니다.", "", "", $dbcon);
            die();   
          }
  
          // 주의 : PDO를 사용할 경우 Update가 일어나지 않을 경우 rowCount는 0을 반환 (mysql에서 동일한 값이 있을 경우 0을 반환한다.)
          $sql = "INSERT INTO manager (manager_id, manager_password, manager_name, manager_email, mem_level)";
          $sql = $sql .  " VALUES (:manager_id, :manager_password, :manager_name, :manager_email, :mem_level)";
          // PDO 준비
          //$conn->beginTransaction();
          $stmt = $conn->prepare($sql);
  
          // 파라미터 바인딩, ?로 할 경우 bindValue로 
          $stmt->bindValue(":manager_id", $manager_id, PDO::PARAM_STR);

          $change_password = hash("sha256", iso8859_1_to_utf8($manager_password));
          $stmt->bindValue(":manager_password", $change_password, PDO::PARAM_STR);
  
          $stmt->bindValue(":manager_name", $manager_name, PDO::PARAM_STR);
          
          $cryptdata = "";
          $cryptdata = _crypt($manager_email);
          $stmt->bindValue(":manager_email", $cryptdata, PDO::PARAM_STR);
          $stmt->bindValue(":mem_level", $mem_level, PDO::PARAM_INT);
  
          $stmt->execute();
          $count = $stmt->rowCount();
          if ($count == 1){
              //$conn->commit();
              ReturnData(200, $cmd, "", $rtn_access_token, "", $conn);
          }
          else{
              // $stmt->debugDumpParams();
              ReturnData(500, $cmd, $sql, $rtn_access_token, "", $conn);
          }
      }
      catch(PDOException $e){
          //$conn->rollback();
          ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }
      die();
        break;
    case "insert_class_time" : // 관리자 계정 추가
      if ( isset($request_body->class_idx) && isset($request_body->class_lang) 
      && isset($request_body->class_max_count) && isset($request_body->class_time)
      && isset($request_body->class_type) && isset($request_body->class_type)
      ){
        $class_idx = $request_body->class_idx;
        $class_lang = $request_body->class_lang;
        $class_place = $request_body->class_place;
        $class_max_count = $request_body->class_max_count;
        $class_time = $request_body->class_time;
        $class_type = $request_body->class_type;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
  
      try{

          // 동일한 정보가 있는지 확인
          $sql = "SELECT COUNT(idx) as cnt FROM class_time WHERE class_idx = :class_idx AND class_time = :class_time";
          $stmt = $conn->prepare($sql);
          $stmt->bindValue(":class_idx", $class_idx, PDO::PARAM_INT);
          $stmt->bindValue(":class_time", $class_time, PDO::PARAM_STR);
          $stmt->execute();
          $resultcount = $stmt->fetchColumn();
          if ($resultcount > 0){
              ReturnData(500, $cmd, "해당 교육시간은 이미 등록되어있습니다.", $rtn_access_token, "", $conn);
              die();    
          }


          // 주의 : PDO를 사용할 경우 Update가 일어나지 않을 경우 rowCount는 0을 반환 (mysql에서 동일한 값이 있을 경우 0을 반환한다.)
          $sql = "INSERT INTO class_time (class_idx, class_time, class_lang, class_place, class_max_count, class_type)";
          $sql = $sql .  " VALUES (:class_idx, :class_time, :class_lang, :class_place, :class_max_count, :class_type)";
          // PDO 준비
          //$conn->beginTransaction();
          $stmt = $conn->prepare($sql);
  
          // 파라미터 바인딩, ?로 할 경우 bindValue로 
          $stmt->bindValue(":class_idx", $class_idx, PDO::PARAM_INT);
          $stmt->bindValue(":class_time", $class_time, PDO::PARAM_STR);
          $stmt->bindValue(":class_lang", $class_lang, PDO::PARAM_STR);
          $stmt->bindValue(":class_place", $class_place, PDO::PARAM_STR);
          $stmt->bindValue(":class_max_count", $class_max_count, PDO::PARAM_INT);
          $stmt->bindValue(":class_type", $class_type, PDO::PARAM_INT);

  
          $stmt->execute();
          $count = $stmt->rowCount();
          if ($count == 1){
              //$conn->commit();
              ReturnData(200, $cmd, "", $rtn_access_token, "", $conn);
          }
          else{
              // $stmt->debugDumpParams();
              ReturnData(500, $cmd, $sql, $rtn_access_token, "", $conn);
          }
      }
      catch(PDOException $e){
          //$conn->rollback();
          ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }
      die();
        break;
    case "download_excel" : // 엑셀 다운로드 로그
      if ( isset($request_body->manager_id) && isset($request_body->download_filename)
      && isset($request_body->manager_name)
      ){
        $manager_id = $request_body->manager_id;
        $download_filename = $request_body->download_filename;
        $manager_name = $request_body->manager_name;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
  
      try{
          // 주의 : PDO를 사용할 경우 Update가 일어나지 않을 경우 rowCount는 0을 반환 (mysql에서 동일한 값이 있을 경우 0을 반환한다.)
          $sql = "INSERT INTO log_download (manager_id, manager_name, download_filename, 	download_date, sql_data)";
          $sql = $sql .  " VALUES (:manager_id, :manager_name, :download_filename, now(), :sql_data)";
          // PDO 준비
          //$conn->beginTransaction();
          $stmt = $conn->prepare($sql);
  
          // 파라미터 바인딩, ?로 할 경우 bindValue로 
          $stmt->bindValue(":manager_id", $manager_id, PDO::PARAM_STR);
          $stmt->bindValue(":manager_name", $manager_name, PDO::PARAM_STR);
          $stmt->bindValue(":download_filename", $download_filename, PDO::PARAM_STR);
          $stmt->bindValue(":sql_data", $sql, PDO::PARAM_STR);

  
          $stmt->execute();
          $count = $stmt->rowCount();
          if ($count == 1){
              //$conn->commit();
              ReturnData(200, $cmd, "", $rtn_access_token, "", $conn);
          }
          else{
              // $stmt->debugDumpParams();
              ReturnData(500, $cmd, $sql, $rtn_access_token, "", $conn);
          }
      }
      catch(PDOException $e){
          //$conn->rollback();
          ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }
      die();
        break;
    case "upload_file" :
      $class_img_ch = isset($_POST['class_img_ch']) ? $_POST['class_img_ch'] : "";
      $class_img_en = isset($_POST['class_img_en']) ? $_POST['class_img_en'] : "";
      $uploadDirectory = '../images/class/';

      $rtnValue = true;
      if (!empty($_FILES['class_img_ch']['name'])) {
        $rtnValue = handleFileUpload($uploadDirectory, $_FILES['class_img_ch'], "class_img_ch");
      }
      if (!empty($_FILES['class_img_en']['name'])) {
        $rtnValue = handleFileUpload($uploadDirectory, $_FILES['class_img_en'], "class_img_en");
      }
      if($rtnValue){
        ReturnData(200, $cmd, "파일 업로드가 정상적으로 완료되었습니다.", $rtn_access_token, "", $conn);
        die(); 
      }else{
        ReturnData(500, $cmd, "파일 업로드 도중 에러가 발생하였습니다.", $rtn_access_token, "", $conn);
        die();  
      }
      break;
    case "insert_class_info" : // 교육 정보 추가
      if ( isset($request_body->class_name_ko) && isset($request_body->class_name_ch) 
      && isset($request_body->class_name_en) && isset($request_body->class_manager_ch)
      && isset($request_body->class_manager_en) && isset($request_body->class_info_tel)
      && isset($request_body->class_info_fax) && isset($request_body->class_info_email)
      && isset($request_body->pay_en_en) && isset($request_body->pay_kr_en)
      && isset($request_body->pay_dal_ch) && isset($request_body->pay_ch_ch)
      && isset($request_body->pay_dal_ch_1) && isset($request_body->pay_ch_ch_1)
      && isset($request_body->class_cost_info_ko) && isset($request_body->class_cost_method_info_ko)
      && isset($request_body->class_schedule_info_ko) && isset($request_body->class_method_info_ko)
      && isset($request_body->class_content_info_ko) 
      && isset($request_body->class_cost_info_ch) && isset($request_body->class_cost_method_info_ch)
      && isset($request_body->class_schedule_info_ch) && isset($request_body->class_method_info_ch)
      && isset($request_body->class_content_info_ch) 
      && isset($request_body->class_cost_info_ko) && isset($request_body->class_cost_method_info_ko)
      && isset($request_body->class_schedule_info_en) && isset($request_body->class_method_info_en)
      && isset($request_body->class_content_info_en) && isset($request_body->class_img_ch) 
      && isset($request_body->class_img_en) && isset($request_body->class_active) 
      && isset($request_body->view_order) 
      ){
        $class_name_ko = $request_body->class_name_ko;
        $class_name_ch = $request_body->class_name_ch;
        $class_name_en = $request_body->class_name_en;
        $class_manager_ch = $request_body->class_manager_ch;
        $class_manager_en = $request_body->class_manager_en;
        $class_info_tel = $request_body->class_info_tel;
        $class_info_fax = $request_body->class_info_fax;
        $class_info_email = $request_body->class_info_email;
        $pay_en_en = $request_body->pay_en_en;
        $pay_kr_en = $request_body->pay_kr_en;
        $pay_dal_ch = $request_body->pay_dal_ch;
        $pay_ch_ch = $request_body->pay_ch_ch;
        $pay_dal_ch_1 = $request_body->pay_dal_ch_1;
        $pay_ch_ch_1 = $request_body->pay_ch_ch_1;
        $class_img_ch = $request_body->class_img_ch;
        $class_img_en = $request_body->class_img_en;

        $view_order = $request_body->view_order;
        $class_active = $request_body->class_active;

        $class_cost_info_ko = $request_body->class_cost_info_ko;
        $class_cost_method_info_ko = $request_body->class_cost_method_info_ko;
        $class_schedule_info_ko = $request_body->class_schedule_info_ko;
        $class_method_info_ko = $request_body->class_method_info_ko;
        $class_content_info_ko = $request_body->class_content_info_ko;

        $class_cost_info_ch = $request_body->class_cost_info_ch;
        $class_cost_method_info_ch = $request_body->class_cost_method_info_ch;
        $class_schedule_info_ch = $request_body->class_schedule_info_ch;
        $class_method_info_ch = $request_body->class_method_info_ch;
        $class_content_info_ch = $request_body->class_content_info_ch;

        $class_cost_info_en = $request_body->class_cost_info_en;
        $class_cost_method_info_en = $request_body->class_cost_method_info_en;
        $class_schedule_info_en = $request_body->class_schedule_info_en;
        $class_method_info_en = $request_body->class_method_info_en;
        $class_content_info_en = $request_body->class_content_info_en;


      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
  
      try{

          // 동일한 정보가 있는지 확인
          $sql = "SELECT COUNT(idx) as cnt FROM class_info WHERE ";
          $sql = $sql . "class_name_ko = :class_name_ko AND";
          $sql = $sql . " class_name_ch = :class_name_ch AND";
          $sql = $sql . " class_name_en = :class_name_en";
          $stmt = $conn->prepare($sql);
          $stmt->bindValue(":class_name_ko", $class_name_ko, PDO::PARAM_STR);
          $stmt->bindValue(":class_name_ch", $class_name_ch, PDO::PARAM_STR);
          $stmt->bindValue(":class_name_en", $class_name_en, PDO::PARAM_STR);
          $stmt->execute();
          $resultcount = $stmt->fetchColumn();
          if ($resultcount > 0){
              ReturnData(500, $cmd, "해당 교육은 이미 등록되어있습니다.", $rtn_access_token, "", $conn);
              die();    
          }

          $sql = "SELECT COUNT(idx) as cnt FROM class_info WHERE ";
          $sql = $sql . "class_name_ko = :class_name_ko";
          $stmt = $conn->prepare($sql);
          $stmt->bindValue(":class_name_ko", $class_name_ko, PDO::PARAM_STR);
          $stmt->execute();
          $resultcount = $stmt->fetchColumn();
          if ($resultcount > 0){
              ReturnData(500, $cmd, "동일한 교육과정명(국문)이 이미 등록되어있습니다.", $rtn_access_token, "", $conn);
              die();    
          }


          // 주의 : PDO를 사용할 경우 Update가 일어나지 않을 경우 rowCount는 0을 반환 (mysql에서 동일한 값이 있을 경우 0을 반환한다.)
          $sql = "INSERT INTO class_info (class_name_ko, class_name_ch, class_name_en, class_manager_ch, class_manager_en,";
          $sql = $sql . " class_info_tel, class_info_fax, class_info_email, pay_en_en, pay_kr_en, pay_dal_ch, pay_ch_ch, pay_dal_ch_1, pay_ch_ch_1, class_img_ch, class_img_en,";
          $sql = $sql . " view_order, class_active,";
          $sql = $sql . " class_cost_info_ko,";
          $sql = $sql . " class_cost_method_info_ko,";
          $sql = $sql . " class_schedule_info_ko,";
          $sql = $sql . " class_method_info_ko,";
          $sql = $sql . " class_content_info_ko,";

          $sql = $sql . " class_cost_info_ch,";
          $sql = $sql . " class_cost_method_info_ch,";
          $sql = $sql . " class_schedule_info_ch,";
          $sql = $sql . " class_method_info_ch,";
          $sql = $sql . " class_content_info_ch,";

          $sql = $sql . " class_cost_info_en,";
          $sql = $sql . " class_cost_method_info_en,";
          $sql = $sql . " class_schedule_info_en,";
          $sql = $sql . " class_method_info_en,";
          $sql = $sql . " class_content_info_en";

          $sql = $sql . " )";
          $sql = $sql . " VALUES (:class_name_ko, :class_name_ch, :class_name_en, :class_manager_ch, :class_manager_en,";
          $sql = $sql . " :class_info_tel, :class_info_fax, :class_info_email, :pay_en_en, :pay_kr_en, :pay_dal_ch, :pay_ch_ch, :pay_dal_ch_1, :pay_ch_ch_1, :class_img_ch, :class_img_en,";
          $sql = $sql . " :view_order, :class_active,";
          $sql = $sql . " :class_cost_info_ko,";
          $sql = $sql . " :class_cost_method_info_ko,";
          $sql = $sql . " :class_schedule_info_ko,";
          $sql = $sql . " :class_method_info_ko,";
          $sql = $sql . " :class_content_info_ko,";

          $sql = $sql . " :class_cost_info_ch,";
          $sql = $sql . " :class_cost_method_info_ch,";
          $sql = $sql . " :class_schedule_info_ch,";
          $sql = $sql . " :class_method_info_ch,";
          $sql = $sql . " :class_content_info_ch,";

          $sql = $sql . " :class_cost_info_en,";
          $sql = $sql . " :class_cost_method_info_en,";
          $sql = $sql . " :class_schedule_info_en,";
          $sql = $sql . " :class_method_info_en,";
          $sql = $sql . " :class_content_info_en";

          $sql = $sql . " )";
          // PDO 준비
          //$conn->beginTransaction();
          $stmt = $conn->prepare($sql);
  
          // 파라미터 바인딩, ?로 할 경우 bindValue로 
          $stmt->bindValue(":class_name_ko", $class_name_ko, PDO::PARAM_STR);
          $stmt->bindValue(":class_name_ch", $class_name_ch, PDO::PARAM_STR);
          $stmt->bindValue(":class_name_en", $class_name_en, PDO::PARAM_STR);
          $stmt->bindValue(":class_manager_ch", $class_manager_ch, PDO::PARAM_STR);
          $stmt->bindValue(":class_manager_en", $class_manager_en, PDO::PARAM_STR);
          $stmt->bindValue(":class_info_tel", $class_info_tel, PDO::PARAM_STR);
          $stmt->bindValue(":class_info_fax", $class_info_fax, PDO::PARAM_STR);
          $stmt->bindValue(":class_info_email", $class_info_email, PDO::PARAM_STR);
          $stmt->bindValue(":pay_en_en", $pay_en_en, PDO::PARAM_INT);
          $stmt->bindValue(":pay_kr_en", $pay_kr_en, PDO::PARAM_INT);
          $stmt->bindValue(":pay_dal_ch", $pay_dal_ch, PDO::PARAM_INT);
          $stmt->bindValue(":pay_ch_ch", $pay_ch_ch, PDO::PARAM_INT);
          $stmt->bindValue(":pay_dal_ch_1", $pay_dal_ch_1, PDO::PARAM_INT);
          $stmt->bindValue(":pay_ch_ch_1", $pay_ch_ch_1, PDO::PARAM_INT);
          $stmt->bindValue(":class_img_ch", $class_img_ch, PDO::PARAM_STR);
          $stmt->bindValue(":class_img_en", $class_img_en, PDO::PARAM_STR);
          $stmt->bindValue(":view_order", $view_order, PDO::PARAM_INT);
          $stmt->bindValue(":class_active", $class_active, PDO::PARAM_STR);

          $stmt->bindValue(":class_cost_info_ko", $class_cost_info_ko, PDO::PARAM_STR);
          $stmt->bindValue(":class_cost_method_info_ko", $class_cost_method_info_ko, PDO::PARAM_STR);
          $stmt->bindValue(":class_schedule_info_ko", $class_schedule_info_ko, PDO::PARAM_STR);
          $stmt->bindValue(":class_method_info_ko", $class_method_info_ko, PDO::PARAM_STR);
          $stmt->bindValue(":class_content_info_ko", $class_content_info_ko, PDO::PARAM_STR);
  
          $stmt->bindValue(":class_cost_info_ch", $class_cost_info_ch, PDO::PARAM_STR);
          $stmt->bindValue(":class_cost_method_info_ch", $class_cost_method_info_ch, PDO::PARAM_STR);
          $stmt->bindValue(":class_schedule_info_ch", $class_schedule_info_ch, PDO::PARAM_STR);
          $stmt->bindValue(":class_method_info_ch", $class_method_info_ch, PDO::PARAM_STR);
          $stmt->bindValue(":class_content_info_ch", $class_content_info_ch, PDO::PARAM_STR);

          $stmt->bindValue(":class_cost_info_en", $class_cost_info_en, PDO::PARAM_STR);
          $stmt->bindValue(":class_cost_method_info_en", $class_cost_method_info_en, PDO::PARAM_STR);
          $stmt->bindValue(":class_schedule_info_en", $class_schedule_info_en, PDO::PARAM_STR);
          $stmt->bindValue(":class_method_info_en", $class_method_info_en, PDO::PARAM_STR);
          $stmt->bindValue(":class_content_info_en", $class_content_info_en, PDO::PARAM_STR);


          $stmt->execute();
          $count = $stmt->rowCount();
          if ($count == 1){
              //$conn->commit();
              ReturnData(200, $cmd, "", $rtn_access_token, "", $conn);
          }
          else{
              // $stmt->debugDumpParams();
              ReturnData(500, $cmd, $sql, $rtn_access_token, "", $conn);
          }
      }
      catch(PDOException $e){
          //$conn->rollback();
          ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }
      die();
        break;
    case "update_class_time" : 
      if ( isset($request_body->idx) && isset($request_body->class_lang) 
      && isset($request_body->class_max_count) && isset($request_body->class_time)
      && isset($request_body->class_idx) && isset($request_body->class_type)
      && isset($request_body->class_place)
      ){
        $idx = $request_body->idx;
        $class_lang = $request_body->class_lang;
        $class_max_count = $request_body->class_max_count;
        $class_time = $request_body->class_time;
        $class_idx = $request_body->class_idx;
        $class_type = $request_body->class_type;
        $class_place = $request_body->class_place;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
          // 동일한 정보가 있는지 확인
          $sql = "SELECT COUNT(idx) as cnt FROM class_time WHERE";
          $sql = $sql . " class_idx = :class_idx AND";
          $sql = $sql . " class_time = :class_time AND";
          $sql = $sql . " class_type = :class_type AND";
          $sql = $sql . " class_place = :class_place AND";
          $sql = $sql . " class_max_count = :class_max_count";
          $stmt = $conn->prepare($sql);
          $stmt->bindValue(":class_idx", $class_idx, PDO::PARAM_INT);
          $stmt->bindValue(":class_time", $class_time, PDO::PARAM_STR);
          $stmt->bindValue(":class_place", $class_place, PDO::PARAM_STR);
          $stmt->bindValue(":class_max_count", $class_max_count, PDO::PARAM_INT);
          $stmt->bindValue(":class_type", $class_type, PDO::PARAM_INT);
          $stmt->execute();
          $resultcount = $stmt->fetchColumn();
          if ($resultcount > 0){
              ReturnData(500, $cmd, "해당 교육시간은 이미 등록되어있습니다.", $rtn_access_token, "", $conn);
              die();    
          }

        $sql = "UPDATE class_time SET class_lang = :class_lang,";
        $sql = $sql . " class_time = :class_time,";
        $sql = $sql . " class_max_count = :class_max_count,";
        $sql = $sql . " class_place = :class_place,";
        $sql = $sql . " class_type = :class_type";
        $sql = $sql . " WHERE idx = :idx";
        $stmt = $conn->prepare($sql);
  
        $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
        $stmt->bindValue(":class_lang", $class_lang, PDO::PARAM_STR);
        $stmt->bindValue(":class_time", $class_time, PDO::PARAM_STR);
        $stmt->bindValue(":class_place", $class_place, PDO::PARAM_STR);
        $stmt->bindValue(":class_max_count", $class_max_count, PDO::PARAM_INT);
        $stmt->bindValue(":class_type", $class_type, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->rowCount();
        if ($count > 0){
          ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
        }
        else{
          ReturnData(501, $cmd, "업데이트 항목이 없거나 처리중 오류가 발생했습니다.", 
                    $rtn_access_token, "", $conn);
          die();  
        }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    case "update_member" : 
      if ( isset($request_body->idx) && isset($request_body->manager_id) 
      && isset($request_body->manager_name) && isset($request_body->mem_level)
      && isset($request_body->manager_email)
      ){
        $idx = $request_body->idx;
        $manager_id = $request_body->manager_id;
        $manager_name = $request_body->manager_name;
        $manager_email = $request_body->manager_email;
        $mem_level = $request_body->mem_level;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{

        $sql = "UPDATE manager SET manager_id = :manager_id,";
        $sql = $sql . " manager_name = :manager_name,";
        $sql = $sql . " manager_email = :manager_email,";
        $sql = $sql . " mem_level = :mem_level";
        $sql = $sql . " WHERE idx = :idx";
        $stmt = $conn->prepare($sql);
  
        $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
        $stmt->bindValue(":manager_id", $manager_id, PDO::PARAM_STR);
        $stmt->bindValue(":manager_name", $manager_name, PDO::PARAM_STR);
        $cryptdata = "";
        $cryptdata = _crypt($manager_email);
        $stmt->bindValue(":manager_email", $cryptdata, PDO::PARAM_STR);
        $stmt->bindValue(":mem_level", $mem_level, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->rowCount();
        if ($count > 0){
          ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
        }
        else{
          ReturnData(501, $cmd, "업데이트 항목이 없거나 처리중 오류가 발생했습니다.", 
                    $rtn_access_token, "", $conn);
          die();  
        }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    case "update_class_info" : 
      if ( isset($request_body->idx) && isset($request_body->class_name_ko) 
      && isset($request_body->class_name_ch) && isset($request_body->class_name_en)
      && isset($request_body->class_manager_ch) && isset($request_body->class_manager_en) 
      && isset($request_body->class_info_tel) && isset($request_body->class_info_fax) 
      && isset($request_body->class_info_email) && isset($request_body->pay_en_en) 
      && isset($request_body->pay_kr_en) && isset($request_body->pay_dal_ch) 
      && isset($request_body->pay_ch_ch) && isset($request_body->pay_dal_ch_1)
      && isset($request_body->pay_ch_ch_1)
      && isset($request_body->class_cost_info_ko) && isset($request_body->class_cost_method_info_ko)
      && isset($request_body->class_schedule_info_ko) && isset($request_body->class_method_info_ko)
      && isset($request_body->class_content_info_ko) 
      && isset($request_body->class_cost_info_ch) && isset($request_body->class_cost_method_info_ch)
      && isset($request_body->class_schedule_info_ch) && isset($request_body->class_method_info_ch)
      && isset($request_body->class_content_info_ch) 
      && isset($request_body->class_cost_info_ko) && isset($request_body->class_cost_method_info_ko)
      && isset($request_body->class_schedule_info_en) && isset($request_body->class_method_info_en)
      && isset($request_body->class_content_info_en) && isset($request_body->class_img_ch) 
      && isset($request_body->class_img_en) && isset($request_body->class_active) 
      && isset($request_body->view_order) 
      ){
        $idx = $request_body->idx;
        $class_name_ko = $request_body->class_name_ko;
        $class_name_ch = $request_body->class_name_ch;
        $class_name_en = $request_body->class_name_en;
        $class_manager_ch = $request_body->class_manager_ch;
        $class_manager_en = $request_body->class_manager_en;
        $class_info_tel = $request_body->class_info_tel;
        $class_info_fax = $request_body->class_info_fax;
        $class_info_email = $request_body->class_info_email;
        $pay_en_en = $request_body->pay_en_en;
        $pay_kr_en = $request_body->pay_kr_en;
        $pay_dal_ch = $request_body->pay_dal_ch;
        $pay_ch_ch = $request_body->pay_ch_ch;
        $pay_dal_ch_1 = $request_body->pay_dal_ch_1;
        $pay_ch_ch_1 = $request_body->pay_ch_ch_1;
        $class_img_ch = $request_body->class_img_ch;
        $class_img_en = $request_body->class_img_en;
        $view_order = $request_body->view_order;
        $class_active = $request_body->class_active;


        $class_cost_info_ko = $request_body->class_cost_info_ko;
        $class_cost_method_info_ko = $request_body->class_cost_method_info_ko;
        $class_schedule_info_ko = $request_body->class_schedule_info_ko;
        $class_method_info_ko = $request_body->class_method_info_ko;
        $class_content_info_ko = $request_body->class_content_info_ko;

        $class_cost_info_ch = $request_body->class_cost_info_ch;
        $class_cost_method_info_ch = $request_body->class_cost_method_info_ch;
        $class_schedule_info_ch = $request_body->class_schedule_info_ch;
        $class_method_info_ch = $request_body->class_method_info_ch;
        $class_content_info_ch = $request_body->class_content_info_ch;

        $class_cost_info_en = $request_body->class_cost_info_en;
        $class_cost_method_info_en = $request_body->class_cost_method_info_en;
        $class_schedule_info_en = $request_body->class_schedule_info_en;
        $class_method_info_en = $request_body->class_method_info_en;
        $class_content_info_en = $request_body->class_content_info_en;

      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
          // 국문 과정명을 기준으로 처리
          // 과정명이 존재하면 수정 모드, 없으면 추가 모드
          $sql = "SELECT COUNT(idx) as cnt FROM class_info WHERE ";
          $sql = $sql . "class_name_ko = :class_name_ko";
          $stmt = $conn->prepare($sql);
          $stmt->bindValue(":class_name_ko", $class_name_ko, PDO::PARAM_STR);
          $stmt->execute();
          $resultcount = $stmt->fetchColumn();
          if ($resultcount > 0){
                  
            $sql = "UPDATE class_info SET class_name_ko = :class_name_ko,";
            $sql = $sql . " class_name_ch = :class_name_ch,";
            $sql = $sql . " class_name_en = :class_name_en,";
            $sql = $sql . " class_manager_ch = :class_manager_ch,";
            $sql = $sql . " class_manager_en = :class_manager_en,";
            $sql = $sql . " class_info_tel = :class_info_tel,";
            $sql = $sql . " class_info_fax = :class_info_fax,";
            $sql = $sql . " class_info_email = :class_info_email,";
            $sql = $sql . " pay_en_en = :pay_en_en,";
            $sql = $sql . " pay_kr_en = :pay_kr_en,";
            $sql = $sql . " pay_dal_ch = :pay_dal_ch,";
            $sql = $sql . " pay_ch_ch = :pay_ch_ch,";
            $sql = $sql . " pay_dal_ch_1 = :pay_dal_ch_1,";
            $sql = $sql . " pay_ch_ch_1 = :pay_ch_ch_1, ";
            $sql = $sql . " class_img_ch = :class_img_ch, ";
            $sql = $sql . " class_img_en = :class_img_en, ";
            $sql = $sql . " view_order = :view_order, ";
            $sql = $sql . " class_active = :class_active, ";

            $sql = $sql . " class_cost_info_ko = :class_cost_info_ko,";
            $sql = $sql . " class_cost_method_info_ko = :class_cost_method_info_ko,";
            $sql = $sql . " class_schedule_info_ko = :class_schedule_info_ko,";
            $sql = $sql . " class_method_info_ko = :class_method_info_ko,";
            $sql = $sql . " class_content_info_ko = :class_content_info_ko,";

            $sql = $sql . " class_cost_info_ch = :class_cost_info_ch,";
            $sql = $sql . " class_cost_method_info_ch = :class_cost_method_info_ch,";
            $sql = $sql . " class_schedule_info_ch = :class_schedule_info_ch,";
            $sql = $sql . " class_method_info_ch = :class_method_info_ch,";
            $sql = $sql . " class_content_info_ch = :class_content_info_ch,";

            $sql = $sql . " class_cost_info_en = :class_cost_info_en,";
            $sql = $sql . " class_cost_method_info_en = :class_cost_method_info_en,";
            $sql = $sql . " class_schedule_info_en = :class_schedule_info_en,";
            $sql = $sql . " class_method_info_en = :class_method_info_en,";
            $sql = $sql . " class_content_info_en = :class_content_info_en";
            
            $sql = $sql . " WHERE idx = :idx";
            $stmt = $conn->prepare($sql);
      
            $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
            $stmt->bindValue(":class_name_ko", $class_name_ko, PDO::PARAM_STR);
            $stmt->bindValue(":class_name_ch", $class_name_ch, PDO::PARAM_STR);
            $stmt->bindValue(":class_name_en", $class_name_en, PDO::PARAM_STR);
            $stmt->bindValue(":class_manager_ch", $class_manager_ch, PDO::PARAM_STR);
            $stmt->bindValue(":class_manager_en", $class_manager_en, PDO::PARAM_STR);
            $stmt->bindValue(":class_info_tel", $class_info_tel, PDO::PARAM_STR);
            $stmt->bindValue(":class_info_fax", $class_info_fax, PDO::PARAM_STR);
            $stmt->bindValue(":class_info_email", $class_info_email, PDO::PARAM_STR);
            $stmt->bindValue(":pay_en_en", $pay_en_en, PDO::PARAM_INT);
            $stmt->bindValue(":pay_kr_en", $pay_kr_en, PDO::PARAM_INT);
            $stmt->bindValue(":pay_dal_ch", $pay_dal_ch, PDO::PARAM_INT);
            $stmt->bindValue(":pay_ch_ch", $pay_ch_ch, PDO::PARAM_INT);
            $stmt->bindValue(":pay_dal_ch_1", $pay_dal_ch_1, PDO::PARAM_INT);
            $stmt->bindValue(":pay_ch_ch_1", $pay_ch_ch_1, PDO::PARAM_INT);
            $stmt->bindValue(":class_img_ch", $class_img_ch, PDO::PARAM_STR);
            $stmt->bindValue(":class_img_en", $class_img_en, PDO::PARAM_STR);
            $stmt->bindValue(":view_order", $view_order, PDO::PARAM_STR);
            $stmt->bindValue(":class_active", $class_active, PDO::PARAM_STR);

            $stmt->bindValue(":class_cost_info_ko", $class_cost_info_ko, PDO::PARAM_STR);
            $stmt->bindValue(":class_cost_method_info_ko", $class_cost_method_info_ko, PDO::PARAM_STR);
            $stmt->bindValue(":class_schedule_info_ko", $class_schedule_info_ko, PDO::PARAM_STR);
            $stmt->bindValue(":class_method_info_ko", $class_method_info_ko, PDO::PARAM_STR);
            $stmt->bindValue(":class_content_info_ko", $class_content_info_ko, PDO::PARAM_STR);
    
            $stmt->bindValue(":class_cost_info_ch", $class_cost_info_ch, PDO::PARAM_STR);
            $stmt->bindValue(":class_cost_method_info_ch", $class_cost_method_info_ch, PDO::PARAM_STR);
            $stmt->bindValue(":class_schedule_info_ch", $class_schedule_info_ch, PDO::PARAM_STR);
            $stmt->bindValue(":class_method_info_ch", $class_method_info_ch, PDO::PARAM_STR);
            $stmt->bindValue(":class_content_info_ch", $class_content_info_ch, PDO::PARAM_STR);

            $stmt->bindValue(":class_cost_info_en", $class_cost_info_en, PDO::PARAM_STR);
            $stmt->bindValue(":class_cost_method_info_en", $class_cost_method_info_en, PDO::PARAM_STR);
            $stmt->bindValue(":class_schedule_info_en", $class_schedule_info_en, PDO::PARAM_STR);
            $stmt->bindValue(":class_method_info_en", $class_method_info_en, PDO::PARAM_STR);
            $stmt->bindValue(":class_content_info_en", $class_content_info_en, PDO::PARAM_STR);
            
            $stmt->execute();
            $count = $stmt->rowCount();
            if ($count > 0){
              ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
            }
            else{
              ReturnData(501, $cmd, "업데이트 항목이 없거나 처리중 오류가 발생했습니다.", 
                        $rtn_access_token, "", $conn);
              die();  
            }
          }
          else{
            ReturnData(501, $cmd, "업데이트할 과정이 존재하지 않습니다.<br>국문 과정명이 존재하는지 확인하세요.", 
                        $rtn_access_token, "", $conn);
            die();    
          }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    case "update_subs_class" : 
      if ( isset($request_body->idx) && isset($request_body->subs_deposit_date) 
      && isset($request_body->subs_remittance_amount) && isset($request_body->subs_take)
      && isset($request_body->subs_briefs) && isset($request_body->subs_slip_number)
      && isset($request_body->subs_bill) && isset($request_body->subs_sales_slip)
      && isset($request_body->subs_payment_manager_id) && isset($request_body->subs_type)
      ){
        $idx = $request_body->idx;
        $subs_deposit_date = $request_body->subs_deposit_date;
        $subs_remittance_amount = $request_body->subs_remittance_amount;
        $subs_take = $request_body->subs_take;
        $subs_briefs = $request_body->subs_briefs;
        $subs_slip_number = $request_body->subs_slip_number;
        $subs_bill = $request_body->subs_bill;
        $subs_sales_slip = $request_body->subs_sales_slip;
        $subs_payment_manager_id = $request_body->subs_payment_manager_id;
        $subs_type = $request_body->subs_type;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
        $subs_user_payment = !empty($subs_deposit_date) ? 1 : 0;
        $sql = "UPDATE subs_class SET subs_deposit_date = :subs_deposit_date,";
        $sql = $sql . " subs_remittance_amount = :subs_remittance_amount,";
        $sql = $sql . " subs_take = :subs_take,";
        $sql = $sql . " subs_briefs = :subs_briefs,";
        $sql = $sql . " subs_slip_number = :subs_slip_number,";
        $sql = $sql . " subs_bill = :subs_bill,";
        $sql = $sql . " subs_sales_slip = :subs_sales_slip,";
        $sql = $sql . " subs_payment_manager_id = :subs_payment_manager_id,";
        $sql = $sql . " subs_type = :subs_type,";
        $sql = $sql . "	subs_payment_date = now(),";
        $sql = $sql . " subs_user_payment = :subs_user_payment";
        $sql = $sql . " WHERE idx = :idx";
        $stmt = $conn->prepare($sql);
  
        $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
        $subs_deposit_date = !empty($subs_deposit_date) ? $subs_deposit_date : NULL;
        $stmt->bindValue(":subs_deposit_date", $subs_deposit_date, PDO::PARAM_STR);
        $stmt->bindValue(":subs_remittance_amount", $subs_remittance_amount, PDO::PARAM_INT);
        $stmt->bindValue(":subs_take", $subs_take, PDO::PARAM_INT);
        $stmt->bindValue(":subs_briefs", $subs_briefs, PDO::PARAM_STR);
        $stmt->bindValue(":subs_slip_number", $subs_slip_number, PDO::PARAM_STR);
        $stmt->bindValue(":subs_bill", $subs_bill, PDO::PARAM_STR);
        $stmt->bindValue(":subs_sales_slip", $subs_sales_slip, PDO::PARAM_STR);

        $stmt->bindValue(":subs_user_payment", $subs_user_payment, PDO::PARAM_INT);
        $stmt->bindValue(":subs_type", $subs_type, PDO::PARAM_INT);
        $stmt->bindValue(":subs_payment_manager_id", $subs_payment_manager_id, PDO::PARAM_STR);
        $stmt->execute();
        $count = $stmt->rowCount();
        if ($count > 0){
          ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
        }
        else{
          ReturnData(501, $cmd, "업데이트 항목이 없거나 처리중 오류가 발생했습니다.", 
                    $rtn_access_token, "", $conn);
          die();  
        }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    case "delete_user" : 
      if ( isset($request_body->idx)){
        $idx = $request_body->idx;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
        $sql = "DELETE FROM manager WHERE idx = :idx";
        $stmt = $conn->prepare($sql);
  
        $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->rowCount();
        if ($count > 0){
          ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
        }
        else{
          ReturnData(501, $cmd, "삭제 처리중 오류가 발생했습니다.", 
                    $rtn_access_token, "", $conn);
          die();  
        }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    case "delete_class_time" : 
      if ( isset($request_body->idx)){
        $idx = $request_body->idx;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
        $sql = "DELETE FROM class_time WHERE idx = :idx";
        $stmt = $conn->prepare($sql);
  
        $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->rowCount();
        if ($count > 0){
          ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
        }
        else{
          ReturnData(501, $cmd, "삭제 처리중 오류가 발생했습니다.", 
                    $rtn_access_token, "", $conn);
          die();  
        }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    case "delete_subs_class" : 
      if ( isset($request_body->idx)){
        $idx = $request_body->idx;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
        $sql = "UPDATE subs_class SET subs_delete = 1";
        $sql = $sql . " WHERE idx = :idx";
        $stmt = $conn->prepare($sql);
  
        $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->rowCount();
        if ($count > 0){
          ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
        }
        else{
          ReturnData(501, $cmd, "삭제 처리중 오류가 발생했습니다.", 
                    $rtn_access_token, "", $conn);
          die();  
        }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    case "delete_class_list" : 
      if ( isset($request_body->idx)){
        $idx = $request_body->idx;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
        $sql = "UPDATE class_info SET class_delete = 1";
        $sql = $sql . " WHERE idx = :idx";
        $stmt = $conn->prepare($sql);
  
        $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->rowCount();
        if ($count > 0){
          $sql = "DELETE FROM class_time WHERE class_idx = :idx";
          $stmt = $conn->prepare($sql);
  
          $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
          $stmt->execute();
          $count = $stmt->rowCount();
          if ($count > 0){
            ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
          }
          else{
            ReturnData(200, $cmd, "교육시간은 등록되어있지않아 교육정보만 삭제 되었습니다.", 
                      $rtn_access_token, "", $conn);
            die();  
          }
        }
        else{
          ReturnData(501, $cmd, "삭제 처리중 오류가 발생했습니다.", 
                    $rtn_access_token, "", $conn);
          die();  
        }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    case "delete_download" : 
      if ( isset($request_body->idx)){
        $idx = $request_body->idx;
      }
      else{
          ReturnData(500, $cmd, "파라미터 오류", "", "", $conn);
          die();
      }
      try{
        $sql = "DELETE FROM log_download WHERE idx = :idx";
        $stmt = $conn->prepare($sql);
  
        $stmt->bindValue(":idx", $idx, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->rowCount();
        if ($count > 0){
          ReturnData(200, $cmd, "", $rtn_access_token, "", $conn); 
        }
        else{
          ReturnData(501, $cmd, "삭제 처리중 오류가 발생했습니다.", 
                    $rtn_access_token, "", $conn);
          die();  
        }
      }catch (PDOException $e) {
        ReturnData(600, $cmd, $e->getMessage(), $rtn_access_token, "", $conn);
      }

      die();
        break;
    default;
      break;
  }


// 결과 데이터 리턴 함수
// status : 상태 코드
// cmd : 수행할 명령어
// message : 메시지
// atoken : access_token 
// data : 리턴될 데이터 (josn)
// $conn : 데이터베이스 connection
function ReturnData($status, $cmd, $message, $atoken, $data, $conn){
  $return_data = array();     // 결과값 리턴 배열 선언
  unset($return_data);
  $tmp_json["status"] = $status;
  $tmp_json["cmd"] = $cmd;
  $tmp_json["statusText"] = $message;
  $tmp_json["token"] = $atoken;
  $tmp_json["data"] = $data;
  $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
  echo ($return_data);
  if (isset($conn)){
    $conn = null;
  }
}


// 로그 처리
// $cmd : 명령어, $desc : 세부 내용
function insert_log($conn, $cmd, $cmd_id, $cmd_text){
  try{
    // 쿼리 설정
    $query = "INSERT INTO aw_log (cmd, cmd_id, cmd_date, cmd_text) VALUES (";
    $query = $query . ":cmd, :cmd_id, now(), :cmd_text)";
    // 쿼리 연결
    $stmt = $conn->prepare($query);
    // 파라미터 바인딩 
    $stmt->bindParam(":cmd", $cmd, PDO::PARAM_STR);
    $stmt->bindParam(":cmd_id", $cmd_id, PDO::PARAM_STR);
    $stmt->bindParam('cmd_text', $cmd_text, PDO::PARAM_STR);
    // PDO 실행
    $stmt->execute();
    $num = $stmt->rowCount();

    if ($num > 0){
      return true;
    }
    else{
      return false;
    }
  }
  catch(PDOException $e){
    return false;
  }  
}


// 파일 업로드 진행
function handleFileUpload($uploadDirectory, $files, $uploadType) {
  $bupload = true;
  $rtnMessage = ""; // 에러 메시지 초기화

  foreach ($files['name'] as $key => $fileName) {
      $tmpFileName = $files['tmp_name'][$key];
      $fileSize = $files['size'][$key];

      // 업로드된 파일이 없는 경우 무시
      if ($fileName === '') continue;

      // 파일 업로드 시 에러가 발생한 경우 처리
      if (!move_uploaded_file($tmpFileName, $uploadDirectory . $fileName)) {
          switch ($files['error'][$key]) {
              case UPLOAD_ERR_INI_SIZE:
                  $rtnMessage = "Uploaded file exceeds the upload_max_filesize directive in php.ini.";
                  break;
              case UPLOAD_ERR_FORM_SIZE:
                  $rtnMessage = "Uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.";
                  break;
              case UPLOAD_ERR_PARTIAL:
                  $rtnMessage = "The uploaded file was only partially uploaded.";
                  break;
              case UPLOAD_ERR_NO_FILE:
                  $rtnMessage = "No file was uploaded.";
                  break;
              case UPLOAD_ERR_NO_TMP_DIR:
                  $rtnMessage = "Missing a temporary folder.";
                  break;
              case UPLOAD_ERR_CANT_WRITE:
                  $rtnMessage = "Failed to write file to disk.";
                  break;
              case UPLOAD_ERR_EXTENSION:
                  $rtnMessage = "A PHP extension stopped the file upload.";
                  break;
              default:
                  $rtnMessage = "Unknown upload error.";
                  break;
          }

          $bupload = false; // 파일 업로드 실패 설정
          break; // 파일 업로드 실패 시 반복문 종료
      }
  }

  // 파일 업로드 실패 시 해당 타입에 따라 적절한 에러 메시지 반환
  return $bupload;
}

?>