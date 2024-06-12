/* 
Date : 2023.03.20
Desc : 유틸리티 함수 정의
Copyright : GreenPot Co., Ltd.
*/

/** @brief 파일 경로에서 파일명을 구한다.
*  @date 2023/03/02
*  @return 
*  @param strFilepath : "C:\\test\test.png" => test.png
**/
function getnameformpath(strFilepath) {
  var objRE = new RegExp(/([^\/\\]+)$/);
  var strName = objRE.exec(strFilepath);
  if (strName == null) {
      return null;
  }
  else {
      return strName[0];
  }
}

/** @brief 새로운 브라우저 창을 오픈한다.
*  @date 2023/03/02
*  @return 
*  @param pURL : URL, pTitle : 창 타이틀, nWidth : 창넓이, nHeight : 창 높이
        Scroll = 1이면 스크롤바 출력(0), status = "yes"이면 상태바 출력
**/
function openWindow(pURL, pTitle, nWidth, nHeight, Scroll="1", status="no")
{
  var popupX = (document.body.offsetWidth / 2) - (nWidth / 2);
  var popupY= (window.screen.height - nHeight) / 2;
  nHeight = nHeight-100;
  var szOption = 'scrollbars=' + Scroll + ', status=' + status + ', height=' + nHeight + ', width=' + nWidth +', left='+ popupX + ', top='+ popupY
  window.open(pURL, pTitle, szOption);
}

/** @brief 디버거 옵션에 따라 디비깅 정보 출력
*  @date 2023/03/02
*  @return 
*  @param Message : 출력 메시지, Debug : 1이면 Alert, 0이면 콘솔 출력
**/
function showdebug(Messagse, Debug){
switch (Debug){
  case "1" :
    if (Debug){
        alert(Messagse);
    }
    break;
  case "2" :
    if (Debug){
      console.log(Messagse);
    }
    break;
  default:
    break;
}
}

/** @brief 페이지 이동
*  @date 2023/03/02
*  @return 
*  @param url : http를 포함한 url : http://www.additcorp.com, param : param1=aaa&param2=bb
**/
function gotoPage(url, param){
  if (isEmpty(param)){
      location.href=url;    
  } else {
      location.href=url + "?" + param;    
  }
}

/** @brief 이메일 체크 정규식
*  @date 2023/03/02
*  @return true / false
*  @param 
**/
function validateEmail(InputData) 
{
  var emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if(emailRule.test(InputData)) {    
      return true;
  }
  else{
      return false; 
  }
}

/** @brief 숫자 입력 체크 정규식
*  @date 2023/03/02
*  @return true / false
*  @param 
**/
// 숫자 입력 체크 (정규식으로 처리)
function validateNumber(InputData) {
  var Number = /^\d{10}$/;
  if (InputData.match(Number)) {
      return true;
  } else {
      return false;
  }
}

/** @brief 숫자가 양수인지/음수인지 확인, 기준값에 따라 true/false 리턴
*  @date 2023/03/02
*  @return true / false
*  @param pData : 체크값, pCase : +/-, pBase : 기준값
*  fn_isNumeric(10, +, 11) => 11보다 작으므로 false /  fn_isNumeric(10, +) => 양수이므로 true
**/
function fn_isNumeric(pData, pCase, pBase = 0){
  var rtnValue = false;
  // 숫자인지 체크
  if ($.isNumeric(pData))
  {
      var tmp = parseInt(pData);
      switch (pCase){
          case "+" : 
              if (pBase != 0){
                  if (tmp >= pBase)
                      rtnValue = true;
              }else{
                  if (tmp > 0)
                      rtnValue = true;
              }
              break;
          case "-" :
              if (pBase != 0){
                  if (tmp <= pBase)
                      rtnValue = true;
              }else{
                  if (tmp < 0)
                      rtnValue = true;
              }
              break;
          default :
              if (tmp >= pBase)
                  rtnValue = true;
              break;
      }
  }
  return rtnValue;
}

