/** 
 * 로그인
 */
/**
 * 로그인 화면 출력 (관리자 로그인 화면)
*/
$(document).on('click', '#btn_login_form', function(event){
  event.preventDefault();
  g_page_type = "0";
  login_token("server/api_main.php");
  popupObj.title = login_lang.popup_admin_title[g_lang];
  popupObj.subtitle = "";
  popupObj.contentHtml = PagesContent.login;
  popupObj.focusid = getID('mem_id');
  popupObj.orgfocusid = getID('mem_id');
  popupObj.width = 600;
  // icommon에 정의된 아이콘 파일(https://icomoon.io/app/#/select/font) 또는 fontawome
  // popupObj.icon = 'fa-solid fa-key';      
  popupObj.showfs = false;
  popupObj.showclose = true;


  showPopup(popupObj); 

  $('#login_type').val("1");

  // 팝업 화면 메시지 설정
  $('#label_mem_id').html(login_lang.label_mem_id[g_lang]);
  $('#label_mem_password').html(login_lang.label_mem_password[g_lang]);
  $('#btn_login').html(login_lang.btn_login[g_lang]);
  $('#btn_modal_close').html(login_lang.btn_modal_close[g_lang]);
  $('#btn_retrieve_password').html(login_lang.btn_retrieve_password[g_lang]);

  $('#mem_id').attr('placeholder', login_lang.msg_input_email[g_lang]);
  $('#mem_password').attr('placeholder', login_lang.msg_input_password[g_lang]);
});

/**
 * 로그인 화면 출력 (사용자 화면)
*/
$(document).on('click', '#btn_check_subscription', function(event){
  event.preventDefault();

  popupObj.title = lang.index.btn_check_subscription[g_lang];
  popupObj.subtitle = "";
  popupObj.contentHtml = PagesContent.login;
  popupObj.width = 600;
  popupObj.focusid = getID('mem_email');
  popupObj.orgfocusid = getID('mem_email');
  // icommon에 정의된 아이콘 파일(https://icomoon.io/app/#/select/font) 또는 fontawome
  // popupObj.icon = 'fa-solid fa-key';      
  popupObj.showfs = false;
  popupObj.showclose = true;

  showPopup(popupObj);  
  // 사용자일 경우 
  $('#login_type').val("0");

  // 팝업 화면 메시지 설정
  $('#label_mem_id').html(login_lang.label_mem_id[g_lang]);
  $('#label_mem_password').html(login_lang.label_mem_password[g_lang]);
  $('#btn_login').html(login_lang.btn_login[g_lang]);
  $('#btn_modal_close').html(login_lang.btn_modal_close[g_lang]);
  $('#btn_retrieve_password').html(login_lang.btn_retrieve_password[g_lang]);
  
  $('#mem_id').attr('placeholder', login_lang.msg_input_email[g_lang]);
  $('#mem_password').attr('placeholder', login_lang.msg_input_password[g_lang]);
  $('#btn_login').text(login_lang.btn_ok[g_lang])

  // ajax 호출
});

/**
 * 로그인 버튼 클릭
 * 사용자ㅣ모드
*/
$(document).on('click', '#btn_login', function(event){
  event.preventDefault();
  let login_type = getIDValue('login_type');
  let mem_id = getIDValue('mem_id');
  let mem_password = getIDValue('mem_password');

  msgboxObj.status = 500;
  msgboxObj.closetime = msg_close_delay;
  msgboxObj.type = t_error;
  msgboxObj.title = title_default;
  if (isEmpty(mem_id)) {  
    msgboxObj.message = login_lang.msg_input_email[g_lang];
    showiziModal(msgboxObj, getID('mem_id'));
    return false;
  }
  if (isEmpty(mem_password)) { 
    msgboxObj.message = login_lang.msg_input_password[g_lang];
    showiziModal(msgboxObj, getID('mem_password'));
    return false 
  }

  login(mem_id, mem_password, login_type);
});

// 로그아웃 버튼 클릭
$(document).on('click', '#btn_logout', async function(event){
  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: "로그아웃 하시겠습니까?",
    headerText : "알림",
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};

  param = {};
  param.cmd = "logout";

  call_admin_ajax(param,  false);
  g_login = {};
}); 

/**
 * 비밀번호 재발송
 * 입력한 이메일로 비밀번호를 재전송한다. (교육신청자일 경우에만)
 */
$(document).on('click', '#btn_retrieve_password', async function(event){
  event.preventDefault();
  let sEmail = getIDValue('mem_id');
  let login_type = getIDValue('login_type');
  msgboxObj.status = 500;
  msgboxObj.closetime = no_delay;
  msgboxObj.type = t_error;
  msgboxObj.title = title_default;
  msgboxObj.width = 500;
  if (isEmpty(sEmail)) {  
    msgboxObj.message = lang.index.msg_input_email[g_lang];
    showiziModal(msgboxObj, getID('mem_id'));
    return false;
  }
  
  let params = {}
  params.mem_id = sEmail;
  params.cmd = "regen_userpassword";
  params.login_type = login_type;
  await call_ajax(params);
});

/** 
 * 교육 신청 확인
 * 교육신청 시 입력한 이메일 및 비밀번호 확인 후 신청한 정보 출력
 * 입금 확인이 완료될 경우 "인보이스출력" 버튼 활성화
 */
// 로그인 버튼 클릭
$(document).on('click', '#btn_step1_ch', function(){ // 중문으로 신청
  gotoPage('step1.html', `lang=ch`);
});
$(document).on('click', '#btn_step1_en', function(){ // 영문으로 신청
  gotoPage('step1.html', `lang=en`);
});

// 클래스 선택시
$(document).on('click', '.btn_class_view', function(event){
  let class_idx = $(this).data('idx');

  let className = json_filter(g_class_json, class_idx, `idx`, `class_name_${g_lang}`)
  gotoPage('step2.html', `lang=${g_lang}&class=${class_idx}&className=${className}`);

});

// 신청페이지로 이동 버튼 클릭
$(document).on('click', '#btn_apply_education', function(event){

  g_class_time = getRadioValue('radio_classtime');

  msgboxObj.status = 500;
  msgboxObj.closetime = msg_close_delay;
  msgboxObj.type = t_error;
  msgboxObj.title = title_default;
  if (isEmpty(g_class_time)) {  
    msgboxObj.message = msg_lang.msg_class_time[g_lang];
    showiziModal(msgboxObj, '');
    return false;
  }

  let time_idx = json_filter(g_classtime_json, g_class_time, 'class_time', 'idx');


  if (!isEmpty(g_lang) && !isEmpty(g_class_idx) && !isEmpty(g_class_time))
    gotoPage('apply.html', `lang=${g_lang}&name=${g_class_name}&class=${g_class_idx}&time=${g_class_time}&time_idx=${time_idx}`);
});


