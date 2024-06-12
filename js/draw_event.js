// 서버로부터 페이지 정보 템플릿 정보를 불러와 저장한다.
// 페이지 로드시마다 불러올 경우 페이지 로딩 시간이 길어질 수 있으므로
// html 구조를 미리 불러와 저장한 후 로컬에서 로드하도록 구현
async function getPageList(PList){
  try{
    await fetchAllPagesContent(PList)
  }
  catch(e){
    alert(e.message);
  }
}


// 페이지별 언어를 설정한다.
// index 페이지는 영문으로 출력, 이후 페이지는 선택된 언어(g_lang)로 출력
function setLanguage(page){
  if (isEmpty(g_lang)){
    g_lang = "en";
  }

  // 공통 언어 적용 
  $('#btn_check_subscription').html(lang.index.btn_check_subscription[g_lang]);
  $('#label_address').html(lang.index.label_address[g_lang]);
  $('#link_name').html(lang.index.link_name[g_lang]);
  $('#link_directions').html(lang.index.link_directions[g_lang]);
  $('#link_privacy').html(lang.index.link_privacy[g_lang]);
  $('#link_TermsofUse').html(lang.index.link_TermsofUse[g_lang]);
  $('#label_cert').html(lang.index.label_cert[g_lang]);
  $('#label_eleaing').html(lang.index.label_eleaing[g_lang]);


  switch (page){
    case "index" : 
      $('#index_title').text(lang.index.index_title[g_lang]);

      // 중국어 신청 고정 표현
      $('#btn_subscription_ch').text(lang.index.btn_subscription_ch['ch']);
      $('#btn_subscription_en').text(lang.index.btn_subscription_en[g_lang]);


      break;
    case "step1" : 
      $('#index_title').text(lang.index.index_title[g_lang]);
      let tmphtml = "";
      let tempJSON = json_filter_arr(g_class_json, 1, 'class_active');
      tempJSON.sort(function(a, b) {
        return a.view_order - b.view_order;
    });
      $.each(tempJSON, function(key, items){
        let img = items[`class_img_${g_lang}`];
        let link = "";
        if(isEmpty(img)){
          link = "images/class/class_default.png";
        }else{
          link = `images/class/${img}`;
        }
        tmphtml = tmphtml + `<div class="card h-fit bg-white shadow-lg rounded-lg p-4 text-center btn_class_view" 
        data-idx="${items.idx}">
              <img class="h-40 w-full object-cover rounded-md" src="${link}" alt="">
              </div>
              `;
        // $(`#btn_class${items.idx}`).text(items[`class_name_${g_lang}`]);
        // $(`#btn_class${items.idx}`).attr('data-idx', items.idx);
        // $(`#class_img_${items.idx}`).attr('src', `images/class_${g_lang}_${items.idx}.jpg`);
      });
      $('#div_class_card').html(tmphtml);
      break;
    case "step2" : 
      // 필터링 한다.
      let tmpclassinfo = json_filter_arr(g_class_json, g_class_idx, 'idx');
      tmpclassinfo = tmpclassinfo[0];
      // 이미지
      $('#btn_apply_education').text(lang.step2.period[g_lang]);

      $('#file_schedule').text(lang.step2.file_schedule[g_lang]);
      $('#file_business').text(lang.step2.file_business[g_lang]);

      let img = tmpclassinfo[`class_img_${g_lang}`];
      let link = "";
      if(isEmpty(img)){
        link = "images/class/class_default.png";
      }else{
        link = `images/class/${img}`;
      }
      // 교육과정 - 대표 이미지
      $('#class_image').attr('src', `${link}`);

      $('#class_title').html(g_class_name);

      // 교육비
      $('#class_cost_title').html(class_list.class_cost_title[g_lang]);
      $('#class_cost_info').html(urldecode(tmpclassinfo['class_cost_info_' +g_lang]));
      //$('#class_cost_info').html(class_list[g_class_idx].class_cost_info[g_lang]);
      $('#class_cost_method_title').html(class_list.class_cost_method_title[g_lang]);
      $('#class_cost_method_info').html(urldecode(tmpclassinfo['class_cost_method_info_' + g_lang]));
      //$('#class_cost_method_info').html(class_list[g_class_idx].class_cost_method_info[g_lang]);

      // 교육스케쥴 추가 안내 문구(영문만)
      // 교육시간 관련 영문 추가 안내를 적용한다.
      $('#div_class_schedule_info').append(urldecode(tmpclassinfo['class_schedule_info_' + g_lang]));

      // 교육일정/장소
      $('#class_schedule_title').html(class_list.class_schedule_title[g_lang]);
      
      // 학습방법
      $('#class_method_title').html(class_list.class_methond_title[g_lang]);
      $('#class_method_info').html(urldecode(tmpclassinfo['class_method_info_' +g_lang]));

      // 과정안내
      $('#class_content_title').html(class_list.class_content_title[g_lang]);
      $('#class_content_info').html(urldecode(tmpclassinfo['class_content_info_' +g_lang]));

      // 문의처
      $('#class_contact_title').html(class_list.class_contact_title[g_lang]);
      // $('#class_contact_info').html(class_list[g_class_idx].class_contact_info[g_lang]);
      $('#class_contact_info').html(tmpclassinfo.class_info_email);


      // $('#payment_instructions_title').text(class_list.payment_instructions_ko.info_title);
      // $('#bank_account').text(class_list.payment_instructions_ko.bank_account);
      // $('#account_holder').text(class_list.payment_instructions_ko.account_holder);
      // $('#notice').text(class_list.payment_instructions_ko.notice);
      // $('#payment_instructions_ch_title').text(class_list.payment_instructions_ch.title);

      // for(let i = 0; i < class_json.payment_instructions_ch.info.length; i++){
      //   $('#ch_pay_list').append(`<li class='text-sm'>${class_json.payment_instructions_ch.info[i]}</li>`);
      // }
      
      break;
    case "apply" : 
      // 안보일 정보 감추기
      $('#class_2_view').css('display', 'none');
      $('#subs_user_zipcode_div').css('display', 'none');
      if(g_lang === "en"){
        $('.ch_view').css('display', 'none');
      }
      if(Number(g_class_idx) === 2){
        $('#class_2_view').css('display', 'flex');
        $('#subs_user_zipcode_div').css('display', 'flex');
      }
      // 전달값 설정
      let tmpText = "";
      // 담당자가 g_class_name만 노출 희망
      // tmpText = lang.apply.label_class_name[g_lang] + " : " + g_class_name;
      tmpText = g_class_name;
      $('#label_class_name').text(tmpText);
      tmpText = lang.apply.label_class_time[g_lang] + " : " + g_class_time;
      $('#label_class_time').text(tmpText);

      // 인터페이스 언어 설정
      $('#btn_edu_application').html(lang.apply.btn_edu_application[g_lang]);
      $('#apply_class_title').html(lang.apply.apply_class_title[g_lang]);

      $('#apply_class_title').html(lang.apply.apply_class_title[g_lang]);

      $('#label_username_ch').html(lang.apply.label_username_ch[g_lang]);
      $('#subs_user_name_ch').attr('placeholder', msg_lang.susb_user_name_ch[g_lang]);

      $('#label_username_en').html(lang.apply.label_username_en[g_lang]);
      $('#subs_user_name_en').attr('placeholder', msg_lang.susb_user_name_en[g_lang]);

      // ** 직위, 성별...에 대한 언어 설정 계속
      $('#label_company_position').html(lang.apply.label_company_position[g_lang]);
      $('#subs_company_position').attr('placeholder', msg_lang.subs_company_position[g_lang]);

      $('#label_chk_sex').html(lang.apply.label_chk_sex[g_lang]);

      $('#label_identity_number').html(lang.apply.label_identity_number[g_lang]);
      $('#subs_identity_number').attr('placeholder', msg_lang.subs_identity_number[g_lang]);

      $('#label_phone_number').html(lang.apply.label_phone_number[g_lang]);
      $('#subs_phone_number').attr('placeholder', msg_lang.subs_phone_number[g_lang]);

      $('#label_user_email').html(lang.apply.label_user_email[g_lang]);
      $('#subs_user_email').attr('placeholder', msg_lang.subs_user_email[g_lang]);

      $('#label_user_zipcode').html(lang.apply.label_user_zipcode[g_lang]);
      $('#subs_user_zipcode').attr('placeholder', msg_lang.subs_user_zipcode[g_lang]);

      $('#label_company_name_ch').html(lang.apply.label_company_name_ch[g_lang]);
      $('#subs_company_name_ch').attr('placeholder', msg_lang.subs_company_name_ch[g_lang]);

      $('#label_ceo_name').html(lang.apply.label_ceo_name[g_lang]);
      $('#subs_ceo_name').attr('placeholder', msg_lang.subs_ceo_name[g_lang]);

      $('#label_company_name_en').html(lang.apply.label_company_name_en[g_lang]);
      $('#subs_company_name_en').attr('placeholder', msg_lang.subs_company_name_en[g_lang]);

      $('#label_company_name_ko').html(lang.apply.label_company_name_ko[g_lang]);
      $('#subs_company_name_ko').attr('placeholder', msg_lang.subs_company_name_ko[g_lang]);

      $('#label_company_address_ch').html(lang.apply.label_company_address_ch[g_lang]);
      $('#subs_company_address_ch').attr('placeholder', msg_lang.subs_company_address_ch[g_lang]);

      $('#label_company_address_en').html(lang.apply.label_company_address_en[g_lang]);
      $('#subs_company_address_en').attr('placeholder', msg_lang.subs_company_address_en[g_lang]);

      $('#label_agent_name').html(lang.apply.label_agent_name[g_lang]);
      $('#subs_agent_name').attr('placeholder', msg_lang.subs_agent_name[g_lang]);

      $('#label_agent_manager').html(lang.apply.label_agent_manager[g_lang]);
      $('#subs_agent_manager').attr('placeholder', msg_lang.subs_agent_manager[g_lang]);

      $('#label_agent_phone_number').html(lang.apply.label_agent_phone_number[g_lang]);
      $('#agent_phone_number').attr('placeholder', msg_lang.agent_phone_number[g_lang]);

      $('#label_agent_email').html(lang.apply.label_agent_email[g_lang]);
      $('#agent_email').attr('placeholder', msg_lang.agent_email[g_lang]);

      $('#label_chk_currency').html(lang.apply.label_chk_currency[g_lang]);

      $('#label_depositor_name').html(lang.apply.label_depositor_name[g_lang]);
      $('#subs_depositor_name').attr('placeholder', msg_lang.subs_depositor_name[g_lang]);

      $('#label_user_password').html(lang.apply.label_user_password[g_lang]);
      $('#subs_user_password').attr('placeholder', msg_lang.subs_user_password[g_lang]);

      $('#label_men').html(lang.apply.label_men[g_lang]);
      $('#label_gril').html(lang.apply.label_gril[g_lang]);

      $('#label_wechat').html(lang.apply.label_wechat[g_lang]);
      $('#subs_user_wechat').attr('placeholder', msg_lang.subs_user_wechat[g_lang]);

      $('#label_agent_wechat').html(lang.apply.label_agent_wechat[g_lang]);
      $('#agent_wechat').attr('placeholder', msg_lang.agent_wechat[g_lang]);

      $('#label_birth').html(lang.apply.label_birth[g_lang]);
      $('#subs_birth').attr('placeholder', msg_lang.subs_birth[g_lang]);
      break;
    default :
      break;
  }
}

