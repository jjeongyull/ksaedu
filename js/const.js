let table;

// 디버깅 모드
const bdebug = true;

/** 메시지 상자 */
const title_default = "Notice";
const title_alert = 'Alert';
const title_success = 'Success';
const title_result = 'Result';
const msg_close_delay = 2000;

const exception_error_code = -1;
const no_delay = 0;

const t_error = 1;
const t_sucess = 0;

// ajax 성공 status 코드 (201, 202는 jwt login 관련)
const status_sucess_code = [200, 201, 202, 400];

// 메시지 상자 객체
const msgboxObj = {"status" : "", "message" : "", "closetime" : "0", "type" : "1", "title" : title_default}
// 팝업 상자 객체
const popupObj = {};

// 페이지 Data
const PagesList = {
  "login" : "pages/login.html",
  "header" : "pages/header.html",       // index 페이지 이후 헤더
  "header2" : "pages/header2.html",     
  "footer" : "pages/footer.html",
  "subs_list" : "pages/subs_list.html"
}

const AdminList = {
  "subs_update" : "component/subs_update.html", // 관리자 subs수정
  "member_plus" : "component/member_plus.html", // 계정추가 팝업
  "admin_regen_pw" : "component/admin_regen_pw.html", // 관리자 비밀번호 재발송 팝업
  "admin_change_pw" : "component/chang_pw_popup.html", // 비밀번호 변경
  "class_time_write" : "component/class_time_write.html", // 교육시간 수정 
  "class_write" : "component/class_write.html" // 교육추가 및 수정 
}


let PagesContent = {}

// 교육과정 번호 배열
let class_time_num_arr = [];
let class_time_num = 0;
let del_class_time_arr = [];

// 로그인 토큰
let g_access_token = "";

// 로그인 정보 객체
let g_login = {};

// 언어(기본 영문)
let g_lang = "en";
// 교육과정 코드
let g_class_idx = "";   
// 교육시간
let g_class_time = "";  
// 교육시간 번호
let g_class_time_idx = "";  
// 교육명
let g_class_name = "";

// 교육시간 정보
let g_classtime_json = [];

// 교육 리스트
let g_class_json = [];

// 내가 신정한 정보 리스트
let g_my_subs_list = {};

// 사용자 신청 정보 리스트
let g_subs_list = [];

// 관리자 계정 리스트
let g_user_list = [];

// 다운로드 리스트
let g_down_list = [];

// 사용자인지 관리자인지 구분
let g_page_type = "";

// 삭제된 내역 보기 및 전체보기 상태
let subs_view_state = "";

// 데이터 피커 환경 설정 
const DATE_TIME_CONFIG = {
  dateFormat: "yy-mm-dd",
  dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], // 요일의 한글 형식.
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], // 월의 한글 형식.
  monthNames: [ "1월","2월","3월","4월","5월","6월", "7월","8월","9월","10월","11월","12월" ],
  closeText: "닫기", 
  prevText: "이전달", 
  nextText: "다음달", 
  currentText: "오늘",
  beforeShow: function(input, inst) {
    var i_offset = $(input).offset(); // 클릭된 input의 위치값 체크
    var windowScroll = $(document).scrollTop();
    var top = i_offset.top + $(input).outerHeight(true) - windowScroll;
    inst.dpDiv.css({ top: top, left: i_offset.left }); // datepicker의 div의 위치를 클릭한 input 위치로 이동시킵니다.
  }
};

// 신청현황 검색시 셀렉박스 변수
let g_subs_select = "";
let g_dataTable_search_value = ""; 

// 교육 파일 변수
let class_img_ch = [];
let class_img_ch_name = "";
let class_img_en = [];
let class_img_en_name = "";