// 신청버튼 클릭시
$(document).on('click', '#btn_edu_application', async function(){
  let subs_user_name_ch = getIDValue('subs_user_name_ch'); // 중문이름
  let subs_user_name_en = getIDValue('subs_user_name_en'); // 영문이름
  let subs_user_wechat = getIDValue('subs_user_wechat'); // 사용자 위쳇
  let subs_company_position = getIDValue('subs_company_position');// 직위
  let subs_sex = getRadioValue("chk_sex");// 성별
  let subs_birth = getIDValue("subs_birth");// 생년월일
  let subs_identity_number = getIDValue('subs_identity_number');// 신분번호
  let subs_phone_number = getIDValue('subs_phone_number');// 연락처
  let subs_user_email = getIDValue('subs_user_email');// 이메일
  let subs_user_zipcode = getIDValue('subs_user_zipcode');// zipcode
  let subs_ceo_name = getIDValue('subs_ceo_name');// 대표명
  let subs_company_name_ch = getIDValue('subs_company_name_ch');// 업체명(중문)
  let subs_company_name_en = getIDValue('subs_company_name_en');// 업체명(영문)
  let subs_company_name_ko = getIDValue('subs_company_name_ko');// 업체명(국문)
  let subs_company_address_ch = getIDValue('subs_company_address_ch');// 공장주소(중문)
  let subs_company_address_en = getIDValue('subs_company_address_en');// 공장주소(영문)
  let subs_agent_name = getIDValue('subs_agent_name');// 에이전트이름(선택)
  let subs_agent_manager = getIDValue('subs_agent_manager');// 에이전트 담당자(선택)
  let subs_agent_phone_number = getIDValue('agent_phone_number');// 에이전트 연락처(선택)
  let subs_agent_email = getIDValue('agent_email');// 에이전트 이메일(선택)
  let subs_agent_wechat = getIDValue('agent_wechat');// 에이전트 위쳇(선택)
  let subs_currency = getRadioValue("chk_currency");// 송금통화
  let subs_depositor_name = getIDValue("subs_depositor_name");// 입금자명
  let subs_user_password = getIDValue('subs_user_password');// 에이전트 이메일(선택)

  msgboxObj.status = 500;
  msgboxObj.closetime = msg_close_delay;
  msgboxObj.type = t_error;
  msgboxObj.title = title_default;

  let check_text = "";
  if (isEmpty(subs_company_position)) {  
    msgboxObj.message = msg_lang.subs_company_position[g_lang];
    showiziModal(msgboxObj, getID('subs_company_position'));
    return false;
  }

  if (isEmpty(subs_identity_number)) {  
    msgboxObj.message = msg_lang.subs_identity_number[g_lang];
    showiziModal(msgboxObj, getID('subs_identity_number'));
    return false;
  }
  
  if (isEmpty(subs_phone_number)) {  
    msgboxObj.message = msg_lang.subs_phone_number[g_lang];
    showiziModal(msgboxObj, getID('subs_phone_number'));
    return false;
  }
  if (isEmpty(subs_birth)) {  
    msgboxObj.message = msg_lang.subs_birth[g_lang];
    showiziModal(msgboxObj, getID('subs_birth'));
    return false;
  }

  if (isEmpty(subs_user_email)) {  
    msgboxObj.message = msg_lang.subs_user_email[g_lang];
    showiziModal(msgboxObj, getID('subs_user_email'));
    return false;
  }

  if(Number(g_class_idx) === 2){
    if (isEmpty(subs_user_zipcode)) {  
      msgboxObj.message = 'Please enter ZIPCODE for textbook delivery.';
      showiziModal(msgboxObj, getID('subs_user_zipcode'));
      return false;
    }
  }else{
    if (isEmpty(subs_user_zipcode)) { 
      subs_user_zipcode = "";
    }
  }


  if (isEmpty(subs_currency)) {  
    msgboxObj.message = msg_lang.subs_currency[g_lang];
    showiziModal(msgboxObj, getID('subs_currency'));
    return false;
  }

  if (isEmpty(subs_user_password)) {  
    msgboxObj.message = msg_lang.subs_user_password[g_lang];
    showiziModal(msgboxObj, getID('subs_user_password'));
    return false;
  }

  if (isEmpty(subs_ceo_name)) {  
    msgboxObj.message = msg_lang.subs_ceo_name[g_lang];
    showiziModal(msgboxObj, getID('subs_ceo_name'));
    return false;
  }

  if (isEmpty(subs_user_name_en)) {  
    msgboxObj.message = msg_lang.subs_user_name_en[g_lang];
    showiziModal(msgboxObj, getID('subs_user_name_en'));
    return false;
  }

  if (isEmpty(subs_company_name_en)) {  
    msgboxObj.message = msg_lang.subs_company_name_en[g_lang];
    showiziModal(msgboxObj, getID('subs_company_name_en'));
    return false;
  }

  if (isEmpty(subs_company_name_ko)) {  
    msgboxObj.message = msg_lang.subs_company_name_ko[g_lang];
    showiziModal(msgboxObj, getID('subs_company_name_ko'));
    return false;
  }

  if (isEmpty(subs_company_address_en)) {  
    msgboxObj.message = msg_lang.subs_company_address_en[g_lang];
    showiziModal(msgboxObj, getID('subs_company_address_en'));
    return false;
  }
  if (isEmpty(subs_depositor_name)) {  
    msgboxObj.message = msg_lang.subs_depositor_name[g_lang];
    showiziModal(msgboxObj, getID('subs_depositor_name'));
    return false;
  }

  if(g_lang === "ch"){
    if (isEmpty(subs_user_name_ch)) {  
      msgboxObj.message = msg_lang.subs_user_name_ch[g_lang];
      showiziModal(msgboxObj, getID('subs_user_name_ch'));
      return false;
    }
    if (isEmpty(subs_company_name_ch)) {  
      msgboxObj.message = msg_lang.subs_company_name_ch[g_lang];
      showiziModal(msgboxObj, getID('subs_company_name_ch'));
      return false;
    }
    if (isEmpty(subs_company_address_ch)) {  
      msgboxObj.message = msg_lang.subs_company_address_ch[g_lang];
      showiziModal(msgboxObj, getID('subs_company_address_ch'));
      return false;
    }
    if (isEmpty(subs_user_wechat)) {  
      msgboxObj.message = msg_lang.subs_user_wechat[g_lang];
      showiziModal(msgboxObj, getID('subs_user_wechat'));
      return false;
    }
  }

  /* 이메일 정합성 체크 */
  if (!validateEmail(subs_user_email)){
    msgboxObj.message = msg_lang.validate_email[g_lang];
    showiziModal(msgboxObj, getID('subs_user_email'));
    return true;
  }

  /* 에이전트 이메일 정합성 */
  if (!isEmpty(subs_agent_email)) {  
    if (!validateEmail(subs_agent_email)){
      msgboxObj.message = msg_lang.validate_email[g_lang];
      showiziModal(msgboxObj, getID('subs_agent_email'));
      return true;
    }
  }

  /* 확인 메시지 창 출력 */
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_class_name[g_lang]} :</span> ${g_class_name}</p>`;
  check_text = check_text + draw_apply_info(lang.apply.label_class_name[g_lang],g_class_name);
  check_text = check_text + draw_apply_info(lang.apply.label_class_time[g_lang],g_class_time);
  check_text = check_text + draw_apply_info(lang.apply.label_ceo_name[g_lang],subs_ceo_name);
  if(g_lang === "ch"){
    check_text = check_text + draw_apply_info(lang.apply.label_username_ch[g_lang],subs_user_name_ch);
    check_text = check_text + draw_apply_info(lang.apply.label_username_en[g_lang],subs_user_name_en);
    check_text = check_text + draw_apply_info(lang.apply.label_wechat[g_lang],subs_user_wechat);
    check_text = check_text + draw_apply_info(lang.apply.label_company_name_ch[g_lang],subs_company_name_ch);
    check_text = check_text + draw_apply_info(lang.apply.label_company_name_en[g_lang],subs_company_name_en);
    check_text = check_text + draw_apply_info(lang.apply.label_company_name_ko[g_lang],subs_company_name_ko);
    check_text = check_text + draw_apply_info(lang.apply.label_company_address_ch[g_lang],subs_company_address_ch);
    check_text = check_text + draw_apply_info(lang.apply.label_company_address_en[g_lang],subs_company_address_en);

    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_username_ch[g_lang]} :</span> ${subs_user_name_ch}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_username_en[g_lang]} :</span> ${subs_user_name_en}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_wechat[g_lang]} :</span> ${subs_user_wechat}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_name_ch[g_lang]} :</span> ${subs_company_name_ch}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_name_en[g_lang]} :</span> ${subs_company_name_en}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_name_ko[g_lang]} :</span> ${subs_company_name_ko}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_address_ch[g_lang]} :</span> ${subs_company_address_ch}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_address_en[g_lang]} :</span> ${subs_company_address_en}</p>`;
  }else{
    if(Number(g_class_idx) === 2){
      check_text = check_text + draw_apply_info('ZIPCODE (EMS)',subs_user_zipcode);
    }
    check_text = check_text + draw_apply_info(lang.apply.label_username_en[g_lang],subs_user_name_en);
    check_text = check_text + draw_apply_info(lang.apply.label_company_name_en[g_lang],subs_company_name_en);
    check_text = check_text + draw_apply_info(lang.apply.label_company_name_ko[g_lang],subs_company_name_ko);
    check_text = check_text + draw_apply_info(lang.apply.label_company_address_en[g_lang],subs_company_address_en);
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_username_en[g_lang]} :</span> ${label_username_en}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_name_en[g_lang]} :</span> ${subs_company_name_en}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_name_ko[g_lang]} :</span> ${subs_company_name_ko}</p>`;
    // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_address_en[g_lang]} :</span> ${subs_company_address_en}</p>`;
  }
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_company_position[g_lang]} :</span> ${subs_company_position}</p>`;
  let sex_text = "";
  if(Number(subs_sex) === 0){
    sex_text = lang.apply.label_men[g_lang];
  }else{
    sex_text = lang.apply.label_gril[g_lang];
  }
  check_text = check_text + draw_apply_info(lang.apply.label_chk_sex[g_lang],sex_text);
  check_text = check_text + draw_apply_info(lang.apply.label_birth[g_lang],subs_birth);
  check_text = check_text + draw_apply_info(lang.apply.label_identity_number[g_lang],subs_identity_number);
  check_text = check_text + draw_apply_info(lang.apply.label_phone_number[g_lang],subs_phone_number);
  check_text = check_text + draw_apply_info(lang.apply.label_user_email[g_lang],subs_user_email);
  check_text = check_text + draw_apply_info(lang.apply.label_chk_currency[g_lang],subs_currency);
  check_text = check_text + draw_apply_info(lang.apply.label_depositor_name[g_lang],subs_depositor_name);
  check_text = check_text + draw_apply_info(lang.apply.label_agent_name[g_lang],subs_agent_name);
  check_text = check_text + draw_apply_info(lang.apply.label_agent_manager[g_lang],subs_agent_manager);
  check_text = check_text + draw_apply_info(lang.apply.label_agent_phone_number[g_lang],subs_agent_phone_number);
  check_text = check_text + draw_apply_info(lang.apply.label_agent_email[g_lang],subs_agent_email);
  check_text = check_text + draw_apply_info(lang.apply.label_agent_wechat[g_lang],subs_agent_wechat);

  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_chk_sex[g_lang]} :</span> ${sex_text}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_birth[g_lang]} :</span> ${subs_birth}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_identity_number[g_lang]} :</span> ${subs_identity_number}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_phone_number[g_lang]} :</span> ${subs_phone_number}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_user_email[g_lang]} :</span> ${subs_user_email}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_chk_currency[g_lang]} :</span> ${subs_currency}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_depositor_name[g_lang]} :</span> ${subs_depositor_name}</p>`;
  // 비밀번호는 왜 보여 주는지????
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_user_password[g_lang]} :</span> ${subs_user_password}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_agent_name[g_lang]} :</span> ${subs_agent_name}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_agent_manager[g_lang]} :</span> ${subs_agent_manager}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_agent_phone_number[g_lang]} :</span> ${subs_agent_phone_number}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_agent_email[g_lang]} :</span> ${subs_agent_email}</p>`;
  // check_text = check_text + `<p><span class='font-bold'>${lang.apply.label_agent_wechat[g_lang]} :</span> ${subs_agent_wechat}</p>`;

  if(g_lang === "ch"){
    check_text = check_text + `<p class='mt-5 text-black-500 font-bold'>申请企业负责人</p>`;
  }else{
    check_text = check_text + `<p class='mt-5 text-black font-bold'>I hereby apply for participation in the training program offered by the Korean Standards Association as above.</p>`;
  }

  if(g_lang === "en"){
    if(Number(g_class_idx) === 2){
      check_text = check_text + `<p class='mt-5 text-black font-bold'>※Quality Control Manager's Training Program requires submitting photos for certification Please send a your photo to ksedu1@ksa.or.kr</p>`;
    }
  }

  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: check_text,
    headerText : msg_lang.application_details[g_lang],
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};
  

  let sendJSON = {};
  sendJSON.class_idx = g_class_idx;
  sendJSON.subs_country = g_lang;
  sendJSON.subs_user_name_ch = subs_user_name_ch;
  sendJSON.subs_user_name_en = subs_user_name_en;
  sendJSON.subs_user_wechat = subs_user_wechat;
  sendJSON.subs_company_position = subs_company_position;
  sendJSON.subs_sex = subs_sex;
  sendJSON.subs_birth = subs_birth;
  sendJSON.subs_identity_number = subs_identity_number;
  sendJSON.subs_phone_number = subs_phone_number;
  sendJSON.subs_user_email = subs_user_email;
  sendJSON.subs_user_zipcode = subs_user_zipcode;
  sendJSON.subs_ceo_name = subs_ceo_name;
  sendJSON.subs_company_name_ch = subs_company_name_ch;
  sendJSON.subs_company_name_en = subs_company_name_en;
  sendJSON.subs_company_name_ko = subs_company_name_ko;
  sendJSON.subs_company_address_ch = subs_company_address_ch;
  sendJSON.subs_company_address_en = subs_company_address_en;
  sendJSON.subs_agent_name = subs_agent_name;
  sendJSON.subs_agent_manager = subs_agent_manager;
  sendJSON.subs_agent_phone_number = subs_agent_phone_number;
  sendJSON.subs_agent_email = subs_agent_email;
  sendJSON.subs_agent_wechat = subs_agent_wechat;
  sendJSON.subs_currency = subs_currency;
  sendJSON.subs_depositor_name = subs_depositor_name;
  sendJSON.subs_user_password = subs_user_password;
  sendJSON.subs_class_time_idx = g_class_time_idx;
  sendJSON.cmd = "insert_user_subs_class";

  console.log(sendJSON);

  await call_ajax(sendJSON);

  let param = {};
  param.mem_id = subs_user_email;
  param.mem_password = subs_user_password;
  param.cmd = 'subs_class_check';
  await call_ajax(param);
});