/** @brief 아이디 유효성 검사
*  @date 2023/03/02
*  @return true / false
*  @param pData : 체크값, pcheck = 1 : 대소문자 포함, 2 : 대소문자+숫자, 3 : 대소문자 + 숫자 + 특수문자
*  fn_isNumeric(10, +, 11) => 11보다 작으므로 false /  fn_isNumeric(10, +) => 양수이므로 true
**/
function ValidateRegulation(InputData, pCheck, min, max) {
  switch (pCheck){
    case 1 : 
      var RegID = "^[a-zA-Z]{" + min + "," + max + "}$";
      break;
    case 2 :
      var RegID = "^[a-zA-Z][a-zA-Z0-9]{" + min + "," + max + "}$";
      break;
    case 3 : 
    var RegID = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{" + min + "," + max + "}$";
      break;
    default :
      break;
  }
  RegID = new RegExp(RegID);
  if (InputData.match(RegID)) {
      return true;
  } else {
      return false;
  }
}

/** @brief 한글입력 방지
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc : 크롬 브라우저일 경우에만 적용 된다.
**/
function fncRplc(obj)
{
  var patt = /[\ㄱ-ㅎ가-힣]/g;
  obj.value = obj.value.replace(patt, '');
}

/** @brief 숫자, 소수점만 입력이 되도록 (3자리 마다 ,를 추가한다.)
*  @date 2023/03/02
*  @return 
*  @param 
**/
function numberWithPoint(object) {
  var x;
  x = object.value;
  x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
  x = x.replace(/,/g,'');        // ,값 공백처리
  $(object).val(x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 정규식을 이용해서 3자리 마다 , 추가 
}

/** @brief GET 방식으로 전달된 파라미터를 배열로 리턴
*  @date 2023/03/02
*  @return 
*  @param 
**/
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
     return null;
  }
  else{
     return results[1] || 0;
  }
}

/** @brief 현재 페이지명을 리턴한다.
*  @date 2023/03/02
*  @return https://xxx.xxx.xxx/test.html => test.html
*  @param 
**/
function getPageName(){
  var pageName = "";
  var tempPageName = window.location.href;
  var strPageName = tempPageName.split("/");
  pageName = strPageName[strPageName.length-1].split("?")[0];
  return pageName;
}

/** @brief 쿠키를 설정한다.
*  @date 2023/03/02
*  @return 
*  @param cookieName: 쿠키명, value : 쿠키값, exdays : 종료일 (1 : 1일)
**/
function setCookie(cookieName, value, exdays, httpOnly=false, secure=false){
  var exdate = new Date();
  if (exdays == ""){
      exdate.setDate(exdate.getDate() + exdays);
      var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
  }
  else{
      exdate.setDate(exdate.getDate() + exdays);
      var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
  }
  if (httpOnly && secure){
    document.cookie = cookieName + "=" + cookieValue + "; httpOnly; Secure";
  } else if(httpOnly && !secure){
    document.cookie = cookieName + "=" + cookieValue + "; httpOnly";
  } else if (!httpOnly && secure){
    document.cookie = cookieName + "=" + cookieValue + "; Secure";
  }
  else{
    document.cookie = cookieName + "=" + cookieValue + ";"
  }
}

/** @brief 쿠키를 삭제한다.
*  @date 2023/03/02
*  @return 
*  @param cookieName: 쿠키명
**/
function deleteCookie(cookieName){
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() - 1);
  document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

/** @brief 쿠키값을 얻어온다. 
*  @date 2023/03/02
*  @return 
*  @param cookieName: 쿠키명
*  @etc httpOnly일 경우에는 값을 읽어올 수 없다.
**/
function getCookie(cookieName) {
  cookieName = cookieName + '=';
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cookieName);
  var cookieValue = '';
  if(start != -1){
      start += cookieName.length;
      var end = cookieData.indexOf(';', start);
      if(end == -1)end = cookieData.length;
      cookieValue = cookieData.substring(start, end);
  }
  return unescape(cookieValue);
}

