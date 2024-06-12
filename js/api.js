
/* @brief ajax 전처리 (팝업 출력 및 header 설정 등)
*  @date 2023/08/25
*  @return 
*  @param param : 전송할 파라미터
*   async : 비동기 처리를 위해, 프로젝트 생성 시 칼럼 업데이트 등 작업량이 많을 경우
          화면이 정지 상태로 있는 것을 방지하기 위해, 이 경우 ajax 호출 결과, done 처리에 
          이후 처리 프로세스를 추가한다. (프로젝트 화면 그리기 등)
          로딩 대기 알림을 위해 버튼 메시지 변경 및 popup-btn 클래스 버튼 활성화 방지
*/
async function call_ajax(param, async=false){
  // ajax 호출 전 버튼 중복 클릭 방지 설정 및 버튼 메시지 변경
  //toogleTargetText('처리중', true);

  try {
    headers = {};
    return await xhr_palin("server/api_main.php", param, 
           "json", "json", "POST", async, headers);  
  }
  catch(e){
    msgboxObj.status = 'call_ajax [' + exception_error_code + ']';
    msgboxObj.message = e.message;
    msgboxObj.closetime = no_delay;
    msgboxObj.type = t_error;
    msgboxObj.title = title_alert;
    await showiziModal(msgboxObj);
  }
}

async function call_admin_ajax(param, async=false){
  // ajax 호출 전 버튼 중복 클릭 방지 설정 및 버튼 메시지 변경
  //toogleTargetText('처리중', true);

  try {
    headers = {};
    headers.Authorization = "Bearer " + g_access_token;
    return await xhr_palin("../server/api_main.php", param, 
           "json", "json", "POST", async, headers);  
  }
  catch(e){
    msgboxObj.status = 'call_ajax [' + exception_error_code + ']';
    msgboxObj.message = e.message;
    msgboxObj.closetime = no_delay;
    msgboxObj.type = t_error;
    msgboxObj.title = title_alert;
    await showiziModal(msgboxObj);
  }
}