// 교육추가 버튼 클릭 시
$(document).on('click', '#btn_class_write', function(){
  var bsOffcanvas = $('#offcanvas');
  var offcanvas = new bootstrap.Offcanvas(bsOffcanvas); 
  offcanvas.toggle(); 
  $('#canvas_title').text('교육과정 추가');

  // 캔버스 초기화
  $('#canvas_body').empty();
  $('#canvas_body').html(PagesContent.class_write);
  class_time_num_arr = [];
  class_time_num = 0;

  class_img_ch = [];
  class_img_ch_name = "";
  class_img_en = [];
  class_img_en_name = "";
});

// 교육수정 버튼 클릭 시
$(document).on('click', '.btn_update_class', function(e){
  let eq = e.target.cellIndex;
  if(Number(eq) === 3){
    class_img_ch = [];
    class_img_ch_name = "";
    class_img_en = [];
    class_img_en_name = "";
    let idx = $(this).data('idx');
    let classJSON = json_filter_json(g_class_json, idx, 'idx');
  // let classTimeJSON = json_filter_arr(g_classtime_json, idx, 'class_idx');
  var bsOffcanvas = $('#offcanvas');
  var offcanvas = new bootstrap.Offcanvas(bsOffcanvas); 
  offcanvas.toggle(); 
  $('#canvas_title').text('교육과정 수정');

  // 캔버스 초기화
  $('#canvas_body').empty();
  $('#canvas_body').html(PagesContent.class_write);
  $('#idx').val(idx);
  $('#class_name_ko').val(classJSON.class_name_ko);
  $('#class_name_ch').val(classJSON.class_name_ch);
  $('#class_name_en').val(classJSON.class_name_en);
  $('#class_manager_ch').val(classJSON.class_manager_ch);
  $('#class_manager_en').val(classJSON.class_manager_en);
  $('#class_info_tel').val(classJSON.class_info_tel);
  $('#class_info_fax').val(classJSON.class_info_fax);
  $('#class_info_email').val(classJSON.class_info_email);
  $('#pay_en_en').val(numberWithPointValue(classJSON.pay_en_en));
  $('#pay_kr_en').val(numberWithPointValue(classJSON.pay_kr_en));
  $('#pay_dal_ch').val(numberWithPointValue(classJSON.pay_dal_ch));
  $('#pay_ch_ch').val(numberWithPointValue(classJSON.pay_ch_ch));
  $('#pay_dal_ch_1').val(numberWithPointValue(classJSON.pay_dal_ch_1));
  $('#pay_ch_ch_1').val(numberWithPointValue(classJSON.pay_ch_ch_1));
  $('#view_order').val(classJSON.view_order? classJSON.view_order : "");

  // 활성화 정보 
  $(`input[name="radio_class_isactive"][value=${classJSON.class_active}]`).prop('checked', true);

  // 교육 정보 
  $('#class_cost_info_ko').val(decodinguri(classJSON.class_cost_info_ko));
  $('#class_cost_method_info_ko').val(decodinguri(classJSON.class_cost_method_info_ko));
  $('#class_schedule_info_ko').val(decodinguri(classJSON.class_schedule_info_ko));
  $('#class_method_info_ko').val(decodinguri(classJSON.class_method_info_ko));
  $('#class_content_info_ko').val(decodinguri(classJSON.class_content_info_ko));

  $('#class_cost_info_ch').val(decodinguri(classJSON.class_cost_info_ch));
  $('#class_cost_method_info_ch').val(decodinguri(classJSON.class_cost_method_info_ch));
  $('#class_schedule_info_ch').val(decodinguri(classJSON.class_schedule_info_ch));
  $('#class_method_info_ch').val(decodinguri(classJSON.class_method_info_ch));
  $('#class_content_info_ch').val(decodinguri(classJSON.class_content_info_ch));

  $('#class_cost_info_en').val(decodinguri(classJSON.class_cost_info_en));
  $('#class_cost_method_info_en').val(decodinguri(classJSON.class_cost_method_info_en));
  $('#class_schedule_info_en').val(decodinguri(classJSON.class_schedule_info_en));
  $('#class_method_info_en').val(decodinguri(classJSON.class_method_info_en));
  $('#class_content_info_en').val(decodinguri(classJSON.class_content_info_en));

  // 이미지
  class_img_ch_name = classJSON.class_img_ch;
  class_img_en_name = classJSON.class_img_en;
  if(!isEmpty(class_img_ch_name)){
    $('#preview_ch_img').html(`<img class='block' style="width: 150px;" src="../images/class/${class_img_ch_name}" alt="Uploaded Image">`);
  }
  if(!isEmpty(class_img_en_name)){
    $('#preview_en_img').html(`<img class='block' style="width: 150px;" src="../images/class/${class_img_en_name}" alt="Uploaded Image">`);
  }

  $('#btn_insert_class_list').text('수정');
  $('#btn_insert_class_list2').text('수정');
  $('#btn_delete_class_list').css('display', 'inline-block');
  }

  
});

// offcanvas 자동 스크롤 (입력 태그등에 포커스가 갈 경우 처리)
$(document).on('focus', '.offcanvas input', function(){
  var $offcanvasBody = $(this).closest('.offcanvas-body');
  $offcanvasBody.animate({
    scrollTop: $(this).position().top + $offcanvasBody.scrollTop() - $offcanvasBody.offset().top}, 100);
});

$(document).on('click', '#btn_insert_class_list2', async function(){
  $('#btn_insert_class_list').trigger('click');
});