/**
 * classtime 정보를 출력한다. (targetid : class_time_list)
 */
function setClassTime(){
  let tmp_classname = "classtime";
  draw_radio_data(g_classtime_json, '#div_class_schedule', '', 
          'class_time', 'class_time', 'class_place', true, tmp_classname);
}

/**
 * 관리자 페이지 그리기
 * 
 */
async function view_page(page){
  switch (page){
    case "index" :
      draw_index();
      break;
    case "apply_list_page" :
      draw_subs_list_page();
      break;
    case "download_page" :
      draw_download_page();
      break;
    case "user_page" :
      draw_user_page();
      break;
    default : 
      break;
  }  
}

function draw_download_page(){
  $('#content_body').load('component/down_list.html', async function(){
    let params = {}
    params.cmd = "load_down_list";
    await call_admin_ajax(params);
  
    if(!isEmpty(g_down_list)){
      draw_down_list_table(g_down_list);
    }
  });
};

async function draw_down_list_table(cJSON){
  // 기존에 만들어진 테이블이 존재할 경우 초기화 해줘야 한다. (reinitailize 에러 발생)
  $('#down_list_table').DataTable().clear().destroy();
  table = new DataTable('#down_list_table', {
    rowCallback: function(row, data, index) {
      // 각 행에 클래스 추가
      $(row).addClass('datatable-tr');
      $(row).attr('data-idx', data.idx);
    },
    // "search" : {
    //   "search" : local_search_data
    // },
    // order : [[local_table_order_index, local_table_order]],
     // 칼럼 Resize 및 보이기 숨기기
    // dom : l : Length Change, f : 필터, t : 테이블, i : 정보출력, p : 페이지네이션, r:
    dom: 'C<"clear">B<"clear">lfrtip',
    // 페이지 유지
    stateSave: false,
    // 랭기지팩 적용
    language: {url : 'lib/DataTable/ko.json'},
    // 한화면 출력 개수 
    lengthMenu: [
      [5, 10, 20, -1],
      [5, 10, 20, '모두 보기']
    ],
    responsive: true,
    columnDefs: [
      {
        'targets': 0,
        'checkboxes': {
          'selectRow': true
        }

      },
    ],
    // 멀티 체크 적용
    select: {
      'style': 'multi'
    },
    data: cJSON,

    paging: true,              // 페이징을 한다.
    pageLength: 10, 
    buttons: [
      {
          extend: 'copyHtml5'
      }
    ],
    columns: [
        {
          targets: 0,
          data: {'idx' : cJSON.idx},
          defaultContent: '',
          orderable: false,
          className: 'select-checkbox',
          width: 15
        },
        { className: "text-center", // 다운로드 날짜
          data: function(objectJSON){
            return objectJSON.download_date;
           }
        },
        { className: "text-center",
          data: function(objectJSON){ //유저 아이디  
          return `<p data-idx=${objectJSON.idx}>${objectJSON.manager_id}</p>`;
        }
        },
        { className: "text-center",
          data: function(objectJSON){ //유저 이름  
          return objectJSON.manager_name;
        }
        },
        { className: "text-center", // 파일명
          data: function(objectJSON){
            return objectJSON.download_filename;
          }
        }
    ],
    order: [[2, 'asc']]
  });
}