/* @brief Ajax 처리 (plain data)
*  @date 2023/03/02
*  @return 
*  @param url : server url, headers : header(json), data : 전송 데이터
*/
async function xhr_palin(url, data, contentType="json", returnType="json", method="POST", 
              async=false, headers=null) {
  return new Promise(function(resolve, reject){ // promise 정의                                
    
    switch (contentType) {
      case "text" : pcontentType = 'text/html; charset=utf-8'; break;
      case "json" : pcontentType = 'application/json; charset=utf-8'; break;
      case "encode" : pcontentType = 'application/x-www-form-urlencoded; charset=utf-8'; break;
      default : contentType = 'text/html; charset=utf-8'; 
    }
  
    try {
      return $.ajax({
        url: url,
        data : JSON.stringify(data),            // 전달될 데이터
        //type: type,           // jquery 1.9.0 이전 버전 사용 시      
        async: async,           // sync 처리
        method : method,        // 전달 방법 : POST, GET, PUT
        dataType: returnType,   // 서버 리턴 타입  (json, text, xml 등)    
        headers: headers,     
  //      timeout: 20000,         // 타임 아웃 설정 (1000 = 1초)
        contentType : contentType,
        beforeSend: showloading()      // async가 false일 때는 적용되지 않는다.
      })
      .done(function(res){
        g_access_token = "";
        if (!isEmpty(res.token)){
          g_access_token = res.token;
        } 
        var status = res.status;
        var cmd  = res.cmd;
        msgboxObj.status = cmd + ' [' + status + ']';
        if (isEmpty(res.statusText)){
          msgboxObj.message = res.data.message;
        }else{
          msgboxObj.message = res.statusText;
        }

        // $.inArray, es6(array.includes)
        if (!status_sucess_code.includes(status)){
          msgboxObj.closetime = no_delay;
          msgboxObj.type = t_error;
          msgboxObj.title = title_alert;
          showiziModal(msgboxObj);
          resolve(false);
          return false;
        }
        switch (cmd){
          case "regen_userpassword" :
            msgboxObj.message = msg_lang.msg_regen_password[g_lang];
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "admin_regen_userpassword" :
            msgboxObj.message = "비밀번호가 재발행 되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          // 수강신청 확인
          case "check_subscription" : 
            draw_page(PagesContent.common_header, PagesContent.project_index);
            break;
          case "subs_class_check" : 
            g_my_subs_list = res.data.tabledata;
            if(g_my_subs_list.length === 0){
              // 신종훈 수정 : 메시지 처리
              msgboxObj.message = msg_lang.subs_class_check[g_lang];
              msgboxObj.closetime = msg_close_delay;
              msgboxObj.type = t_error;
              msgboxObj.title = title_default;
              showiziModal(msgboxObj);
            }else{
              // $('#btn_modal_close').trigger('click');
              draw_subs_list();
            }
            break;
          case "login" :
            if (checkLogin(res))
            {
              gotoPage('admin/index.html', '');
            }
            else{
              /** 2024-03-06 수정 : 
               * 로그인이 올바르지 않을 경우 index 페이지로 이동
              */
              if(isEmpty(g_page_type)){
                gotoPage('../index.html', '');
              }
            }
            break;
          case "login_token":
            if (checkLogin(res))
            {
              if(!isEmpty(g_page_type)){
                gotoPage('admin/index.html', '');
              }else{
                g_login = res.data;
                view_page('index');               
              }            
            }
            break;
          case "logout":
              gotoPage('../index.html', '');

            
            break;
          case "load_classtime" :
            g_classtime_json = res.data.tabledata;
            break;
          case "load_class_time_admin" :
            g_classtime_json = res.data.tabledata;
            break;
          case "load_class_list" :
            g_class_json = res.data.tabledata;
            break;
          case "load_subs_list" :
            g_subs_list = res.data.tabledata;
            break;
          case "load_member_list" :
            g_user_list = res.data.tabledata;
            break;
          case "load_down_list" :
            g_down_list = res.data.tabledata;
            break;
          case "insert_category":
            msgboxObj.message = "정보가 등록되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            // 팝업을 숨기지 않아야 할 경우
            if (!(cmd == "insert_contents_plan")){
              //hide_popup();
            }
            break;          
          case "insert_member":
            msgboxObj.message = "계정이 등록되었습니다.";
            msgboxObj.closetime = no_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            hide_popup();
            break;
          case "update_member":
            msgboxObj.message = "계정정보가 수정되었습니다.";
            msgboxObj.closetime = no_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            hide_popup();
            break;
          case "change_password":
            msgboxObj.message = "비밀번호가 변경되었습니다.";
            msgboxObj.closetime = no_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            hide_popup();
            break;
          case "insert_user_subs_class":
            msgboxObj.message = msg_lang.msg_completed_apply[g_lang];
            msgboxObj.closetime = no_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            // msgboxObj.link = "index.html";
            showiziModal(msgboxObj);
            break;
          case "insert_class_time":
            msgboxObj.message = "시간등록이 완료되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "insert_class_info":
            msgboxObj.message = "교육등록이 완료되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "download_excel":
            msgboxObj.message = "엑셀파일 다운로드가 완료되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "update_class_info":
            msgboxObj.message = "교육수정이 완료되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "update_subs_class":
            msgboxObj.message = "납입처리가 완료되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "update_class_time":
            msgboxObj.message = "교육시간 수정이 완료되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "delete_subs_class":
            msgboxObj.message = "신청현황이 정상적으로 삭제되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "delete_download":
            msgboxObj.message = "다운로드현황이 정상적으로 삭제되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "delete_class_time":
            msgboxObj.message = "교육시간이 정상적으로 삭제되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "delete_class_list":
            msgboxObj.message = "교육정보가 정상적으로 삭제되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            break;
          case "delete_user":
            msgboxObj.message = "계정이 삭제되었습니다.";
            msgboxObj.closetime = msg_close_delay;
            msgboxObj.type = t_sucess;
            msgboxObj.title = title_default;
            showiziModal(msgboxObj);
            hide_popup();
            break;
          default :
            break;
        }
      })
      .fail(function(xhr) { 
        msgboxObj.status = data.cmd + ' [' + xhr.status + ']';
        // 실패 시에는 responseText를 그대로 출력한다.
        msgboxObj.message = xhr.responseText;
        msgboxObj.closetime = no_delay;
        msgboxObj.type = t_error;
        msgboxObj.title = title_alert;
        showiziModal(msgboxObj);  
        resolve(true);
      })
      // 항상 실행
      .always(function(xhr) { 
        if (bdebug){
          url = "";
        }
        if (xhr.status == '404'){
          msgboxObj.status = data.cmd + ' [' + xhr.status + ']';
          msgboxObj.message = xhr.statusText + ' (' + url + ')';
          msgboxObj.closetime = no_delay;
          msgboxObj.type = t_error;
          msgboxObj.title = title_alert;
          showiziModal(msgboxObj);
          if (data.cmd == "login"){
            draw_login();
          }
        }
        showloading();
        resolve(true);
      });
    }
    catch(e) {
      console.log(e)
      msgboxObj.status = "500";
      msgboxObj.message = e.message;
      msgboxObj.closetime = no_delay;
      msgboxObj.type = t_error;
      msgboxObj.title = title_alert;
      showiziModal(msgboxObj);
    }
  });
}