/** @brief 쿠키값을 얻어온다. 도메인명을 제외한 서버 경로를 리턴한다.
*  @date 2023/03/02
*  @return "http://xxx.xxx.xxx/test/test.html" -> /test/test.html 을 리턴
*  @param 
**/
function getServerPath(url){
  var arSplitUrl = url.split("/"); // "/" 로 전체 url 을 나눈다
  var szFullPath = "";
  var nArLength = arSplitUrl.length;
  for (var i = 3; i < nArLength; i++) {
      if (szFullPath == "")
          szFullPath = '/' + arSplitUrl[i]
      else
          szFullPath = szFullPath + '/' + arSplitUrl[i];
  }
  return szFullPath;
}

/** @brief 이미지 크기를 재조정해 리턴한다.
*  @date 2023/03/02
*  @return 
*  @param orgwidth: 원본넓이, orgheight: 원본높이, ration = 비율/소숫점 (0.3, 0.5 ..)
**/
function ResizeImage(orgwidth, orgheight, ratio) {
  var width = orgwidth;
  var height = orgheight;
  var viewWidth = 0, viewHeight = 0;
  var mRaito = 0.9;
  mRaito = ratio;
  var resizeWidth, resizeHeight; 

  resizeWidth = width; 
  resizeHeight = height;
  if (window.matchMedia("(max-width: 465px)").matches) {
      viewWidth = document.body.offsetWidth; // 기준 넓이 
      viewHeight = parseInt(document.body.offsetHeight * 0.7); // 기존 높이
      if ((width < viewWidth) && (height < viewHeight)){
          resizeWidth = parseInt(width * mRaito);
          resizeHeight = parseInt(height * mRaito);
      }
      else if (width > viewWidth ){
          resizeWidth = parseInt(viewWidth * mRaito);
          resizeHeight = parseInt(((viewWidth * height) / width) * mRaito);
      }
      else if(height > viewHeight)
      {
          resizeWidth = parseInt(((viewHeight * width) / height) * mRaito);
          resizeHeight = parseInt(viewHeight * mRaito);
      }
  }
  else{   // 가로세로 비율
      viewWidth = document.body.offsetWidth; // 기준 넓이 
      viewHeight = parseInt(document.body.offsetHeight * 0.7); // 기존 높이
      if ((width < viewWidth) && (height < viewHeight)) {
          resizeWidth = parseInt(width * mRaito);
          resizeHeight = parseInt(height * mRaito);
      } else if (width > viewWidth) {
          resizeWidth = parseInt(viewWidth * mRaito);
          resizeHeight = parseInt(((viewWidth * height) / width) * mRaito);
      } else if (height > viewHeight) {
          resizeWidth = parseInt(((viewHeight * width) / height) * mRaito);
      resizeHeight = parseInt(viewHeight * mRaito);
      }
  }
  return [resizeWidth, resizeHeight];
}

/** @brief delay 만큼 화면을 넘춘다. (sync)
*  @date 2023/03/02
*  @return 
*  @param delay (멈춤 시간 1000 -> 1초)
**/
// Syncronize blocking 
function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

/** @brief URL이미지를 base64로 변경 (callback 함수를 어디에서 정의할까? 없으면 삭제)
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc : https://github.com/rndme/download 참조
**/
function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
          callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

/** @brief data가 base64 인코딩 된 것인지 확인
*  @date 2023/03/02
*  @return 
*  @param 
**/
function IsBase64Valid(data)
{
  var rtnValue = false;
  if ((typeof (data) != "undefined") && (data != null)) {
      if (data.indexOf('base64') != -1)
          rtnValue = true;
  }

  var base64Rejex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
  rtnValue  = base64Rejex.test(param); // base64Data is the base64 string
  return rtnValue;
}

/** @brief 값이 공백 또는 정의되지 않았는지 확인
*  @date 2023/03/02
*  @return 
*  @param pMsg : 공백이면 출력할 메시지
**/
function isEmpty(value, pMsg=""){
  if( value == "" || value == null || value == 'null' || value == "undefined" || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    if (pMsg !== "")
      alert(pMsg);
    return true
  }else{
      return false
  }
}

/** @brief 값이 공백 또는 정의되지 않았는지 확인
*  @date 2023/03/02
*  @return 
*  @param value : 값, pMsg : 출력메시지, pID : 포커를 보낼 TagID, pType : 0 이면 아이디, 1 이면 객체 자체
**/
function isEmptyToFocus(value, pMsg, pID, pType = 0){
  if( value == "" || value == null || value == 'null' || value == "undefined" || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
      alert(pMsg);
      if (pType == 0)
        $(pID).focus();
      else  
        pID.focus();
      return true
  }else{
      return false
  }
}