// 교육과정 추가 버튼 클릭 시
$(document).on('click', '#btn_insert_class_list', async function(){
  let idx = $('#idx').val();
  let c_msg = "";
  if(isEmpty(idx)){
    c_msg = "정보를 등록하시겠습니까?"
  }else{
    c_msg = "정보를 수정하시겠습니까?"
  }
  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: c_msg,
    headerText : "알림",
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};
  let class_name_ko = $('#class_name_ko').val();
  let class_name_ch = $('#class_name_ch').val();
  let class_name_en = $('#class_name_en').val();
  let class_manager_ch = $('#class_manager_ch').val(); // 중문교육담당자
  let class_manager_en = $('#class_manager_en').val(); // 영문교육 담당자
  let class_info_tel = $('#class_info_tel').val(); // 교육처 전화번호
  let class_info_fax = $('#class_info_fax').val(); // 교육처 팩스번호
  let class_info_email = $('#class_info_email').val(); // 교육처 이메일
  let pay_en_en = $('#pay_en_en').val(); // 영문교육신청시 달러
  let pay_kr_en = $('#pay_kr_en').val(); // 영문교육신청시 한화
  let pay_dal_ch = $('#pay_dal_ch').val(); // 중문교육신청시 달러
  let pay_ch_ch = $('#pay_ch_ch').val(); // 중문교육신청시 원화
  let pay_dal_ch_1 = $('#pay_dal_ch_1').val(); // 중문교육신청시 달러(비대면)
  let pay_ch_ch_1 = $('#pay_ch_ch_1').val(); // 중문교육신청시 원화(비대면)

  let view_order = $('#view_order').val();
  let class_active = getRadioValue('radio_class_isactive');

  // 중문과정 이미지
  let img_ch = $('#img_ch')[0].files[0];
  if(img_ch){
    class_img_ch.push(img_ch);
  }
  // 영문과정 이미지
  let img_en = $('#img_en')[0].files[0];
  if(img_en){
    class_img_ch.push(img_en);
  }
  class_img_ch_name = img_ch ? img_ch.name : class_img_ch_name;
  class_img_en_name = img_en ? img_en.name : class_img_en_name;

  // 교육 정보 입력
  let class_cost_info_ko = $('#class_cost_info_ko').val(); // 교육비안내(한국어)
  let class_cost_method_info_ko = $('#class_cost_method_info_ko').val(); // 교육비 납부 안내(한국어)
  let class_schedule_info_ko = $('#class_schedule_info_ko').val(); // 교육 일정/장소(한국어)
  let class_method_info_ko = $('#class_method_info_ko').val(); // 학습방법(한국어)
  let class_content_info_ko = $('#class_content_info_ko').val(); // 과정안내(한국어)

  let class_cost_info_ch = $('#class_cost_info_ch').val(); // 교육비안내(중국어)
  let class_cost_method_info_ch = $('#class_cost_method_info_ch').val(); // 교육비 납부 안내()
  let class_schedule_info_ch = $('#class_schedule_info_ch').val(); // 교육 일정/장소()
  let class_method_info_ch = $('#class_method_info_ch').val(); // 학습방법()
  let class_content_info_ch = $('#class_content_info_ch').val(); // 과정안내()

  let class_cost_info_en = $('#class_cost_info_en').val(); // 교육비안내(영어)
  let class_cost_method_info_en = $('#class_cost_method_info_en').val(); // 교육비 납부 안내()
  let class_schedule_info_en = $('#class_schedule_info_en').val(); // 교육 일정/장소()
  let class_method_info_en = $('#class_method_info_en').val(); // 학습방법()
  let class_content_info_en = $('#class_content_info_en').val(); // 과정안내()

  // 입력값 체크
  if (isEmpty(class_name_ko)){
    msgboxObj.message = '교육 과정명(한국어)을 입력하세요.';
    showiziModal(msgboxObj, getID('class_name_ko'));
    return false;
  }
  if (isEmpty(class_name_ch)){
    msgboxObj.message = '교육 과정명(중국어)을 입력하세요.';
    showiziModal(msgboxObj, getID('class_name_ch'));
    return false;
  }
  if (isEmpty(class_name_en)){
    msgboxObj.message = '교육 과정명(영어)을 입력하세요.';
    showiziModal(msgboxObj, getID('class_name_en'));
    return false;
  }
  if (isEmpty(class_info_email)) {  
    msgboxObj.message = '이메일을 입력하세요.';
    showiziModal(msgboxObj, getID('class_info_email'));
    return false;
  }
  else{
    /* 이메일 정합성 체크 */
    if (!validateEmail(class_info_email)){
      msgboxObj.message = msg_lang.validate_email['ko'];
      showiziModal(msgboxObj, getID('class_info_email'));
      return true;
    }
  }
  if (isEmpty(view_order)){
    msgboxObj.message = '사용자화면 노출 순서를 입력하세요.';
    showiziModal(msgboxObj, getID('view_order'));
    return false;
  }

  pay_en_en = pay_en_en.replaceAll(',', '');
  pay_kr_en = pay_kr_en.replaceAll(',', '');
  pay_dal_ch = pay_dal_ch.replaceAll(',', '');
  pay_ch_ch = pay_ch_ch.replaceAll(',', '');
  pay_dal_ch_1 = pay_dal_ch_1.replaceAll(',', '');
  pay_ch_ch_1 = pay_ch_ch_1.replaceAll(',', '');

  let sendJSON = {};
  sendJSON.class_name_ko = class_name_ko;
  sendJSON.class_name_ch = class_name_ch;
  sendJSON.class_name_en = class_name_en;
  sendJSON.class_manager_ch = class_manager_ch;
  sendJSON.class_manager_en = class_manager_en;
  sendJSON.class_info_tel = class_info_tel;
  sendJSON.class_info_fax = class_info_fax;
  sendJSON.class_info_email = class_info_email;
  sendJSON.pay_en_en = pay_en_en;
  sendJSON.pay_kr_en = pay_kr_en;
  sendJSON.pay_dal_ch = pay_dal_ch;
  sendJSON.pay_ch_ch = pay_ch_ch;
  sendJSON.pay_dal_ch_1 = pay_dal_ch_1;
  sendJSON.pay_ch_ch_1 = pay_ch_ch_1;
  sendJSON.class_active = class_active;
  sendJSON.view_order = view_order;

  if(isEmpty(class_img_ch_name)){
    sendJSON.class_img_ch = "";
  }else{
    sendJSON.class_img_ch = class_img_ch_name;
  }
  if(isEmpty(class_img_en_name)){
    sendJSON.class_img_en = "";
  }else{
    sendJSON.class_img_en = class_img_en_name;
  }

  sendJSON.class_cost_info_ko = encodinguri(class_cost_info_ko);
  sendJSON.class_cost_method_info_ko = encodinguri(class_cost_method_info_ko);
  sendJSON.class_schedule_info_ko = encodinguri(class_schedule_info_ko);
  sendJSON.class_method_info_ko = encodinguri(class_method_info_ko);
  sendJSON.class_content_info_ko = encodinguri(class_content_info_ko);

  sendJSON.class_cost_info_ch = encodinguri(class_cost_info_ch);
  sendJSON.class_cost_method_info_ch = encodinguri(class_cost_method_info_ch);
  sendJSON.class_schedule_info_ch = encodinguri(class_schedule_info_ch);
  sendJSON.class_method_info_ch = encodinguri(class_method_info_ch);
  sendJSON.class_content_info_ch = encodinguri(class_content_info_ch);

  sendJSON.class_cost_info_en = encodinguri(class_cost_info_en);
  sendJSON.class_cost_method_info_en = encodinguri(class_cost_method_info_en);
  sendJSON.class_schedule_info_en = encodinguri(class_schedule_info_en);
  sendJSON.class_method_info_en = encodinguri(class_method_info_en);
  sendJSON.class_content_info_en = encodinguri(class_content_info_en);

  
  if(!isEmpty(idx)){
    sendJSON.idx = idx;
    sendJSON.cmd = "update_class_info";
  }else{
    sendJSON.cmd = "insert_class_info";
  }

  await call_admin_ajax(sendJSON);

  let formData = new FormData();
  for (var i = 0; i < class_img_ch.length; i++) {
      formData.append(`class_img_ch[]`, class_img_ch[i]);
  }
  for (var i = 0; i < class_img_en.length; i++) {
      formData.append(`class_img_en[]`, class_img_en[i]);
  }
  formData.append('cmd', "upload_file");
  headers = {};
  headers.Authorization = "Bearer " + g_access_token;
  await xhr_multipart("../server/api_main.php", formData, "", "", true);



  let params = {}
  params.cmd = "load_class_list";
  await call_admin_ajax(params);

  draw_class_list(g_class_json);
});


// 교육시간 관리 버튼 클릭 시
$(document).on('click', '.btn_class_time_update', function(e){
  e.stopPropagation();
  let idx = $(this).data('idx');
  let classTimeJSON = json_filter_arr(g_classtime_json, idx, 'class_idx');
  let class_info = json_filter_json(g_class_json, idx, 'idx');
  var bsOffcanvas = $('#offcanvas');
  var offcanvas = new bootstrap.Offcanvas(bsOffcanvas); 
  offcanvas.toggle(); 
  $('#canvas_title').text(`교육시간 수정(${class_info.class_name_ko})`);

  // 캔버스 초기화
  $('#canvas_body').empty();
  $('#canvas_body').html(PagesContent.class_time_write);
  if(classTimeJSON.length != 0){
    draw_class_time_div(classTimeJSON);
  }
  $('#class_idx').val(idx);

  $('#class_sdate').datepicker(DATE_TIME_CONFIG);
  $('#class_edate').datepicker(DATE_TIME_CONFIG);
});