function draw_index(){
  try{
    $('#db_wrapper').load('component/template.html', function(){
      $('#nav_aside').load('component/nav_aside.html', function(){
      });
  
      $('#content_header').load('component/nav_top.html', function(){
        feather.replace();
        $('#user_name').text(g_login.manager_name)
      });
      $('#content_body').load('component/main_content.html', async function(){
  
        let params = {}
        params.cmd = "load_class_list";
        await call_admin_ajax(params);
  
        params = {}
        params.cmd = "load_subs_list";
        await call_admin_ajax(params);
  
        params = {}
        params.cmd = "load_class_time_admin";
        await call_admin_ajax(params);
  
        if(g_class_json.length != 0){
          draw_class_list(g_class_json);
        }

        let mem_level = g_login.mem_level;
        if(Number(mem_level) != 5){
          $('#btn_download_page').css('display', 'none');
          $('#btn_user_list_page').css('display', 'none');
        }
      });
    });  
  }catch(e){
    msgboxObj.status = 500;
    msgboxObj.message = e.message;
    msgboxObj.closetime = no_delay;
    msgboxObj.type = t_error;
    msgboxObj.title = title_default;
    showiziModal(msgboxObj);
  }
 
}

// 관리자페이지 클래스리스트 그리기
function draw_class_list(cJSON){
   // 기존에 만들어진 테이블이 존재할 경우 초기화 해줘야 한다. (reinitailize 에러 발생)
   $('#main_table').DataTable().clear().destroy();
   table = new DataTable('#main_table', {
    rowCallback: function(row, data, index) {
      // 각 행에 클래스 추가
      $(row).addClass('datatable-tr');
      $(row).addClass('btn_update_class');
      $(row).attr('data-idx', data.idx);
    },
     // "search" : {
     //   "search" : local_search_data
     // },
     // order : [[local_table_order_index, local_table_order]],
      // 칼럼 Resize 및 보이기 숨기기
     // dom : l : Length Change, f : 필터, t : 테이블, i : 정보출력, p : 페이지네이션, r:
     dom: 'C<"clear">B<"clear">lfrtip',
     // 페이지 유지
     stateSave: false,
     // 랭기지팩 적용
     language: {url : 'lib/DataTable/ko.json'},
     // 한화면 출력 개수 
     lengthMenu: [
       [5, 10, 20, -1],
       [5, 10, 20, '모두 보기']
     ],
     responsive: true,
     columnDefs: [
       // { width: 10, targets: 0 }, // 체크박스
       {
         'targets': 0,
         'checkboxes': {
           'selectRow': true
         }
 
       },
     ],
     // 멀티 체크 적용
     select: {
       'style': 'multi'
     },
     data: cJSON,
 
     paging: true,              // 페이징을 한다.
     pageLength: 10, 
     buttons: [
       {
           extend: 'copyHtml5'
       }
     ],
     columns: [
         {
           targets: 0,
           data: {'idx' : cJSON.idx},
           defaultContent: '',
           orderable: false,
           className: 'select-checkbox'
         },
         { className: "text-center",
         data: function(objectJSON){ 
          let tempRtn = `<button class='basic-btn-2 text-sm btn-default-bg-color text-white py-1 px-3 btn_class_time_update' data-idx=${objectJSON.idx}>관리</button>`;

          return tempRtn;
         }
       },
       { className: "text-center",
           data: function(objectJSON){ 
             let tempRtn = objectJSON.class_active;
 
             return getActiveMessage(tempRtn);
           }
         },
         { className: "text-center fixed-column cursor-pointer",
           data: function(objectJSON){ 
             let tempRtn = objectJSON.class_name_ko;
 
             return tempRtn;
           }
         },
         { className: "text-center",
           data: function(objectJSON){ 
            let tempRtn = objectJSON.class_name_ch;
 
             return tempRtn;
           }
         },
         { className: "text-center",
           data: function(objectJSON){ 
             let tempRtn = objectJSON.class_name_en;
 
             return tempRtn;
           }
         },
         { className: "text-center",
           data: function(objectJSON){ 
             let tempRtn = objectJSON.class_manager_ch;
 
             return tempRtn;
           }
         },
         { className: "text-center",
           data: function(objectJSON){ 
             let tempRtn = objectJSON.class_manager_en;
 
             return tempRtn;
           }
         },
         { className: "text-center",
           data: function(objectJSON){ 
             let tempRtn = objectJSON.class_info_tel;
 
             return tempRtn;
           }
         },
         { className: "text-center",
           data: function(objectJSON){ 
             let tempRtn = objectJSON.class_info_fax;
 
             return tempRtn;
           }
         },
         { className: "text-center",
           data: function(objectJSON){ 
             let tempRtn = objectJSON.class_info_email;
 
             return tempRtn;
           }
         },
         { className: "text-right",
           data: function(objectJSON){ 
             let tempRtn = '$' + numberWithPointValue(objectJSON.pay_en_en);
 
             return tempRtn;
           }
         },
         { className: "text-right",
           data: function(objectJSON){ 
             let tempRtn = numberWithPointValue(objectJSON.pay_kr_en) + 'WON';
 
             return tempRtn;
           }
         },
         { className: "text-right",
           data: function(objectJSON){ 
             let tempRtn = '$' + numberWithPointValue(objectJSON.pay_dal_ch);
 
             return tempRtn;
           }
         },
         { className: "text-right",
           data: function(objectJSON){ 
             let tempRtn = numberWithPointValue(objectJSON.pay_ch_ch) + 'WON';
 
             return tempRtn;
           }
         }
     ],
     order: [[2, 'asc']]
   });
}