/** @brief 문자열이 포함되어 있으면 참을 리턴
*  @date 2023/03/02
*  @return 
*  @param pString: 문자열, pWord : 체크할 문자
**/
function getMatchString(pString, pWord){
var bMatch = false;
if (pString.match(pWord))
  bMatch = true;
return bMatch;
}

/** @brief  공백 삭제
*  @date 2023/03/02
*  @return 
*  @param 
**/
function TrimData(param){
  return $.trim($(param).val());
}

/** @brief URIComponent Encoding
*  @date 2023/03/02
*  @return 
*  @param 
**/
function TrimDataEncoding(param){
  var sztemp = $.trim($(param).val());
  sztemp = encodeURIComponent(sztemp);
  return sztemp;
}

/** @brief URIComponent Decoding;
*  @date 2023/03/02
*  @return 
*  @param 
**/
function DecodingUC(param){
  var sztemp  = decodeURIComponent(param);
  return sztemp;
}

/** @brief URIComponent encoding / 정규식을 이용한;
*  @date 2023/03/02
*  @return 
*  @param 
**/
function urlencode(str) {
  str = (str + '').toString();
  return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/%20/g, '+');
}

/** @brief URIComponent decoding / 정규식을 이용한;
*  @date 2023/03/02
*  @return 
*  @param 
**/
function urldecode(str) {
  return decodeURIComponent((str + '')
      .replace(/%(?![\da-f]{2})/gi, function() {
          return '%25';
      })
      .replace(/\+/g, '%20'));
}

/** @brief php의 rawurlencode 구현
*  @date 2023/03/02
*  @return 
*  @param 
**/
function rawurlencode(str) {
  str = (str + '').toString();
  return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
}

/** @brief php의 rawurldecode 구현
*  @date 2023/03/02
*  @return 
*  @param 
**/
function rawurldecode(str) {
  return decodeURIComponent((str + '')
      .replace(/%(?![\da-f]{2})/gi, function() {
          return '%25';
  }));
}

/** @brief 입력문자 체크 (입력 방지 처리)
*  @date 2023/03/02
*  @return 입력값이 허용되는 값이면 true 리턴
*  @param obj : 객체, clear가 1이면 공백처리, pMsg : 출력할 메시지, pReg : 정규식
*  정규식 : 스페이스바 : /\s/
          /[\{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;	//정규식 구문
*  etc : 입력 정규식은 필요에 따라 변경한다.
*/
function preventInputChar(obj, pReg, clear=0) {
  RegID = new RegExp(pReg, "gi");
  if(RegID.test(value)) { 
    if (clear === 1){
        obj.focus();
        obj.value = obj.value.replace(RegID,''); // 공백제거
    }
    return false;
  }else
    return true;
}