// 시간추가 버튼 클릭 시
$(document).on('click', '#btn_insert_time', async function(){
  let class_idx = $("#class_idx").val();
  let class_lang = $("#class_lang").val();
  let class_sdate = $("#class_sdate").val();
  let class_edate = $("#class_edate").val();
  let class_max_count = $("#class_max_count").val();
  let class_place = $("#class_place").val();
  let class_type = getRadioValue('chk_class_type');
  msgboxObj.type = t_error;
  if (isEmpty(class_lang)) {  
    msgboxObj.message = '교육언어를 선택하세요.';
    showiziModal(msgboxObj, getID('class_lang'));
    return false;
  }
  if (isEmpty(class_sdate)) {  
    msgboxObj.message = '시작시간을 선택하세요.';
    showiziModal(msgboxObj, getID('class_sdate'));
    return false;
  }
  if (isEmpty(class_edate)) {  
    msgboxObj.message = '종료시간을 선택하세요.';
    showiziModal(msgboxObj, getID('class_edate'));
    return false;
  }
  if (isEmpty(class_place)) {  
    msgboxObj.message = '교육장소를 입력하세요.';
    showiziModal(msgboxObj, getID('class_place'));
    return false;
  }
  if (isEmpty(class_max_count)) {  
    msgboxObj.message = '최대 인원을 입력하세요.';
    showiziModal(msgboxObj, getID('class_max_count'));
    return false;
  }
  if (isEmpty(class_type)) {  
    msgboxObj.message = '수업방식을 선택하세요..';
    showiziModal(msgboxObj, getID('class_type'));
    return false;
  }
  class_sdate = class_sdate.replaceAll('-', '.');
  class_edate = class_edate.replaceAll('-', '.');
  let class_time = class_sdate + ' ~ ' + class_edate;

  let sendJSON = {};
  sendJSON.class_idx = class_idx;
  sendJSON.class_lang = class_lang;
  sendJSON.class_place = class_place;
  sendJSON.class_max_count = class_max_count;
  sendJSON.class_time = class_time;
  sendJSON.class_type = class_type;
  sendJSON.cmd = "insert_class_time";

  await call_admin_ajax(sendJSON);

  let params = {}
  params.cmd = "load_class_time_admin";
  await call_admin_ajax(params);

  let classTimeJSON = json_filter_arr(g_classtime_json, class_idx, 'class_idx');
  draw_class_time_div(classTimeJSON);

});

// 시간 수정버튼 클릭시
$(document).on('click', '.btn_up_time', async function(){
  let today = new Date();
  today = tobayDateMake(today);
  let class_idx = $("#class_idx").val();
  let idx = $(this).data('idx');
  let class_lang = $(`#lang_${idx}`).val();
  let class_sdate = $(`#class_sdate_${idx}`).val();
  let class_edate = $(`#class_edate_${idx}`).val();
  let class_max_count = $(`#class_max_count_${idx}`).val();
  let class_place = $(`#class_place_${idx}`).val();
  let class_type = getRadioValue(`chk_class_type_${idx}`);

  // 날짜 비교
  msgboxObj.type = t_error; 
  if (!compareDate(class_sdate, class_edate)){
    msgboxObj.message = '종료일은 시작일보다 빠를 수 없습니다.';
    showiziModal(msgboxObj, getID(`class_edate_${idx}`));
    $(`#class_edate_${idx}`).val('');
    return false;
  } 
  let tonum = today.replaceAll('-', '');
  let tosnum = class_sdate.replaceAll('-', '');
  let toenum = class_edate.replaceAll('-', '');
  if(Number(tosnum) <= Number(tonum)){
    msgboxObj.message = '시작일이 오늘과 같거나 오늘보다 이전일 수 없습니다.';
    showiziModal(msgboxObj, getID(`class_sdate_${idx}`));
    $(`#class_sdate_${idx}`).val('');
    return false;
  }
  if(Number(toenum) <= Number(tonum)){
    msgboxObj.message = '종료일이 오늘과 같거나 오늘보다 이전일 수 없습니다.';
    showiziModal(msgboxObj, getID(`class_sdate_${idx}`));
    $(`#class_sdate_${idx}`).val('');
    return false;
  }

  if (isEmpty(class_lang)) {  
    msgboxObj.message = '교육언어를 선택하세요.';
    showiziModal(msgboxObj, getID('class_lang'));
    return false;
  }
  if (isEmpty(class_sdate)) {  
    msgboxObj.message = '시작시간을 선택하세요.';
    showiziModal(msgboxObj, getID('class_sdate'));
    return false;
  }
  if (isEmpty(class_edate)) {  
    msgboxObj.message = '종료시간을 선택하세요.';
    showiziModal(msgboxObj, getID('class_edate'));
    return false;
  }
  if (isEmpty(class_max_count)) {  
    msgboxObj.message = '최대 인원을 입력하세요.';
    showiziModal(msgboxObj, getID('class_max_count'));
    return false;
  }
  if (isEmpty(class_place)) {  
    msgboxObj.message = '교육장소를 입력하세요..';
    showiziModal(msgboxObj, getID('class_place'));
    return false;
  }

  class_sdate = class_sdate.replaceAll('-', '.');
  class_edate = class_edate.replaceAll('-', '.');
  let class_time = class_sdate + ' ~ ' + class_edate;

  
  let sendJSON = {};
  sendJSON.idx = idx;
  sendJSON.class_lang = class_lang;
  sendJSON.class_max_count = class_max_count;
  sendJSON.class_time = class_time;
  sendJSON.class_idx = class_idx;
  sendJSON.class_type = class_type;
  sendJSON.class_place = class_place;
  sendJSON.cmd = "update_class_time";

  await call_admin_ajax(sendJSON);

  params = {}
  params.cmd = "load_class_time_admin";
  await call_admin_ajax(params);

  let classTimeJSON = json_filter_arr(g_classtime_json, class_idx, 'class_idx');
  draw_class_time_div(classTimeJSON);
});

// 시간 삭제버튼 클릭시
$(document).on('click', '.btn_del_time', async function(){
  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: "교육시간을 삭제 하시겠습니까?",
    headerText : "알림",
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};

  let class_idx = $("#class_idx").val();
  let idx = $(this).data('idx');


  
  let sendJSON = {};
  sendJSON.idx = idx;
  sendJSON.cmd = "delete_class_time";

  await call_admin_ajax(sendJSON);

  params = {}
  params.cmd = "load_class_time_admin";
  await call_admin_ajax(params);

  let classTimeJSON = json_filter_arr(g_classtime_json, class_idx, 'class_idx');
  draw_class_time_div(classTimeJSON);
});



// // 교육수정 버튼 클릭 시
// $(document).on('dblclick', '.btn_update_class', function(){
//   let idx = $(this).data('idx');


//   let classJSON = json_filter_json(g_class_json, idx, 'idx');
//   $('#idx').val(idx);
//   let tempHTML = `
//     <input type='hidden' id='idx' value='${idx}'>
//     <input type='text' class='form-control' id='class_name_ko_update' value='${classJSON.class_name_ko}'>
//   `;
//   $(this).html(tempHTML);
//   $('#class_name_ko_update').focus();
// });


// 교육시간 관리
$(document).on('click', '.btn_update_class_time', function(){
  let idx = $(this).data('idx');


  let classJSON = json_filter_json(g_class_json, idx, 'idx');
  $('#class_name_ko').val(classJSON.class_name_ko);
  $('#class_name_ch').val(classJSON.class_name_ch);
  $('#class_name_en').val(classJSON.class_name_en);
  $('#idx').val(idx);

});

// 관리자 페이지 교육관리
$(document).on('click', '#btn_index', function(){
  $('.nav-link').removeClass('active');
  $(this).addClass('active');
  let page = $(this).data('page');
  view_page(page);
});

// 관리자 페이지 교육 신청 현황 보기
$(document).on('click', '#btn_apply_list_page', function(){
  let page = $(this).data('page');
  $('.nav-link').removeClass('active');
  $(this).addClass('active');
  view_page(page);
});

// 관리자 페이지 계정관리
$(document).on('click', '#btn_user_list_page', function(){
  let page = $(this).data('page');
  $('.nav-link').removeClass('active');
  $(this).addClass('active');
  view_page(page);
});

// 다운로드 현황
$(document).on('click', '#btn_download_page', function(){
  let page = $(this).data('page');
  $('.nav-link').removeClass('active');
  $(this).addClass('active');
  view_page(page);
});

// 관리자 신청현황 클릭시
// $(document).on('click', '.btn_update_subs', function(){
//   let idx = $(this).parent().data('idx');
//   let tempJSON = json_filter_json(g_subs_list, idx, 'idx');

//   popupObj.title = "납입확인하기";
//   popupObj.subtitle = "";
//   popupObj.contentHtml = PagesContent.subs_update;
//   popupObj.width = 700;
//   // icommon에 정의된 아이콘 파일(https://icomoon.io/app/#/select/font) 또는 fontawome     
//   popupObj.showfs = false;
//   popupObj.showclose = true;


//   showPopup(popupObj); 
//   draw_subs_info(tempJSON);
// });