// 관리자페이지 신청목록 그리기
async function draw_subs_list_page(){
  $('#content_body').load('component/subs_list.html', async function(){
    let params = {}
    params.cmd = "load_subs_list";
    await call_admin_ajax(params);

    if(!isEmpty(g_subs_list)){
      let tempJSON = json_filter_arr(g_subs_list, 0, 'subs_delete');
      draw_admin_subs_list(tempJSON);
    }
  });
}  

// 관리자페이지 신청목록 그리기
async function draw_user_page(){
  $('#content_body').load('component/user_list.html', async function(){
    let params = {}
    params.cmd = "load_member_list";
    await call_admin_ajax(params);
  
    if(!isEmpty(g_user_list)){
      draw_admin_user_list(g_user_list);
    }
  });
}  

// 리스트 그리기
async function draw_admin_user_list(cJSON){
  // 기존에 만들어진 테이블이 존재할 경우 초기화 해줘야 한다. (reinitailize 에러 발생)
  $('#user_list_table').DataTable().clear().destroy();
  table = new DataTable('#user_list_table', {
    rowCallback: function(row, data, index) {
      // 각 행에 클래스 추가
      $(row).addClass('datatable-tr');
      $(row).addClass('btn_update_user');
      $(row).attr('data-idx', data.idx);
    },
    // "search" : {
    //   "search" : local_search_data
    // },
    // order : [[local_table_order_index, local_table_order]],
     // 칼럼 Resize 및 보이기 숨기기
    // dom : l : Length Change, f : 필터, t : 테이블, i : 정보출력, p : 페이지네이션, r:
    dom: 'C<"clear">B<"clear">lfrtip',
    // 페이지 유지
    stateSave: false,
    // 랭기지팩 적용
    language: {url : 'lib/DataTable/ko.json'},
    // 한화면 출력 개수 
    lengthMenu: [
      [5, 10, 20, -1],
      [5, 10, 20, '모두 보기']
    ],
    responsive: true,
    columnDefs: [
      {
        'targets': 0,
        'checkboxes': {
          'selectRow': true
        }
      },
    ],
    // 멀티 체크 적용
    select: {
      'style': 'multi'
    },
    data: cJSON,

    paging: true,              // 페이징을 한다.
    pageLength: 10, 
    buttons: [
      {
          extend: 'copyHtml5'
      }
    ],
    columns: [
        {
          targets: 0,
          data: {'idx' : cJSON.idx},
          defaultContent: '',
          orderable: false,
          className: 'select-checkbox',
          width: 15
        },
        { className: "text-center cursor-pointer hover:bg-gray-200",
          data: function(objectJSON){ //유저 아이디  
            let rtnVal = objectJSON.manager_id;  
          return rtnVal;
        }
        },
        { className: "text-center", // 유저 이름
          data: function(objectJSON){
            return objectJSON.manager_name;
          }
        },
        { className: "text-center", // 이메일
          data: function(objectJSON){
            return objectJSON.manager_email;
           }
        },
        { className: "text-center", // 로그인 일시
          data: function(objectJSON){
            return objectJSON.mem_login_date;
          }
        }
    ],
    order: [[2, 'asc']]
  });
}


