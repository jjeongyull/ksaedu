<?php

/*
 1) 비밀번호 재발행
  function regen_password($param, $dbcon, $atoken, &$regenpassword)
 2) 토큰 발행 전 회원 등록
  function insert_member_noauth($param, $dbcon)
 */

function regen_password($param, $dbcon, $atoken, &$regenpassword)
{
  try{
    if ($param->mem_id == 'admin'){
      ReturnData(500, $param->cmd, "허용되지 않는 아이디입니다.", "", "", $dbcon);
      return false;    
    }

    // 아이디가 존재하는지 확인
    if ($param->login_type == "1"){
      $sql = "SELECT * FROM " . $param->table_name . " WHERE manager_email = :mem_id";
    }
    else{
      $sql = "SELECT * FROM " . $param->table_name . " WHERE subs_user_email = :mem_id";
    }
    $stmt = $dbcon->prepare($sql);
    $cryptdata = _crypt($param->mem_id);
    $stmt->bindValue(":mem_id", $cryptdata, PDO::PARAM_STR);
    $stmt->execute();
    $count = $stmt->rowCount();
    if ($count < 1){
      // 아이디가 없을 경우 
      ReturnData(500, $param->cmd, "Error reterive password.(1)", $atoken, "", $dbcon);
      return false;
    }

    $dbcon->beginTransaction();
    if ($param->login_type == "1"){
      $sql = "UPDATE " . $param->table_name . " SET manager_password = :change_password WHERE manager_email = :mem_id";
    }
    else{
      $sql = "UPDATE " . $param->table_name . " SET subs_user_password = :change_password WHERE subs_user_email = :mem_id";
    }
    $stmt = $dbcon->prepare($sql);

    // 비밀번호 재발송일 경우 임시 비밀번호 생성
    if (empty($regenpassword)){
      $regenpassword = passwordGenerator(6);
    }
    $change_password = hash("sha256", iso8859_1_to_utf8($regenpassword));

    $stmt->bindValue(":mem_id", $cryptdata, PDO::PARAM_STR);
    $stmt->bindValue(":change_password", $change_password, PDO::PARAM_STR);
    $stmt->execute();

    $count = $stmt->rowCount();
    if ($stmt){
      if ($count > 0){
        $dbcon->commit();
        return true;
      }
      else{
        $dbcon->rollBack();
        ReturnData(500, $param->cmd, "비밀번호 변경 오류(2)", $atoken, "", $dbcon);
        return false;
      }
    }
    else{
      $dbcon->rollBack();
      ReturnData(500, $param->cmd, pdo_debugStrParams($stmt, bDebug), $atoken, "", $dbcon);
      return false;
    }
  }catch (PDOException $e) {
    $dbcon->rollBack();
    ReturnData(600, $param->cmd, pdo_debugStrParams($stmt, bDebug) . 
              $e->getMessage(), $atoken, "", $dbcon);
    return false;
  }
}

function admin_regen_password($param, $dbcon, $atoken, &$regenpassword)
{
  try{

    // 아이디가 존재하는지 확인
    $sql = "SELECT * FROM " . $param->table_name . " WHERE manager_id = :manager_id";
    $stmt = $dbcon->prepare($sql);
    $stmt->bindValue(":manager_id", $param->manager_id, PDO::PARAM_STR);
    $stmt->execute();
    $count = $stmt->rowCount();
    if ($count < 1){
      // 아이디가 없을 경우 
      ReturnData(500, $param->cmd, "비밀번호 변경 오류(1)", $atoken, "", $dbcon);
      return false;
    }

    // 등록한 이메일을 검사
    $sql = "SELECT * FROM " . $param->table_name . " WHERE manager_id = :manager_id AND manager_email = :manager_email";
    $stmt = $dbcon->prepare($sql);
    $stmt->bindValue(":manager_id", $param->manager_id, PDO::PARAM_STR);
    $cryptdata = "";
    $cryptdata = _crypt($param->manager_email);
    $stmt->bindValue(":manager_email", $cryptdata, PDO::PARAM_STR);
    $stmt->execute();
    $count = $stmt->rowCount();
    if ($count < 1){
      // 아이디가 없을 경우 
      ReturnData(500, $param->cmd, "등록되지 않은 이메일입니다.", $atoken, "", $dbcon);
      return false;
    }

    $dbcon->beginTransaction();
    $sql = "UPDATE " . $param->table_name . " SET manager_password = :manager_password WHERE manager_id = :manager_id";
    $stmt = $dbcon->prepare($sql);

    // 비밀번호 재발송일 경우 임시 비밀번호 생성
    if (empty($regenpassword)){
      $regenpassword = passwordGenerator(6);
    }
    $change_password = hash("sha256", iso8859_1_to_utf8($regenpassword));

    $stmt->bindValue(":manager_id", $param->manager_id, PDO::PARAM_STR);
    $stmt->bindValue(":manager_password", $change_password, PDO::PARAM_STR);
    $stmt->execute();

    $count = $stmt->rowCount();
    if ($stmt){
      if ($count > 0){
        $dbcon->commit();
        return true;
      }
      else{
        $dbcon->rollBack();
        ReturnData(500, $param->cmd, "비밀번호 변경 오류(2)", $atoken, "", $dbcon);
        return false;
      }
    }
    else{
      $dbcon->rollBack();
      ReturnData(500, $param->cmd, pdo_debugStrParams($stmt, bDebug), $atoken, "", $dbcon);
      return false;
    }
  }catch (PDOException $e) {
    $dbcon->rollBack();
    ReturnData(600, $param->cmd, pdo_debugStrParams($stmt, bDebug) . 
              $e->getMessage(), $atoken, "", $dbcon);
    return false;
  }
}