// 신청현황 테이블 tr클릭 시
$(document).on('click', '.btn_subs_class_tr', function(e){
  let eq = e.target.cellIndex;
  if(Number(eq) === 5 || Number(eq) === 6){
    let idx = $(this).data('idx');
    let tempJSON = json_filter_json(g_subs_list, idx, 'idx');
    popupObj.title = "납입확인하기";
    popupObj.subtitle = "";
    popupObj.contentHtml = PagesContent.subs_update;
    popupObj.width = 700;
    // icommon에 정의된 아이콘 파일(https://icomoon.io/app/#/select/font) 또는 fontawome     
    popupObj.showfs = false;
    popupObj.showclose = true;

    showPopup(popupObj); 
    draw_subs_info(tempJSON);
    $('#popup_content_1').children('div').removeClass('px-10');
    $('#popup_content_1').children('div').addClass('px-5');
    $('.hasDatepicker').trigger('click');
    $('.hasDatepicker').trigger('focus');
  }
});


// 관리자 계정추가 버튼 클릭 시
$(document).on('click', '#btn_member_plus_popup', function(){
  popupObj.title = "계정 추가";
  popupObj.subtitle = "";
  popupObj.contentHtml = PagesContent.member_plus;
  popupObj.width = 450;
  // icommon에 정의된 아이콘 파일(https://icomoon.io/app/#/select/font) 또는 fontawome     
  popupObj.showfs = false;
  popupObj.showclose = true;
  popupObj.focusid = getID('manager_id');

  showPopup(popupObj); 

  $('#idx').val('');

});

// 관리자 비밀번호 재발행 팝업 버튼 클릭 시
$(document).on('click', '#btn_user_regen_pw_popup', async function(){
  let idx = getIDValue('idx');
  let manager_id = getIDValue('manager_id');
  let manager_email = getIDValue('manager_email');
  if(manager_id === "admin"){
    msgboxObj.type = t_error;
    msgboxObj.message = '괸리자계정은 비밀번호 재발행을 진행할 수 없습니다.';
    showiziModal(msgboxObj, getID('class_edate'));
    return;
  }
    /* 이메일 정합성 체크 */
    if (!validateEmail(manager_email)){
      msgboxObj.message = msg_lang.validate_email['ko'];
      showiziModal(msgboxObj, getID('manager_email'));
      return true;
    }

    let sendJSON = {};
    sendJSON.idx = idx;
    sendJSON.manager_id = manager_id;
    sendJSON.manager_email = manager_email;
    sendJSON.cmd = "admin_regen_userpassword";
  
  
    await call_admin_ajax(sendJSON);
});


// 관리자 계정삭제 클릭 시
$(document).on('click', '#btn_user_delete', async function(){
  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: "계정을 삭제 하시겠습니까?",
    headerText : "알림",
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};

  let idx = getIDValue('idx');

  let sendJSON = {};
  sendJSON.idx = idx;
  sendJSON.cmd = "delete_user";


  await call_admin_ajax(sendJSON);

  let params = {}
  params.cmd = "load_member_list";
  await call_admin_ajax(params);

  draw_admin_user_list(g_user_list);

});

// 계정추가 버튼 클릭 시
$(document).on('click', '#btn_insert_user', async function(){
  let idx = $('#idx').val();

  let manager_id = getIDValue('manager_id');
  let manager_name = getIDValue('manager_name');
  let manager_email = getIDValue('manager_email');
  let manager_password = getIDValue('manager_password');
  let manager_password_chk = getIDValue('manager_password_chk');
  // let mem_level = getRadioValue('mem_level');
  msgboxObj.type = t_error;
  if (isEmpty(manager_id)) {  
    msgboxObj.message = '아이디를 입력하세요.';
    showiziModal(msgboxObj, getID('manager_id'));
    return false;
  }
  if (isEmpty(manager_name)) {  
    msgboxObj.message = '이름을 입력하세요.';
    showiziModal(msgboxObj, getID('manager_name'));
    return false;
  }
  if (isEmpty(manager_email)) {  
    msgboxObj.message = '이메일을 입력하세요.';
    showiziModal(msgboxObj, getID('manager_email'));
    return false;
  }
  else{
    /* 이메일 정합성 체크 */
    if (!validateEmail(manager_email)){
      msgboxObj.message = msg_lang.validate_email['ko'];
      showiziModal(msgboxObj, getID('manager_email'));
      return true;
    }
  }


  // if (isEmpty(mem_level)) {  
  //   msgboxObj.message = '권한을 선택하세요.';
  //   showiziModal(msgboxObj, getID('level_1'));
  //   return false;
  // }
  // 신규 등록일때만 확인
  if(isEmpty(idx)){
    if (isEmpty(manager_password)) {  
      msgboxObj.message = '비밀번호를 입력하세요.';
      showiziModal(msgboxObj, getID('manager_password'));
      return false;
    }
    if (isEmpty(manager_password_chk)) {  
      msgboxObj.message = '비밀번호 확인을 입력하세요.';
      showiziModal(msgboxObj, getID('manager_password_chk'));
      return false;
    }

    if(manager_password != manager_password_chk){
      msgboxObj.message = '비밀번호와 비밀번호 확인이 맞지 않습니다.';
      showiziModal(msgboxObj, getID('manager_password_chk'));
      return false;
    }

    let boolean = true;
    $.each(g_user_list, (key, items) => {
      if(items.manager_id === manager_id){
        boolean = false;
      }
    });
    if(!boolean){
      msgboxObj.message = '동일한 아이디가 이미 사용중입니다.';
      showiziModal(msgboxObj, getID('manager_id'));
      return false;
    }
  }else{ // 신규등록이 아닌 수정에선 본인 아이디를 제외하고 중복되는 아이디가 있는지 체크
    let boolean = true;
    let tempList = g_user_list.filter((items) => {
      return Number(items.idx) != Number(idx);
    });
    $.each(tempList, (key, items) => {
      if(items.manager_id === manager_id){
        boolean = false;
      }
    });
    if(!boolean){
      msgboxObj.message = '동일한 아이디가 이미 사용중입니다.';
      showiziModal(msgboxObj, getID('manager_id'));
      return false;
    }
    $.each(tempList, (key, items) => {
      if(items.manager_email === manager_email){
        boolean = false;
      }
    });
    if(!boolean){
      msgboxObj.message = '동일한 이메일이 이미 사용중입니다.';
      showiziModal(msgboxObj, getID('manager_id'));
      return false;
    }
  
  }



  let sendJSON = {};
  sendJSON.manager_id = manager_id;
  sendJSON.manager_name = manager_name;
  sendJSON.manager_email = manager_email;
 
  if(isEmpty(idx)){
    sendJSON.manager_password = manager_password;
    sendJSON.cmd = "insert_member";
    sendJSON.mem_level = 0;
  }else{
    sendJSON.cmd = "update_member";
    sendJSON.idx = idx;
    sendJSON.mem_level = g_login.mem_level;
  }

  await call_admin_ajax(sendJSON);

  let params = {}
  params.cmd = "load_member_list";
  await call_admin_ajax(params);

  draw_admin_user_list(g_user_list);
});

// 계정 수정 클릭 시
$(document).on('click', '.btn_update_user', function(e){
  let eq = e.target.cellIndex;
  if(Number(eq) === 1){
    let idx = $(this).data('idx');

    popupObj.title = "계정 정보 수정";
    popupObj.subtitle = "";
    popupObj.contentHtml = PagesContent.member_plus;
    popupObj.width = 550;
    // icommon에 정의된 아이콘 파일(https://icomoon.io/app/#/select/font) 또는 fontawome     
    popupObj.showfs = false;
    popupObj.showclose = true;
  
    popupObj.focusid = getID('manager_name');
  
    showPopup(popupObj); 
  
    let tempJSON = json_filter_json(g_user_list, idx, 'idx');
  
    $('#idx').val(idx);
    $('#manager_id').val(tempJSON.manager_id);
    $('#manager_id').prop('readonly', true);
    $('#manager_name').val(tempJSON.manager_name);
    $('#manager_email').val(tempJSON.manager_email);
  
  
    $('.pw_div').css('display', 'none');
    if(tempJSON.manager_id != 'admin'){
      $('#btn_user_delete').css('display', 'inline-block');
    }
  
    $('#btn_user_regen_pw_popup').css('display', 'inline-block');
    $('#btn_insert_user').text('계정정보 수정');
  }
  
});

// 관리자 신청현황 삭제시(완전삭제x, subs_delete = 1로 변경)
$(document).on('click', '#btn_subs_delete', async function(){
  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: "신청현황을 삭제하시겠습니까?",
    headerText : "알림",
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};

  let idx = $('#idx').val();
  let sendJSON = {};
  sendJSON.idx = idx;
  sendJSON.cmd = 'delete_subs_class';

  await call_admin_ajax(sendJSON);


  view_page("apply_list_page");

  
});