/* @brief Ajax 처리 - Multipart data (image, binary 등)
  *  @date 2023/03/02
  *  @return 
  *  @param url : server url, header(json), data : 전송 데이터(formdata), type = post(default)/get
  *  @header = {"Authorization": "Bearer token"}
  */
function xhr_multipart(url, formdata, headers=null, dataType="text", async=true) {
  return $.ajax({
    url: url,
    data : formdata,
    type: "POST",           
    async: async,
    headers: headers,      // json
    enctype: "multipart/form-data", //form data 설정,
    processData: false, //프로세스 데이터 설정 : false 값을 해야 form data로 인식합니다
    contentType: false, //헤더의 Content-Type을 설정 : false 값을 해야 form data로 인식합니다
    //beforeSend: showLoadingButton(true, '#btnSetCookie')
  })
  .done(function(res){
    console.log(res);
    let response = JSON.parse(res);
    switch (response.cmd){
      case "upload_file":
        console.log(response);
        break;
      default :
      break;
    }
  })
  .fail(function(xhr, textStatus, errorThrown) { 
    // delay(3000);
    console.log(xhr);
    console.log(textStatus);
    console.log(errorThrown);

  })
  .always(function(xhr, textStatus, errorThrown) { 

  });
}

// 바닐라 JS Fetch 사용 (Internet Explorer에서는 fetch 함수가 제공되지 않음)
function fetchData(url) {
  // try{
  //   const response = await fetch(url)
  //   .then(response=>{
  //     if (!response.ok) {
  //       // 응답이 성공적이지 않은 경우
  //       return response.status;
  //     }
  //     else{
  //     // 성공적인 경우 응답
  //       return response;
  //     }
  //   })
  // }
  // catch(error){
  //   console.error("error:",  error)
  // }
  // return response;
  return new Promise((resolve, reject) => {
    $.get(url, function(data) {
      resolve(data);
    }).fail(function(error) {
      reject(error);
    });
  });
}

async function fetchAllPagesContent(PList) {
  for (const [key, value] of Object.entries(PList)) {
    try {
      const data = await fetchData(value);
      PagesContent[key] = data;
    } catch (error) {
      PagesContent[key] = error.status; // error.statusText
    }
  }
}
