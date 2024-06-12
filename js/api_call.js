
// access_token을 이용한 로그인 처리
async function login_token(url){
  param = {};
  param.cmd = "login_token";

  headers = {};
  headers.Authorization = "Bearer " + g_access_token;
  await xhr_palin(url, param, 
      "json", "json", "POST", false, headers);
}

/**
 * 관리자 로그인
 * @param {*} id : 관리자 아이디
 * @param {*} password  : 관리자 비밀번호
 */
async function login(id, password, type){
  param = {};
  param.mem_id = id;
  param.mem_password = password;
  if(Number(type) === 1){
    param.cmd = "login";
  }else{
    param.cmd = "subs_class_check";
  }


  headers = {};
  headers.Authorization = "Bearer " + g_access_token;
  await xhr_palin("server/api_main.php", param, 
    "json", "json", "POST", true, headers);
}

/**
 * 
 * @param {*} id : 수강신청 시 입력한 이메일
 * @param {*} password  : 수강신청 시 입력한 비밀번호
 */
async function check_subscription(id, password){
  param = {};
  param.mem_id = id;
  param.mem_password = password;
  param.cmd = "check_subscription";

  headers = {};
  headers.Authorization = "Bearer " + g_access_token;
  await xhr_palin("server/api_main.php", param, 
    "json", "json", "POST", true, headers);
}

async function load_classtime(){
  param = {};
  param.class_idx = g_class_idx;
  param.class_lang = g_lang;
  param.cmd = "load_classtime";

  headers = {};
  headers.Authorization = "Bearer " + g_access_token;
  await xhr_palin("server/api_main.php", param, 
    "json", "json", "POST", true, headers);
}

async function load_class(){
  param = {};
  param.cmd = "load_class_list";

  headers = {};
  headers.Authorization = "Bearer " + g_access_token;
  await xhr_palin("server/api_main.php", param, 
    "json", "json", "POST", true, headers);
}

// 로그인 처리
// 토큰 체크 
/* error 
  400 : access token 미전송, refresh token 미유효, 아이디/패스워드 미전송 (메시지를 띄우지 않음)
  401 : access token 미전송, refresh token 미유효, 로그인 리턴 결과 오류 
  402 : access token 미전송, refresh token 미유효, 로그인 처리 과정 오류
  403 : access token 전송, refresh token 미유효, 로그인 함수 오류
  404 : access token 전송, refresh token 미유효, 로그인 리턴 결과 오류 
  405 : access token 전송, refresh token 미유효, 로그인 처리 과정 오류
*/   
function checkLogin(res){
  var status = res.status;
  if (status == 400){
    return false;
  }
  else if (status == 200){
    if (res.cmd != "login_token"){
      msgboxObj.status = 200;
      msgboxObj.message = "로그인 되었습니다.";
      msgboxObj.closetime = msg_close_delay;
      msgboxObj.type = t_sucess;
      msgboxObj.title = title_default;
      showiziModal(msgboxObj);
    }
    g_login.id = res.data.user_id;
    g_login.name = res.data.user_name;
    g_login.level = res.data.user_level;
    return true;
  }
  else{
    var focusid = getID('login_id');
    msgboxObj.status = status;
    msgboxObj.message =res.statusText;
    msgboxObj.closetime = no_delay;
    msgboxObj.type = t_error;
    msgboxObj.title = title_result;
    showiziModal(msgboxObj, focusid);
    return false;
  }
}