// 리스트 그리기
async function draw_admin_subs_list(cJSON){
  // 기존에 만들어진 테이블이 존재할 경우 초기화 해줘야 한다. (reinitailize 에러 발생)
  $('#subs_list_table').DataTable().clear().destroy();
  table = new DataTable('#subs_list_table', {
    rowCallback: function(row, data, index) {
      // 각 행에 클래스 추가
      $(row).addClass('datatable-tr');
      $(row).addClass('btn_subs_class_tr');
      $(row).attr('data-idx', data.idx);
      $(row).attr('data-number', data.subs_identity_number);
    },
    initComplete: function () {
      // DataTable이 초기화된 후에 selectbox를 추가합니다.
      $('#subs_list_table_filter').prepend(`
      <select class="cus-select" id="searchColumn">
      <option value="all">전체</option>
      <option value="6">교육생 명(영문)</option>
      <option value="7">교육과정명(국문)</option>
      <option value="4">교육날짜</option>
      </select>
      <div class='display-none gap-1 items-center' id='search_type_div'>
        <input type='text' class='subs-cus-input' id='subs_list_sdate' readonly>~<input type='text' class='subs-cus-input' id='subs_list_edate' readonly>
      </div>`);
      draw_select_type();
    },  
    // "search" : {
    //   "search" : local_search_data
    // },
    // order : [[local_table_order_index, local_table_order]],
     // 칼럼 Resize 및 보이기 숨기기
    // dom : l : Length Change, f : 필터, t : 테이블, i : 정보출력, p : 페이지네이션, r:
    dom: 'C<"clear">B<"clear">lfrtip',
    // 페이지 유지
    stateSave: false,
    searching: true,
    // 랭기지팩 적용
    language: {url : 'lib/DataTable/ko.json'},
    // 한화면 출력 개수 
    lengthMenu: [
      [5, 10, 20, -1],
      [5, 10, 20, '모두 보기']
    ],
    responsive: true,
     columnDefs: [
      {
        'targets': 0,
        'checkboxes': {
          'selectRow': true
        }

      },
    ],
    // 멀티 체크 적용
    select: {
      'style': 'multi'
    },
    data: cJSON,

    paging: true,              // 페이징을 한다.
    pageLength: 10, 
    buttons: [
      {
          extend: 'copyHtml5'
      },
      {
        extend: 'excelHtml5',
        text: '엑셀로 저장',
        action: async function (e, dt, button, config) {
          var bconfirm = false;
          await greenModal({
              type: "confirm",
              messageText: "엑셀 다운로드 하시겠습니까?",
              headerText : "알림",
              alertType: "info"
          }).done(function (event) {
              bconfirm = event;
          });
          if (bconfirm) {
            let today = new Date();
            today = tobayDateMake(today);
            let fileName = `교육신청현황_${g_login.manager_name}_${today}.xlsx`; // 확장자를 .xlsx로 변경
            var excelData = dt.buttons.exportData({
                columns: ':visible',
                orthogonal: 'export' 
            });
            var content_idx_arr = [];
            $('.dt-checkboxes').each(function() {
              var isChecked = $(this).prop('checked');
              if (isChecked) {
                  var idx = $(this).closest('tr').data('number');
                  if(!isEmpty(idx)){
                    content_idx_arr.push(idx);
                  }
              }
            });
            if(content_idx_arr.length != 0){
              let tempBODY = [...excelData.body];
              let tempARR = [];
              for(let i = 0; i < content_idx_arr.length; i++){
                let boolean = false;
                for(let j = 0; j < tempBODY.length; j++){
                  if(String(tempBODY[j][13]) === String(content_idx_arr[i])){
                    boolean = true;
                  }
                  if(boolean){
                    tempARR.push(tempBODY[j]);
                    boolean = false;
                  }
                }

              }
              excelData.body = tempARR;
            }
           
            
    
            // xlsx 라이브러리를 사용하여 .xlsx 파일 생성
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.aoa_to_sheet([excelData.header, ...excelData.body]);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
    
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
    
            var blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
    
            let sendJSON = {
                manager_id: g_login.manager_id,
                manager_name: g_login.manager_name,
                download_filename: fileName,
                cmd: "download_excel"
            };
    
            await call_admin_ajax(sendJSON);
          }
        }
      }
    ],
    columns: [
        {
          targets: 0,
          data: {'idx' : cJSON.idx},
          defaultContent: '',
          orderable: false,
          className: 'select-checkbox'
        },
        { className: "text-center",
          data: function(objectJSON){ //신청상태    
            let type = objectJSON.subs_type;
            if(Number(type) ===1){
              type = "<p class='text-red-600 font-bold'>대기</p>";
            }else{
              type = "<p class='text-green-600 font-bold'>정상</p>";
            }
          return type;
        }
        },
        { className: "text-center",
          data: function(objectJSON){ //결제여부    
            let pay = objectJSON.subs_user_payment;
            if(Number(pay) ===0){
              pay = `<p class='text-red-600 font-bold cursor-pointer'>미납</p>`;
            }else{
              pay = `<p class='text-green-600 font-bold cursor-pointer'>납입</p>`;
            }
          return pay;
        }
        },
        // {
        //     className: 'details-control',
        //     orderable: false,
        //     data: 'pj_idx',
        //     defaultContent: '',
        //     "render" : function(){
        //       //return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
        //       return '<i class="addit addit-plus-icon" aria-hidden="true"></i>';
        //     },
        //     width : "15px"
        // },
        { className: "text-center", // 국가
          data: function(objectJSON){


            return objectJSON.subs_country;
          }
        },
        { class: "text-lf",
          data: function(objectJSON){ // 교육날짜
            let time_name = objectJSON.subs_class_time_idx;
            time_name = json_filter(g_classtime_json, time_name, 'idx', 'class_time');
              return time_name;
          }
        },
        { className: "text-center cursor-pointer hover:bg-gray-200", // 신청자명(중문)
          data: function(objectJSON){
            return objectJSON.subs_user_name_ch;
          },
          fixedColumns: true
        },
        { className: "text-center cursor-pointer hover:bg-gray-200 fixed-column", // 신청자명 (영문)
          data: function(objectJSON){
            let rtnData = objectJSON.subs_user_name_en;
            rtnData = objectJSON.subs_user_name_en;
            return rtnData;
          }
        },
        { className: "text-center", // 교육과정명(국문)
          data: function(objectJSON){
            let class_name = objectJSON.class_idx;
            let keyname = "class_name_ko";
            class_name = json_filter(g_class_json, class_name, 'idx', keyname);
              return class_name;
          },
          fixedColumns: true
        },
        { className: "text-center", // 교육과정명
          data: function(objectJSON){
            let class_name = objectJSON.class_idx;
            let class_lang = objectJSON.subs_country;
            let keyname = "";
            if(class_lang === "en"){
              keyname = "class_name_en";
            }else{
              keyname = "class_name_ch";
            }
            class_name = json_filter(g_class_json, class_name, 'idx', keyname);
              return class_name;
          }
        },
        { className: "text-center", // 교육생위챗
          data: function(objectJSON){
            let text = "";
            if(!isEmpty(objectJSON.subs_user_wechat)){
              text = objectJSON.subs_user_wechat;
            }
            return text;
          }
        },
        { className: "text-center", // 생년월일
          data: function(objectJSON){
            let text = "";
            if(!isEmpty(objectJSON.subs_birth)){
              text = objectJSON.subs_birth;
            }
            return text;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 직위
            let position = objectJSON.subs_company_position;
            return position;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 성별
            let sex = objectJSON.subs_sex;
            if(Number(sex) === 0){
              sex = "남자";
            }else{
              sex = "여자";
            }
            return sex;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 신분번호
            let i_number = objectJSON.subs_identity_number;

            return i_number;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 연락처
            let p_number = objectJSON.subs_phone_number;

            return p_number;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 이메일 주소
            let email = objectJSON.subs_user_email;

            return email;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // zipcode
            let zipcode = objectJSON.subs_user_zipcode;
            if(isEmpty(zipcode)){
              zipcode = "";
            }

            return zipcode;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 업체명(중문)
            let tempRtn = objectJSON.subs_company_name_ch;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 업체명(영문)
            let tempRtn = objectJSON.subs_company_name_en;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 업체명(국문)
            let tempRtn = objectJSON.subs_company_name_ko;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 공장주소(중문)
            let tempRtn = objectJSON.subs_company_address_ch;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 공장주소(영문)
            let tempRtn = objectJSON.subs_company_address_en;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 공장주소(영문)
            let tempRtn = objectJSON.subs_ceo_name;
            if(isEmpty(tempRtn)){
              tempRtn = "";
            }

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 에이전트
            let tempRtn = objectJSON.subs_agent_name;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 에이전트 담당자
            let tempRtn = objectJSON.subs_agent_manager;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 에이전트 연락처
            let tempRtn = objectJSON.subs_agent_phone_number;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 에이전트 이메일
            let tempRtn = objectJSON.subs_agent_email;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 에이전트 위챗
            let tempRtn = objectJSON.subs_agent_wechat;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){   // 교육신청날짜   
            return objectJSON.subs_date;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 송금통화
            let tempRtn = objectJSON.subs_currency;

            return tempRtn;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 인보이스
            let pay_check = `
            <button class='btn_subs_down basic-btn-2 text-sm btn-default-bg-color text-white py-1 px-3' data-type='USD' data-user='admin' data-idx=${objectJSON.idx}>인보이스(USD)</button>
            <button class='btn_subs_down basic-btn-2 text-sm btn-default-bg-color text-white py-1 px-3' data-type='KRW' data-user='admin' data-idx=${objectJSON.idx}>인보이스(KRW)</button>
            
            `;

            return pay_check;
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 입금일자
            let tempRtn = objectJSON.subs_deposit_date;

            return tempRtn ? tempRtn : "";
          }
        },
        { className: "text-right",
          data: function(objectJSON){ // 송금액
            let tempRtn = "";
            if(!isEmpty(objectJSON.subs_remittance_amount)){
              tempRtn = numberWithPointValue(objectJSON.subs_remittance_amount);
            }

            return tempRtn ? tempRtn : "";
          }
        },
        { className: "text-right",
          data: function(objectJSON){ // 매출액
            let tempRtn = "";
            if(!isEmpty(objectJSON.subs_take)){
              tempRtn = numberWithPointValue(objectJSON.subs_take);
            }

            return tempRtn ? tempRtn : "";
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 입금자명
            let tempRtn = objectJSON.subs_depositor_name;

            return tempRtn ? tempRtn : "";
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 적요
            let tempRtn = objectJSON.subs_briefs;

            return tempRtn ? tempRtn : "";
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 선수전표번호
            let tempRtn = objectJSON.subs_slip_number;

            return tempRtn ? tempRtn : "";
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 계산서 구분
            let tempRtn = objectJSON.subs_bill;

            return tempRtn ? tempRtn : "";
          }
        },
        { className: "text-center",
          data: function(objectJSON){ // 매출전표
            let tempRtn = objectJSON.subs_sales_slip;

            return tempRtn ? tempRtn : "";
          }
        }
    ]
  });

}