function insert_member_noauth($param, $dbcon)
{
  try{
    // admin은 등록 불가
    if ($param->mem_id == 'admin'){
        ReturnData(500, $param->mem_cmd, "허용되지 않는 아이디입니다.", "", "", $dbcon);
        die();    
    }
    // 동일한 아이디가 존재하는지 확인
    $sql = "SELECT COUNT(mem_id) as cnt FROM ". $param->table_name . " WHERE mem_id = :mem_id";
    $stmt = $dbcon->prepare($sql);
    $stmt->bindValue(":mem_id", $param->mem_id, PDO::PARAM_STR);
    $stmt->execute();
    $count = $stmt->fetchColumn();
    if ($count > 0){
        ReturnData(501, $param->cmd, "해당 아이디는 이미 사용중입니다.", "", "", $dbcon);
        die();    
    }

    // 회원 가입
    $sql = "INSERT INTO ". $param->table_name . " (mem_id, ";
    $sql = $sql . "mem_name, ";
    $sql = $sql . "mem_password, ";
    $sql = $sql . "mem_level, ";
    $sql = $sql . "mem_status, ";
    $sql = $sql . "mem_register_date, ";
    $sql = $sql . "mem_grant_write, ";
    $sql = $sql . "mem_cus_idx, ";
    $sql = $sql . "mem_email) VALUES(";
    $sql = $sql . ":mem_id, ";
    $sql = $sql . ":mem_name, ";
    $sql = $sql . ":mem_password, ";
    $sql = $sql . ":mem_level, ";
    $sql = $sql . ":mem_status, ";
    $sql = $sql . "now(),";
    $sql = $sql . ":mem_grant_write, ";
    $sql = $sql . ":mem_cus_idx, ";
    $sql = $sql . ":mem_email)";

    $stmt = $dbcon->prepare($sql);

    $stmt->bindValue(":mem_id", $param->mem_id, PDO::PARAM_STR);
    $stmt->bindValue(":mem_name", $param->mem_name, PDO::PARAM_STR);

    // 비밀번호 해시 처리
    $change_password = hash("sha256", iso8859_1_to_utf8($param->mem_password));
    $stmt->bindValue(":mem_password", $change_password, PDO::PARAM_STR);

    $stmt->bindValue(":mem_level", $param->mem_level, PDO::PARAM_INT);
    $stmt->bindValue(":mem_status", $param->mem_status, PDO::PARAM_INT);
    $stmt->bindValue(":mem_grant_write", $param->mem_grant_write, PDO::PARAM_INT);
    $stmt->bindValue(":mem_cus_idx", $param->mem_cus_idx, PDO::PARAM_INT);

    // 암호화 처리(개인정보유출 방지 대응)
    $cryptdata = _crypt($param->mem_email, 'e');    
    $stmt->bindValue(":mem_email", $cryptdata, PDO::PARAM_STR);

    $stmt->execute();
    $count = $stmt->rowCount();
    if ($count != 1){
      ReturnData(500, $param->cmd, pdo_debugStrParams($stmt, bDebug), "", "", $dbcon);
      return false;
    }
    return true;
  }
  catch(PDOException $e){
      ReturnData(600, $param->cmd, $e->getMessage() . pdo_debugStrParams($stmt, bDebug), "", "", $dbcon);
      return false;
  }
}
?>    