// 관리자 납입확인 클릭 시
$(document).on('click', '#btn_subs_success', async function(){
  let idx = getIDValue('idx');

  let subs_deposit_date = getIDValue('subs_deposit_date'); // 입금일자
  let subs_remittance_amount = getIDValue('subs_remittance_amount'); // 송금액
  let subs_take = getIDValue('subs_take'); // 매출액
  let subs_briefs = getIDValue('subs_briefs'); // 적요
  let subs_slip_number = getIDValue('subs_slip_number'); // 선수전표번호
  let subs_bill = getIDValue('subs_bill'); // 계산서구분
  let subs_sales_slip = getIDValue('subs_sales_slip'); // 매출전표
  let subs_type = getRadioValue('chk_state'); // 신청상태

  msgboxObj.type = t_error;
  if (isEmpty(subs_deposit_date)) { 
    subs_deposit_date = "";
    // msgboxObj.message = '입금일자를 입력하세요.';
    // showiziModal(msgboxObj, getID('subs_deposit_date'));
    // return false;
  }
  if (isEmpty(subs_remittance_amount)) {  
    subs_remittance_amount = "";
    // msgboxObj.message = '송금액을 입력하세요.';
    // showiziModal(msgboxObj, getID('subs_remittance_amount'));
    // return false;
  }
  if (isEmpty(subs_take)) {  
    subs_take = "";
    // msgboxObj.message = '매출액을 입력하세요.';
    // showiziModal(msgboxObj, getID('subs_take'));
    // return false;
  }
  if (isEmpty(subs_briefs)) {  
    subs_briefs = "";
    // msgboxObj.message = '적요를 입력하세요.';
    // showiziModal(msgboxObj, getID('subs_briefs'));
    // return false;
  }
  if (isEmpty(subs_slip_number)) {  
    subs_slip_number = "";
    // msgboxObj.message = '선수전표를 입력하세요.';
    // showiziModal(msgboxObj, getID('subs_slip_number'));
    // return false;
  }
  if (isEmpty(subs_bill)) {  
    subs_bill = "";
    // msgboxObj.message = '계산서구분을 입력하세요.';
    // showiziModal(msgboxObj, getID('subs_bill'));
    // return false;
  }
  if (isEmpty(subs_sales_slip)) { 
    subs_sales_slip = ""; 
    // msgboxObj.message = '매출전표를 입력하세요.';
    // showiziModal(msgboxObj, getID('subs_sales_slip'));
    // return false;
  }

  if(!isEmpty(subs_remittance_amount)){
    subs_remittance_amount = subs_remittance_amount.replaceAll(',', '');
  }
  if(!isEmpty(subs_take)){
    subs_take = subs_take.replaceAll(',', '');
  }


  let sendJSON = {};
  sendJSON.idx = idx; // 신청 구분 번호
  sendJSON.subs_deposit_date = subs_deposit_date; // 입금일자
  sendJSON.subs_remittance_amount = subs_remittance_amount; // 송금액
  sendJSON.subs_take = subs_take; // 매출액
  sendJSON.subs_briefs = subs_briefs; // 적요
  sendJSON.subs_slip_number = subs_slip_number; // 선수전표
  sendJSON.subs_bill = subs_bill; // 계산서
  sendJSON.subs_sales_slip = subs_sales_slip; // 매출전표
  sendJSON.subs_payment_manager_id = g_login.manager_id; // 납입확인한 관리자 아이디
  sendJSON.subs_type = subs_type; // 납입확인한 관리자 아이디
  sendJSON.cmd = 'update_subs_class';

  await call_admin_ajax(sendJSON);


  await view_page("apply_list_page");

  if(Number(g_subs_select) === 4){
    $('#search_type_div').css('display', 'flex');
    $('#subs_list_table_filter input[type="search"]').css('display', 'none');
    $('#subs_list_sdate').datepicker(DATE_TIME_CONFIG);
    $('#subs_list_edate').datepicker(DATE_TIME_CONFIG);
  }
});

// 관리자 신청현황 선택삭제 시
$(document).on('click', '#btn_chk_del', async function(){
  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: "선택한 신청현황을 모두 삭제하시겠습니까?",
    headerText : "알림",
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};

  var content_idx_arr = [];
  $('.dt-checkboxes').each(function() {
    var isChecked = $(this).prop('checked');
    if (isChecked) {
        var idx = $(this).closest('tr').data('idx');
        if(!isEmpty(idx)){
          content_idx_arr.push(idx)
        }
    }
  });
  console.log(content_idx_arr);
  if(content_idx_arr.length === 0){
    msgboxObj.message = '선택된 현황이 없습니다.';
    showiziModal(msgboxObj, getID('btn_chk_del'));
    return false;
  }

  let sendJSON = {};
  for(let i = 0; i < content_idx_arr.length; i++){
    sendJSON = {};
    sendJSON.idx = content_idx_arr[i];
    sendJSON.cmd = 'delete_subs_class';

    await call_admin_ajax(sendJSON);
  }

  view_page("apply_list_page");
});

// 관리자 다운로드 현황 선택삭제
$(document).on('click', '#btn_down_del', async function(){
  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: "선택한 다운로드현황을 모두 삭제하시겠습니까?",
    headerText : "알림",
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};

  var content_idx_arr = [];
  $('.dt-checkboxes').each(function() {
    var isChecked = $(this).prop('checked');
    if (isChecked) {
        var idx = $(this).closest('tr').data('idx');
        if(!isEmpty(idx)){
          content_idx_arr.push(idx)
        }
    }
  });
  console.log(content_idx_arr);
  if(content_idx_arr.length === 0){
    msgboxObj.message = '선택된 현황이 없습니다.';
    showiziModal(msgboxObj, getID('btn_down_del'));
    return false;
  }

  let sendJSON = {};
  for(let i = 0; i < content_idx_arr.length; i++){
    sendJSON = {};
    sendJSON.idx = content_idx_arr[i];
    sendJSON.cmd = 'delete_download';

    await call_admin_ajax(sendJSON);
  }

  view_page("download_page");
});

// 관리자 삭제된 내역 보기
$(document).on('click', '#subs_list_view_type', async function(){
  let tempJSON = [];
  if(isEmpty(subs_view_state)){
    
    if(!isEmpty(g_subs_list)){
      tempJSON = json_filter_arr(g_subs_list, 1, 'subs_delete');
    }
    if(tempJSON.length != 0){
      subs_view_state = "1";
      draw_admin_subs_list(tempJSON);
    }else{
      msgboxObj.type = t_error;
      msgboxObj.message = '데이터가 없습니다.';
      showiziModal(msgboxObj, getID('class_edate'));
      return;
    }
    $(this).text('신청현황 보기');
    $('#btn_chk_del').prop('disabled', true);

  }else{
    
    if(g_subs_list.length != 0){
      tempJSON = json_filter_arr(g_subs_list, 0, 'subs_delete');
    }
    if(tempJSON.length != 0){
      subs_view_state = "";
      draw_admin_subs_list(tempJSON);
    }else{
      msgboxObj.type = t_error;
      msgboxObj.message = '데이터가 없습니다.';
      showiziModal(msgboxObj, getID('class_edate'));
      return;
    }
    $(this).text('삭제된 내역 보기');
    $('#btn_chk_del').prop('disabled', false);
  }

});


// 날짜비교 - 클래스 시간 추가시
$(document).on('change', '#class_sdate', function(){
  let today = new Date();
  today = tobayDateMake(today);
  let sdate = $(this).val();
  let edate = $('#class_edate').val();
  if(!isEmpty(edate)){
   // 시작날짜 종료날짜 비교
   if (!compareDate(sdate, edate)){
      msgboxObj.message = '종료일은 시작일보다 빠를 수 없습니다.';
      showiziModal(msgboxObj, getID('class_edate'));
      $('#class_edate').val('');
      return false;
    }   
  }
  let tonum = today.replaceAll('-', '');
  let tosnum = sdate.replaceAll('-', '');
  msgboxObj.type = t_error;
  if(Number(tosnum) <= Number(tonum)){
    msgboxObj.message = '시작일이 오늘과 같거나 오늘보다 이전일 수 없습니다.';
    showiziModal(msgboxObj, getID('class_sdate'));
    $(this).val('');
    return false;
  }
});

$(document).on('change', '#class_edate', function(){
  let today = new Date();
  today = tobayDateMake(today);
  let edate = $(this).val();
  let sdate = $('#class_sdate').val();
  msgboxObj.type = t_error;
  if(!isEmpty(sdate)){
    
    if (!compareDate(sdate, edate)){
       msgboxObj.message = '종료일은 시작일보다 빠를 수 없습니다.';
      showiziModal(msgboxObj, getID('class_edate'));
      $('#class_edate').val('');
      return false;
    }   
  }
  let tonum = today.replaceAll('-', '');
  let tosnum = edate.replaceAll('-', '');
  if(Number(tosnum) <= Number(tonum)){
    msgboxObj.message = '종료일이 오늘과 같거나 오늘보다 이전일 수 없습니다.';
    showiziModal(msgboxObj, getID('class_edate'));
    $(this).val('');
    return false;
  }
});

//엑셀로 저장시 로그 남기기
// $(document).on('click', '.buttons-excel', async function(){
//   let tableId = $(this).parent().siblings('table').attr('id');
//   let fileName = "";
//   if(tableId === "subs_list_table"){ // 신청현황
//     fileName = "교육신청현황.xls";
//   }else if(tableId === "user_list_table"){ // 계정관리
//     fileName = "관리자_계정리스트.xls";
//   }else if(tableId === "main_table"){ // 교육관리
//     fileName = "교육관리.xls";
//   }else if(tableId === "down_list_table"){ // 교육관리
//     fileName = "다운로드현황.xls";
//   }

//   let sendJSON = {};
//   sendJSON.manager_id = g_login.manager_id;
//   sendJSON.manager_name = g_login.manager_name;
//   sendJSON.download_filename = fileName;
//   sendJSON.cmd = "download_excel";

//   await call_admin_ajax(sendJSON);
// });