// 사용자 수강신청 확인 목록 그리기
function draw_subs_list(){
  popupObj.title = login_lang.popup_admin_title[g_lang];
  popupObj.subtitle = "";
  popupObj.contentHtml = PagesContent.subs_list;   
  popupObj.width = 1200;   
  popupObj.showfs = false;
  popupObj.showclose = true;

  if(showPopup){
    showPopup(popupObj); 
  }

  let target = $('#class_list');
  let tempHTML = "";
  let country = ""
  $.each(g_my_subs_list, function(ke, items){
    country = items.subs_country
    let pay_check = items.subs_user_payment;
    // if(Number(pay_check) === 0){
    //   pay_check = "결제 확인 안됨";
    // }else{
    //   pay_check = `<button>인보이스 출력</button>`;
    // }

    pay_check = `
    <button class='btn_subs_down btn btn-primary btn-xs text-xs text-white py-1 px-3 mb-1 class-list' data-type='USD' data-idx=${items.idx}>${table_lang.list_print[country]}(USD)</button><br>
    <button class='btn_subs_down btn btn-primary btn-xs text-xs text-white py-1 px-3 class-list' data-type='KRW' data-idx=${items.idx}>${table_lang.list_print[country]}(KRW)</button>
    
    `;

    
    // tempHTML = tempHTML + `
    //   <tr>
    //     <td>${items.idx}</td>
    //     <td>${items.class_name_ch}</td>
    //     <td>${items.class_name_en}</td>
    //     <td>${items.class_time}</td>
    //     <td>${items.subs_date}</td>
    //     <td>${pay_check}</td>
    //   </tr>
    // `;
    // <td style="text-align:center;">${class_status(items.subs_type, items.subs_payment_date)}</td>      
    tempHTML = tempHTML + `
      <tr>
        <td style="text-align:center;">${items.subs_date}</td>      
        <td style="text-align:center;">${table_lang.sub_success[g_lang]}</td>      
        <td>${pay_check}</td>        
        <td>${items[`class_name_${items.subs_country}`]}</td>
        <td>${items.class_time}</td>
      </tr>
    `;
  });

  $('#num').text(table_lang.list_number[country]);
  $('#subs_class_ch').text(table_lang.list_class_name_ch[country]);
  $('#subs_class_en').text(table_lang.list_class_name_en[country]);
  $('#subs_class_status').text(table_lang.list_status[country]);
  
  $('#subs_class_time').text(table_lang.list_class_time[country]);
  $('#subs_class_date').text(table_lang.list_user_class_time[country]);
  $('#subs_class_invoice').text(table_lang.list_print[country]);



  target.html(tempHTML);
}