/** @brief 입력 불가 문자 처리
*  @date 2023/03/02
*  @return 입력값이 허용되는 값이면 true 리턴
*  @param 
*  etc : 입력 정규식은 필요에 따라 변경한다.
*/
function preventFileName(value, pMsg="") {
  var pattern =  /[\\{}\/?,;:|*~`!^\+<>@\#$%&\\\=\'\"]/gi;
  var fileName = value.split('\\').pop().toLowerCase();
  if(pattern.test(fileName) ){
    if (!isEmpty(pMsg))
      alert('파일명에 특수문자가 포함되어 있습니다.\n등록할 수 없습니다.');
    return false;
  }
  return true;
}

/** @brief 입력 불가 문자 처리
*  @date 2023/03/02
*  @return 입력값이 허용되는 값이면 true 리턴
*  @param 
*  etc : 입력 정규식은 필요에 따라 변경한다.
          //var RegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;	//정규식 구문
*/
function preventSpecialChar(obj, pMsg="", clear=0){
  var RegExp = /[\{\}\[\]\/;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;	//정규식 구문
  if (RegExp.test(obj.value)) {
    if (!isEmpty(pMsg))
      alert('입력 불가능한 문자가 포함되어 있습니다.');
    if (clear === 1)
      obj.value = obj.value.replace(RegExp , '');
    return false;
  }
  return true;
}

/** @brief 문자열에서 pStartNum부터 nLength까지의 문자를 구한다.
*  @date 2023/03/02
*  @return 
*  @param pString : 문자열, pStartNum : 시작 숫자, nLength : 길이
**/
function getStringLength(pString, pStartNum, pLength){
  if (!isEmpty(pString))
      return pString.substr(pStartNum, pLength);
}

/** @brief input type이 number일 경우 maxlength를 넘어가지 않도록 처리
*  @date 2023/03/02
*  @return 
*  @param input element
*  @etc : oninput 이벤트로 처리한다.
**/
function maxLengthCheck(object){
  if (object.value.length > object.maxLength){
    object.value = object.value.slice(0, object.maxLength);
  }    
}

/** @brief html id 형태로 리턴
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc : oninput 이벤트로 처리한다.
**/
function rtnIDString(pString, pAddString=""){
  var sztemp = "";
  sztemp = "#" + pString + pAddString;
  return sztemp;
}

/** @brief 날짜를 비교 후 시작 날짜가 종료 날짜보다 클 경우 false를 리턴
*  @date 2023/03/02
*  @return 
*  @param pStart : 시작 날짜 Datapicker ID / eEnd : 종료 날짜 Datapicker ID
*  @etc : datepikcer 사용 시
**/
function compareDate(pStart, pEnd){
  var rtnValue = true;
  var date1 = new Date($(pStart).datepicker("getDate"));
  var date2 = new Date($(pEnd).datepicker("getDate"));
  if (date2 - date1 < 0){
      rtnValue = false;
  }
  return rtnValue;
}

/***********************************************************************************
* 파일 업로드 관련 체크 함수
/**********************************************************************************/
/** @brief 배열에 주어진 값이 있을 경우 
*  @date 2023/03/02
*  @return 값이 없을 경우 false를 리턴, 값이 존재할 경우 true 리턴
*  @param pType = 1 이면 파일명, 확장자 분리를 위해
*  @etc : 
**/
function binArray(pArray, pData, pType){
  var nRtnValue = -1;     // 값이 없을 경우 리턴값
  //var allwowExt = ['jpg','jpeg','gif','png'];
  if(!isEmpty(pData)){
    if (pType === 1)
        var pData = pData.split('.').pop().toLowerCase(); //확장자분리
    nRtnValue = $.inArray(pData, pArray);
  }
  return nRtnValue;
}

/** @brief 배열에 주어진 값이 있을 경우 
*  @date 2023/03/02
*  @return 원본 크기가 비교 크기 보다 클 경우 false 리턴
*  @param oSize : 원본 크기 (byte), nSize : 비교할 크기 (MB)
*  @etc : 
**/
// 최대 업로드 용량 체크, oSize가 nSize보다 클 경우 False 리턴
function  isUploadMaxSize(oSize, nSize, pMsg=""){
  var maxSize = nSize * 1024 * 1024; // nSzie : MB
  if(oSize > maxSize){
    if (!isEmpty(pMsg))
      alert("첨부파일 사이즈는 " + nSize + "MB 이내로 등록 가능합니다.");
    return false;
  }
  return true;
}

/** @brief 구분자를 제외한 맨 마지막 문자를 리턴 (파일명 분리 또는 파일확장자 추출 등에 사용)
*  @date 2023/03/02
*  @return "c:\\test\\test.php", "\\" => test.php, "c:\\test\\test.php", "." => php
*  @param 
*  @etc : 
**/
function getSplitData(data, splitvalue="\\"){
  var rtnvalue = data.split(splitvalue).pop();
  return rtnvalue;
}

/** @brief 마지막 .(perido) 앞까지 값만 추출
*  @date 2023/03/02
*  @return "c:\\test\\test.php" => c:\\test\\test
*  @param 
*  @etc : 
  url에서 확장자 제외 파일명만 구하기  : getSplitDataPeriod(getSplitData(url, '/'))
**/
function getSplitDataPeriod(data) {
  var _lastDot = data.lastIndexOf('.');
  var _fileExt = data.substring(0, _lastDot);
  return _fileExt;
}

/** @brief selectbox를 pData값으로 선택한다. 
*  @date 2023/03/02
*  @return 
*  @param pTarget : SelectBox ID, pData : 값, pDisbled = endabled / disabled
*  @etc : 
**/
function selectedSelectbox(pTarget, pData, pDisbled=""){
  if (pOption === 0)
  {
      $(pTarget).val(pData).prop("selected", true);
      if (isEmpty(pDisbled))
        $(pTarget).prop("disabled", false);
  }
}

/** @brief Tag 값을 설정한다
*  @date 2023/03/02
*  @return 
*  @param pTarget : 설정할 ID (#id)
*  @etc : 
**/
function setElementValue(pTarget, pData){
  if (!isEmpty(pTarget))
    $(pTarget).val(pData);
}

/** @brief Tag 속성을 설정한다. (attr도 동일)
*  @date 2023/03/02
*  @return 
*  @param pTarget : 설정할 ID (#id), pProp : 속성명, pValue = 속성 값, 기본값은 false
*  @etc : setElementProp('#test', 'checked', 'none')
**/
function setElementProp(pTarget, pProp, pValue=0){
  if (pValue === 0)
      $(pTarget).prop(pProp, false);
  else if (pValue === 1)
      $(pTarget).prop(pProp, true);
  else
      $(pTarget).prop(pProp, pValue);
}

/** @brief Tag css 값을 설정한다.
*  @date 2023/03/02
*  @return 
*  @param pTarget : 설정할 ID (#id), pProp : Style 값, pValue = 값 
*  @etc : setElementCSS('#test', 'display', 'none')
**/
function setElementCSS(pTarget, pProp, pValue=""){
  $(pTarget).css(pProp, pValue);
}

/** @brief checkbox id의 체크된 값을 리턴한다.
*  @date 2023/03/02
*  @return 
*  @param pTarget : chechbox id
*  @etc : 
**/
function getCheckBoxValue(pTarget){
  var rtnValue = "0";
  if ($(pTarget).is(':checked'))
      rtnValue = "1";
  return rtnValue;
}

/** @brief 문자열의 공백을 모두 제거한 뒤 비교한 결과 값을 리턴
*  @date 2023/03/02
*  @return 같으면 true, 틀리면 false
*  @param pTarget : chechbox id
*  @etc : 
**/
function compareText(pStr1, pStr2){
  var bRtnValue = false;
  pStr1 = pStr1.replace(/\s/gi, "")
  pStr2 = pStr2.replace(/\s/gi, "")
  if (pStr1 === pStr2)
      bRtnValue = true;
  return bRtnValue;
}

/** @brief 현재시간 타임스탬프를 구해 Text로 리턴
*  @date 2023/03/02
*  @return 
*  @param pValue가 있을 경우 "_" + pValue를 리턴한다.
*  @etc : 
**/
function getTimeStamp(pValue=""){
  // 초까지만 리턴
  var timestampSecond = Math.floor(+ new Date() / 1000);
  if (!isEmpty(pValue))
    timestampSecond = String(timestampSecond) + '_' + pValue;
  return String(timestampSecond);
}

/** @brief 배열에서 주어진 값을 제거 후 배열을 리턴
*  @date 2023/03/02
*  @return 
*  @param pArray : 배열, pVal : 제거할 값 (array)
*  @etc : 
**/
function DeleteArray(pArray, pVal){
  for(var i = 0; i < pArray.length; i++) {
    for (var j=0; j<pVal.length; j++){
      if(pArray[i] === pVal[j])  {
          pArray.splice(i, 1);
          i--;
          break;
      }
    }
  }
  return pArray;
}

/** @brief 문자열을 hex 값으로 리턴
*  @date 2023/03/02
*  @return 
*  @param pArray : 배열, pVal : 제거할 값 (array)
*  @etc : 
**/
function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

/** @brief 주어진 배열에서 랜덤하게 pCount를 선별 후 배열값을 리턴
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc [0,1,2,3,4,5] 에서 3 => [1,4,5]
**/
function generateRandomFromArray(pArray, pCount) {
  var randomItems = [];
  // 배열에서 요소를 랜덤하게 선택하고 randomItems 배열에 추가
  for (var i = 0; i < pCount; i++) {
    var randomIndex = Math.floor(Math.random() * pArray.length);
    randomItems.push(pArray[randomIndex]);
    // 이미 선택한 요소는 배열에서 삭제
    pArray.splice(randomIndex, 1);
  }
  return randomItems;
}

/** @brief 주어진 숫자에서 랜덤하게 pCount를 뽑아내는 함수
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc 10, 3 => [1,5,7] 리턴
**/
function generateRandomFromNumber(pNum, pCount){
  // undefined로 채워진 배열을 생성
  var randomItems = [];
  for (i=0; i<pCount; i++) {
    randomNum = Math.floor(Math.random() * pNum);
    if (randomItems.length == 0)
      randomItems.push(randomNum);
    else{
      var bExists = false;
      for (var j=0; j<randomItems.length; j++)
      {
        if (randomItems[j] == randomNum){
          bExists = true;
          break;
        }
      }
      if (!bExists){
        randomItems.push(randomNum);
      }
      else
        i = i-1;
    }
  }
  return randomItems;
}

/** @brief pColor에 대한 보색값을 리턴
*  @date 2023/03/02
*  @return 
*  @param  pColor : color 헥사 코드 (000000 -> #를 붙인값을 넘기면 안된다.)
*  @etc 10, 3 => [1,5,7] 리턴
**/
function getComplementaryColor(pColor){
  const colorPart = pColor.slice(1);
  const ind = parseInt(colorPart, 16);
  let iter = ((1 << 4 * colorPart.length) - 1 - ind).toString(16);
  while (iter.length < colorPart.length) {
    iter = '0' + iter;
  };
  return '#' + iter;
};

/** @brief  메타태그 변경 스크립트 (참고 : https://velog.io/@sso/open-graph-tag-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0 좀더 알아볼 필요가 있음)
*  @date 2023/03/02
*  @return 
*  @param  
*  @etc 
**/
// 메타태그 변경 스크립트
function cmaMetaTagsChange(url,stitle,scontent,simg,siterul){

  $("#meta_image_src").attr("href", simg); // 트위터 카드를 사용하는 URL이다.
  // 트위터 관련 메타태그
  $("#meta_twitter_url").attr("content", url); // 트위터 카드를 사용하는 URL이다.
  $("#meta_twitter_title").attr("content", stitle); // 트위터 카드에 나타날 제목
  $("#meta_twitter_description").attr("content", scontent); // 트위터 카드에 나타날 요약 설명
  $("#meta_twitter_image").attr("content", simg); // 트위터 카드에 보여줄 이미지

  // 페이스북 관련 메타태그 
  $("#meta_og_title").attr("content", stitle); //    제목표시
  $("#meta_og_image").attr("content", simg); //    이미지경로 w:90px , h:60px(이미지를 여러 개 지정할 수 있음)
  $("#meta_og_site_name").attr("content", stitle + '[' + siterul + ']'); //    사이트 이름
  $("#meta_og_url").attr("content", url); //    표시하고싶은URL
  $("#meta_og_description").attr("content", scontent); //    본문내용

  // 네이트온 관련 메타태그
  $("#meta_nate_title").attr("content", stitle); //    제목표시
  $("#meta_nate_description").attr("content", scontent); //    본문내용
  $("#meta_nate_site_name").attr("content", stitle + '[' + siterul + ']'); //    사이트 이름
  $("#meta_nate_url").attr("content",url); //    표시하고싶은URL
  $("#meta_nate_image").attr("content", simg); //    이미지경로

  // 카카오관련 메타태그
  $('meta[property="og:title"]').attr("content", stitle); //    제목표시
  $('meta[property="og:description"]').attr("content", scontent); //    본문내용
  $('meta[property="og:image"]').attr("content", simg); //    이미지경로
  $('meta[property="og:url"]').attr("content", url); //    이미지경로
}