// 사용자 인보이스 출력
$(document).on('click', '.btn_subs_down', async function(e){
  e.stopPropagation();
  let idx = $(this).data('idx');
  let type = $(this).data('type');
  let user = $(this).data('user');
  let tempJSON = {};
  if(isEmpty(user)){
    tempJSON = json_filter_json(g_my_subs_list, idx, 'idx');
  }else{
    tempJSON = json_filter_json(g_subs_list, idx, 'idx');
  }

  let today = new Date();
  today = tobayDateMake(today);
  let sendJSON = {};
  sendJSON.today = today;
  sendJSON.subs_country = tempJSON.subs_country;
  sendJSON.type = type;
  sendJSON.class_time = tempJSON.class_time;
  sendJSON.subs_company_name_ch = tempJSON.subs_company_name_ch;
  sendJSON.subs_company_name_en = tempJSON.subs_company_name_en;
  sendJSON.subs_currency = tempJSON.subs_currency;
  sendJSON.class_manager_ch = tempJSON.class_manager_ch;
  sendJSON.class_manager_en = tempJSON.class_manager_en;
  sendJSON.class_info_tel = tempJSON.class_info_tel;
  sendJSON.class_info_fax = tempJSON.class_info_fax;
  sendJSON.class_info_email = tempJSON.class_info_email;
  sendJSON.subs_user_name_ch = tempJSON.subs_user_name_ch;
  sendJSON.subs_user_name_en = tempJSON.subs_user_name_en;
  sendJSON.class_name_ch = tempJSON.class_name_ch;
  sendJSON.class_name_en = tempJSON.class_name_en;
  sendJSON.pay_dal_ch = tempJSON.pay_dal_ch;
  sendJSON.pay_ch_ch = tempJSON.pay_ch_ch;
  sendJSON.pay_dal_ch_1 = tempJSON.pay_dal_ch_1;
  sendJSON.pay_ch_ch_1 = tempJSON.pay_ch_ch_1;
  sendJSON.pay_kr_en = tempJSON.pay_kr_en;
  sendJSON.pay_en_en = tempJSON.pay_en_en;
  sendJSON.class_type = tempJSON.class_type;

  sendJSON = JSON.stringify(sendJSON);
  sendJSON = urlencode(sendJSON);
  


  if(isEmpty(user)){
    window.open(`invoice.html?data=${sendJSON}`, '_blank');
  }else{
    window.open(`../invoice.html?data=${sendJSON}`, '_blank');
  }

});

// 비밀번호 변경 팝업
$(document).on('click', '#btn_change_pw_popup', async function(){
  popupObj.title = "비밀번호 변경";
  popupObj.subtitle = "";
  popupObj.contentHtml = PagesContent.admin_change_pw;
  popupObj.width = 500;  
  popupObj.showfs = false;
  popupObj.showclose = true;

  showPopup(popupObj); 
});

// 비밀번호 변경 시
$(document).on('click', '#btn_change_password', async function(){
  let manager_id = g_login.manager_id;
  let now_pw = getIDValue('now_pw');
  let new_pw = getIDValue('new_pw');
  let new_pw_chk = getIDValue('new_pw_chk');

  msgboxObj.type = t_error;
  if (isEmpty(now_pw)) {  
    msgboxObj.message = '이전 비밀번호를 입력하세요.';
    showiziModal(msgboxObj, getID('now_pw'));
    return false;
  }
  if (isEmpty(new_pw)) {  
    msgboxObj.message = '새 비밀번호를 입력하세요.';
    showiziModal(msgboxObj, getID('new_pw'));
    return false;
  }
  if (isEmpty(new_pw_chk)) {  
    msgboxObj.message = '새 비밀번호 확인을 입력하세요.';
    showiziModal(msgboxObj, getID('new_pw_chk'));
    return false;
  }
  if(new_pw != new_pw_chk){
    msgboxObj.message = '새 비밀번호와 새  비밀번호 확인이 맞지 않습니다.';
    showiziModal(msgboxObj, getID('new_pw_chk'));
    return false;
  }

  let sendJSON = {};
  sendJSON.manager_id = manager_id;
  sendJSON.before_pw = now_pw;
  sendJSON.manager_pw = new_pw;
  sendJSON.cmd = "change_password";

  await call_admin_ajax(sendJSON);
});

$(document).on('click', '#btn_confirm_close', async function(){
  $('#greenAlerts').modal('hide');
});

$(document).on('click', '#btn_close_pop', async function(){
  hide_popup();
});

// 마우스 스크롤
$(document).on('mouseenter', '.table-responsive', function(){
  var x_scroll = $(this);

  x_scroll.on('wheel', function(event) {
      event.preventDefault();
      x_scroll.scrollLeft(x_scroll.scrollLeft() + event.originalEvent.deltaY);
  });

  x_scroll.on('mouseleave', function() {
    x_scroll.off('wheel');
  });
});

$(document).on('keyup', '#subs_list_table_filter input[type="search"]', function(){
  var column = $('#searchColumn').val();
  if(!isEmpty(column) || column != "all"){
    table.columns(column).search(this.value).draw();
  }
  g_dataTable_search_value = this.value;
});

$(document).on('change', '#searchColumn', function(){
  var column = $(this).val();
  $('#subs_list_table_filter input[type="search"]').val('');
  $('#subs_list_table_filter input[type="search"]').trigger('keyup');
  g_subs_select = column;
  if(Number(column) === 4){
    $('#search_type_div').css('display', 'flex');
    $('#subs_list_table_filter input[type="search"]').css('display', 'none');
    $('#subs_list_sdate').datepicker(DATE_TIME_CONFIG);
    $('#subs_list_edate').datepicker(DATE_TIME_CONFIG);
  }else{
    $('#search_type_div').css('display', 'none');
    $('#subs_list_table_filter input[type="search"]').css('display', 'block');
  }
});

// 신청현황에서 교육날짜 선택시
$(document).on('change', '#subs_list_sdate', function(){
  let column = $('#searchColumn').val();
  let sdate = getIDValue('subs_list_sdate');
  let edate = getIDValue('subs_list_edate');
  let value = "";
  if(!isEmpty(edate)){
    $('#subs_list_table_filter input[type="search"]').trigger('keyup');
    sdate = sdate.replaceAll('-', '.');
    edate = edate.replaceAll('-', '.');
    value = sdate + ' ~ ' + edate;
    table.columns(column).search(value).draw();
    g_dataTable_search_value = value;
  }
});
$(document).on('change', '#subs_list_edate', function(){
  let column = $('#searchColumn').val();
  let sdate = getIDValue('subs_list_sdate');
  let edate = getIDValue('subs_list_edate');
  let value = "";
  if(!isEmpty(sdate)){
    $('#subs_list_table_filter input[type="search"]').trigger('keyup');
    sdate = sdate.replaceAll('-', '.');
    edate = edate.replaceAll('-', '.');
    value = sdate + ' ~ ' + edate;
    table.columns(column).search(value).draw();
    g_dataTable_search_value = value;
  }
});


function draw_apply_info(plang, pdata){
  let tmphtml = "";
  if (isEmpty(pdata)){
    tmphtml = `<div class=" text-left flex items-center gap-2 border-bt">
    <div class='w-3/12 text-center bg-gray-100 px-2 py-1'>
      <span>${plang}</span>
    </div>
    <div class='w-9/12 bg-white px-2 py-1'>
      <span>-</span> 
    </div>
    </div>`;
  }
  else{
    tmphtml = `<div class=" text-left flex items-center gap-2 border-bt">
    <div class='w-3/12 text-center  bg-gray-100 px-2 py-1'>
      <span>${plang}</span>
    </div>
    <div class='w-9/12 bg-white px-2 py-1 break-all'>
      <span>${pdata}</span> 
    </div>
    </div>`;
  }
  return tmphtml;
}

$(document).on('click', '#invoice_print', function(){
  $('#in_btn_div').css('display', 'none');
  window.print();
  $('#in_btn_div').css('display', 'block');
});

// 클래스 삭제
$(document).on('click', '#btn_delete_class_list', async function(){
  var bconfirm = false;
  await greenModal({
    type: "confirm",
    messageText: "해당 클래스 정보를 삭제하시겠습니까? \n 교육에 설정 되어있던 시간도 함께 삭제됩니다.",
    headerText : "알림",
    alertType: "info"
  }).done(function (event) {
    bconfirm = event;
    return true;
  });
  if (!bconfirm) {return false};

  let idx = $('#idx').val();
  let sendJSON = {};
  sendJSON.idx = idx;
  sendJSON.cmd = 'delete_class_list';

  await call_admin_ajax(sendJSON);

  let params = {}
  params.cmd = "load_class_list";
  await call_admin_ajax(params);

  draw_class_list(g_class_json);
});

// 교육신청시 이미지파일 미리보기
$(document).on('change', '#img_ch', function(e){
  let target = $('#preview_ch_img');
  let file = e.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function(e) {
      // 읽은 이미지를 div에 표시
      target.html(`<img class='block' style="width: 150px;" src="${e.target.result}" alt="Uploaded Image">`);
    };
    reader.readAsDataURL(file);
  }
});
$(document).on('change', '#img_en', function(e){
  let target = $('#preview_en_img');
  let file = e.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function(e) {
      // 읽은 이미지를 div에 표시
      target.html(`<img class='block' style="width: 150px;" src="${e.target.result}" alt="Uploaded Image">`);
    };
    reader.readAsDataURL(file);
  }
});