// 교육신청 상태 리턴
function class_status(pdata, pdate){
  let rtndata = "";
  if (pdata === "0"){
    if (isEmpty(pdate)){
      rtndata = msg_lang.apply_status_2[g_lang];
    }
    else{
      rtndata = msg_lang.apply_status_1[g_lang];
    }
  }else{
    rtndata = msg_lang.apply_status_3[g_lang];
  }
  return rtndata;
}

// 신청현황에서 사용자 정보 그리기
function draw_subs_info(pData){
  $('#idx').val(pData.idx);
  $('#subs_country').text(pData.subs_country ? pData.subs_country : "-");
  $('#subs_user_name_ch').text(pData.subs_user_name_ch ? pData.subs_user_name_ch : "-");
  $('#subs_user_name_en').text(pData.subs_user_name_en ? pData.subs_user_name_en : "-");
  $('#subs_user_wechat').text(pData.subs_user_wechat ? pData.subs_user_wechat : "-");
  $('#subs_birth').text(pData.subs_birth ? pData.subs_birth : "-");
  $('#subs_company_position').text(pData.subs_company_position ? pData.subs_company_position : "-");

  let sex = pData.subs_sex;
  if(Number(sex) === 0){
    sex = "남자";
  }else{
    sex = "여자";
  }
  $('#subs_sex').text(sex);
  $('#subs_identity_number').text(pData.subs_identity_number ? pData.subs_identity_number : "-");
  $('#subs_phone_number').text(pData.subs_phone_number ? pData.subs_phone_number : "-");
  $('#subs_user_email').text(pData.subs_user_email ? pData.subs_user_email : "-");
  $('#subs_user_zipcode').text(pData.subs_user_zipcode ? pData.subs_user_zipcode : "-");
  $('#subs_company_name_ch').text(pData.subs_company_name_ch ? pData.subs_company_name_ch : "-");
  $('#subs_company_name_en').text(pData.subs_company_name_en ? pData.subs_company_name_en : "-");
  $('#subs_company_name_ko').text(pData.subs_company_name_ko ? pData.subs_company_name_ko : "-");
  $('#subs_company_address_ch').text(pData.subs_company_address_ch ? pData.subs_company_address_ch : "-");
  $('#subs_company_address_en').text(pData.subs_company_address_en ? pData.subs_company_address_en : "-");
  $('#subs_ceo_name').text(pData.subs_ceo_name ? pData.subs_ceo_name : "-");
  $('#subs_agent_name').text(pData.subs_agent_name ? pData.subs_agent_name : "-");
  $('#subs_agent_manager').text(pData.subs_agent_manager ? pData.subs_agent_manager : "-");
  $('#subs_agent_phone_number').text(pData.subs_agent_phone_number ? pData.subs_agent_phone_number : "-");
  $('#subs_agent_email').text(pData.subs_agent_email ? pData.subs_agent_email : "-");
  $('#subs_agent_wechat').text(pData.subs_agent_wechat ? pData.subs_agent_wechat : "-");

  let class_time = pData.subs_class_time_idx;
  class_time = json_filter(g_classtime_json, class_time, 'idx', 'class_time');
  $('#subs_class_time_idx').text(class_time);
  $('#subs_currency').text(pData.subs_currency ? pData.subs_currency : "-");
  $('#subs_depositor_name').text(pData.subs_depositor_name ? pData.subs_depositor_name : "-");
  $('#subs_date').text(pData.subs_date ? pData.subs_date : "-");

  $('#subs_deposit_date').datepicker(DATE_TIME_CONFIG);

  // 값이 있으면 그리기
  $('#subs_deposit_date').val(pData.subs_deposit_date ? pData.subs_deposit_date : "");
  $('#subs_remittance_amount').val(pData.subs_remittance_amount ? numberWithPointValue(pData.subs_remittance_amount) : "");
  $('#subs_take').val(pData.subs_take ? numberWithPointValue(pData.subs_take) : "");
  $('#subs_briefs').val(pData.subs_briefs ? pData.subs_briefs : "");
  $('#subs_slip_number').val(pData.subs_slip_number ? pData.subs_slip_number : "");
  $('#subs_bill').val(pData.subs_bill ? pData.subs_bill : "");
  $('#subs_sales_slip').val(pData.subs_sales_slip ? pData.subs_sales_slip : "");
  $(`input[name="chk_state"][value=${pData.subs_type}]`).prop('checked', true);
}

// 등록된 교육과정 시간만큼 그리기
function draw_class_time_div(pData){
  let target = $('#class_time_area');
  let tempHTML = "";
  for(let i = 0; i < pData.length; i++){
    let optionHTML = "";
    if(pData[i].class_lang === "ch"){
      optionHTML = `
      <option value="ch" selected>중문</option>
      <option value="en">영문</option>
      `;
    }else{
      optionHTML = `
      <option value="ch">중문</option>
      <option value="en" selected>영문</option>
      `;
    }
    let classTime = pData[i].class_time;
    classTime = classTime.split(' ~ ');
    let classSTime = classTime[0].replaceAll('.','-');
    let classETime = classTime[1].replaceAll('.','-');
    tempHTML = tempHTML + `
      <div class="flex items-center gap-2 class_time_div mt-2" id='class_time_div_${pData[i].idx}'>
      <select class="form-select time_sel w-24" id="lang_${pData[i].idx}">
        ${optionHTML}
      </select>
      <input type="text" class="form-control time_sdate w-24" value='${classSTime}' id='class_sdate_${pData[i].idx}' placeholder='시작날짜' readonly>
      ~
      <input type="text" class="form-control time_edate w-24" value='${classETime}' id='class_edate_${pData[i].idx}' placeholder='종료날짜' readonly>
      /
      <input type="text" class="form-control w-12" id='class_max_count_${pData[i].idx}' onkeyup="onlyNumberValue(this)" value='${pData[i].class_max_count}' placeholder='최대 인원수'>
      /
      <input type="text" class="form-control w-24" id='class_place_${pData[i].idx}' value='${pData[i].class_place? pData[i].class_place : ""}' placeholder='교육장소'>
      <div class="w-full flex gap-2">    
        <label class="form-check-label text-sm" for="chk_class_type_${pData[i].idx}_0">
          <input id="chk_class_type_${pData[i].idx}_0" type="radio" name="chk_class_type_${pData[i].idx}" class="form-check-input" value="0">  
          대면
        </label>
        <label class="form-check-label  text-sm" for="chk_class_type_${pData[i].idx}_1">
          <input id="chk_class_type_${pData[i].idx}_1" type="radio" name="chk_class_type_${pData[i].idx}" class="form-check-input" value="1">  
          비대면
        </label>
      </div>
      <button class="text-sm basic-btn-2 btn-default-bg-color w-60 text-white py-1.5 px-2 btn_up_time" data-idx=${pData[i].idx}>수정</button>
      <button class="text-sm basic-btn-2 bg-red-400 w-60 text-white py-1.5 px-2 btn_del_time" data-idx=${pData[i].idx}>삭제</button>
    </div>
    `;
  }
  target.html(tempHTML);
  
  for(let i = 0; i < pData.length; i++){
    $(`input[name="chk_class_type_${pData[i].idx}"][value=${pData[i].class_type}]`).prop('checked', true);
    $(`#class_sdate_${pData[i].idx}`).datepicker(DATE_TIME_CONFIG);;
    $(`#class_edate_${pData[i].idx}`).datepicker(DATE_TIME_CONFIG);;
  }
}

// 인보이스 그리기
function draw_invoice(pData){
  let tempJSON = urldecode(pData);
  tempJSON = JSON.parse(tempJSON);
  console.log(tempJSON);

  $('#print_time').text(tempJSON.today);
  $('#class_time').text(tempJSON.class_time);

  let country = tempJSON.subs_country;
  let country_dal = tempJSON.type;
  let subs_currency = tempJSON.subs_currency;
  $('#name_en').text(tempJSON.subs_user_name_en);
  let classname = "";
  if(country === "ch"){ // 중문신청시
    classname = `${tempJSON.subs_company_name_ch}(${tempJSON.subs_company_name_en})`;
    $('#name_en').text(tempJSON.subs_user_name_ch);
    let money = "";
    // $('#num').text(invoice_lang[subs_currency].num);
    $('#num').text(invoice_lang[country_dal].num);

    if(country_dal === 'USD'){
      if(Number(tempJSON.class_type) === 0){
        money = tempJSON.pay_dal_ch;
      }else{
        money = tempJSON.pay_dal_ch_1;
      }
      if(!isEmpty(money)){
        $('#fee_en').text(numberWithPointValue(money) + ' ' + country_dal);
        $('#fee_ch').text(numberWithPointValue(money) + ' ' + country_dal);
      }
    }else{
      $('#num').text(invoice_lang[country_dal].num);
      if(Number(tempJSON.class_type) === 0){
        money = tempJSON.pay_ch_ch;
      }else{
        money = tempJSON.pay_ch_ch_1;
      }
      if(!isEmpty(money)){
        $('#fee_en').text(numberWithPointValue(money) + ' ' + lang.invoice_ko_dal);
        $('#fee_ch').text(numberWithPointValue(money) + ' ' + lang.invoice_ko_dal);
      }
    }
    
    $('#tatal').text('合计');
  }else{ // 영문 신청시
    $('#num').text(invoice_lang[country_dal].num);
    classname = tempJSON.subs_company_name_en;
    if(country_dal === 'USD'){
      if(!isEmpty(tempJSON.pay_en_en)){
        $('#fee_en').text(numberWithPointValue(tempJSON.pay_en_en) + ' ' + country_dal);
        $('#fee_ch').text(numberWithPointValue(tempJSON.pay_en_en) + ' ' + country_dal);
      }
   
    }else{
      if(!isEmpty(tempJSON.pay_kr_en)){
        $('#fee_en').text(numberWithPointValue(tempJSON.pay_kr_en) + ' ' + lang.invoice_ko_dal);
        $('#fee_ch').text(numberWithPointValue(tempJSON.pay_kr_en) + ' ' + lang.invoice_ko_dal);
      }
    }
    $('#tatal').text('Sum');
  }

  $('#company_name').text(classname);
  $('#currency').text(tempJSON.type);
  $('#manager_name').text(tempJSON[`class_manager_${country}`]);
  $('#tel').text(tempJSON.class_info_tel);
  $('#fax').text(tempJSON.class_info_fax);
}

// 신청현황 관리에서 수정 후 기존에 보던 데이터 출력
function draw_select_type(){
  if(!isEmpty(g_subs_select)){
    if(Number(g_subs_select) === 4){ // 날짜형식으로 보기
      $('#search_type_div').css('display', 'flex');
      $('#subs_list_table_filter input[type="search"]').css('display', 'none');
      $('#subs_list_sdate').datepicker(DATE_TIME_CONFIG);
      $('#subs_list_edate').datepicker(DATE_TIME_CONFIG);
      if(!isEmpty(g_dataTable_search_value)){
        table.columns(g_subs_select).search(g_dataTable_search_value).draw();
        let value = g_dataTable_search_value.split(' ~ ');
        let sdate = value[0].replaceAll('.', '-');
        let edate = value[1].replaceAll('.', '-');
        $('#searchColumn').val(g_subs_select);
        $('#subs_list_sdate').val(sdate);
        $('#subs_list_edate').val(edate);
      }
    }else{
      table.columns(g_subs_select).search(g_dataTable_search_value).draw();
      $('#searchColumn').val(g_subs_select);
      $('#subs_list_table_filter input[type="search"]').val(g_dataTable_search_value);
    }
  }else{
    if(!isEmpty(g_dataTable_search_value)){
      table.search(g_dataTable_search_value).draw();
      $('#subs_list_table_filter input[type="search"]').val(g_dataTable_search_value);
    }
  }
}

function getActiveMessage(pdata){
  let tmp = "<span class='text-red-500'>비활성화</span>";
  if (pdata === "1"){
    tmp = "<span class='text-blue-500'>활성화</span>";
  }
  return tmp;
}