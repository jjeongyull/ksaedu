/* 함수 정의는 카멜 표기법을 쓰도록 한다. (totlaCnt, getNumber...) */
/*
  selector를 이용해 직접 함수를 적용할 경우 $.fn 으로 설정
  $.fn.setCSS() = function (name, value) {
    $(this).css(name, value)
}
*/

/* 
Date : 2023.03.20
Desc : 유틸리티 함수 정의
Copyright : GreenPot Co., Ltd.
*/

/* @brief 파일 경로에서 파일명을 구한다.
*  @date 2023/03/02
*  @return 
*  @param strFilepath : "C:\\test\test.png" => test.png
*/
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

/* @brief 새로운 브라우저 창을 오픈한다.
*  @date 2023/03/02
*  @return 
*  @param pURL : URL, pTitle : 창 타이틀, nWidth : 창넓이, nHeight : 창 높이
        Scroll = 1이면 스크롤바 출력(0), status = "yes"이면 상태바 출력
*/
function openWindow(pURL, pTitle, nWidth, nHeight, Scroll="1", status="no")
{
  var popupX = (document.body.offsetWidth / 2) - (nWidth / 2);
  var popupY= (window.screen.height - nHeight) / 2;
  nHeight = nHeight-100;
  var szOption = 'scrollbars=' + Scroll + ', status=' + status + ', height=' + nHeight + ', width=' + nWidth +', left='+ popupX + ', top='+ popupY
  window.open(pURL, pTitle, szOption);
}


/* @brief 페이지 이동
*  @date 2023/03/02
*  @return 
*  @param url : http를 포함한 url : http://www.additcorp.com, param : param1=aaa&param2=bb
*/
function gotoPage(url, param){
  if (isEmpty(param)){
      location.href=url;    
  } else {
      location.href=url + "?" + param;    
  }
}

/* @brief 이메일 체크 정규식
*  @date 2023/03/02
*  @return true / false
*  @param 
*/
function validateEmail(sValue) 
{
  var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if(regExp.test(sValue)) {    
      return true;
  }
  else{
      return false; 
  }
}

/* @brief 비밀번호 체크 정규식 (영문, 숫자, 특수문자 조합, 8~16자리)
*  @date 2023/03/02
*  @return true / false
*  @param 
*/
function validatePassword(sValue) 
{
  var regExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/i;
  if(regExp.test(sValue)) {    
      return true;
  }
  else{
      return false; 
  }
}

/* @brief 숫자 입력 체크 정규식
*  @date 2023/03/02
*  @return true / false
*  @param 
*/
// 숫자 입력 체크 (정규식으로 처리)
function isNumeric_1(nsource) {
  var Number = /^\d{10}$/;
  try{
    if (nsource.match(Number)) {
      return true;
    } else {
      return false;
    }
  }catch(e){
    return false;
  }  
}

/* @brief 숫자가 양수인지/음수인지 확인, 기준값에 따라 true/false 리턴
*  @date 2023/03/02
*  @return true / false
*  @param psource : 체크값, ptype : +/-, pbase : 기준값
*  isNumeric(10, +, 11) => 11보다 작으므로 false /  isNumeric(10, +) => 양수이므로 true
*/
function isNumeric_2(nsource, ptype="+", pbase=0){
  var rtnValue = false;
  // 숫자인지 체크
  if ($.isNumeric(nsource))
  {
    switch (ptype){
      case "+" : 
        if (nsource >= pbase)
          rtnValue = true;
        break;
      case "-" :
        if (nsource < pbase)
          rtnValue = true;
        break;
      default :
        if (nsource >= pbase)
          rtnValue = true;
        break;
    }
  }
  return rtnValue;
}

/* @brief 아이디 유효성 검사
*  @date 2023/03/02
*  @return true / false
*  @param pData : 체크값, pcheck = 1 : 대소문자 포함, 2 : 대소문자+숫자, 3 : 대소문자 + 숫자 + 특수문자
*/
function validateID(sValue, ctype, min, max) {
  var regExp = "";
  switch (ctype){
    case 1 : 
      regExp = "^[a-zA-Z]{" + min + "," + max + "}$";
      break;
    case 2 :
      regExp = "^[a-zA-Z][a-zA-Z0-9]{" + min + "," + max + "}$";
      break;
    case 3 : 
    regExp = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{" + min + "," + max + "}$";
      break;
    default :
      break;
  }
  regExp = new RegExp(regExp);
  if (sValue.test(regExp)) {
      return true;
  } else {
      return false;
  }
}

/* @brief 한글입력 방지
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc : 크롬 브라우저일 경우에만 적용 된다.
*/
// 한글 입력 방지
$.fn.preventKorean = function(){
  {
    this.on('keyup', function(event){
      var keyCode = (event.keyCode ? event.keyCode : event.which);   
      if (keyCode != 13){
        var regExp = /[\ㄱ-ㅎ가-힣]/g;
        var inputdata = $(this).val();
        if (!isEmpty(inputdata))
          var inputdate = inputdata.replace(regExp, '');
          $(this).val(inputdate);
      }
    })
  }
}

/* @brief 숫자만 입력되도록
*  @date 2023/08/28
*  @return 
*  @param 
*/  
$.fn.onlyNumber = function(){
  this.on('keyup', function(event){
    var keyCode = (event.keyCode ? event.keyCode : event.which);   
    if (keyCode != 13){
      var regExp = /[^0-9]/gi;
      var inputdata = $(this).val();
      if (!isEmpty(inputdata))
        var inputdate = inputdata.replace(regExp, '');
        $(this).val(inputdate);
    }
  })
}

// 숫자만
function onlyNumberValue(input){
  input.value = input.value.replace(/\D/g, '');
}


/* @brief 숫자, 소수점만 입력이 되도록 (3자리 마다 ,를 추가한다.)
*  @date 2023/03/02
*  @return 
*  @param 
*/
function numberWithPoint(object) {
  var x;
  x = object.value;
  if (isEmpty(x)){
    return 0
  }
  else{
    x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
    x = x.replace(/,/g,'');        // ,값 공백처리
    $(object).val(x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 정규식을 이용해서 3자리 마다 , 추가 
  }
}

function numberWithPointValue(value) {
  if (isEmpty(value)){
    return 0
  }
  else{
    value = value.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
    value = value.replace(/,/g,'');        // ,값 공백처리
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가 
  }
}

/* @brief GET 방식으로 전달된 파라미터 리턴
*  @date 2023/03/02
*  @return 
*  @ URLSearchParams은 decodeURIComponent를 하지 않아도 자동 디코딩을 진행
*/
const urlParams = function(param){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

/* @brief 현재 페이지명을 리턴한다.
*  @date 2023/03/02
*  @return https://xxx.xxx.xxx/test.html => test.html
*  @param 
*/
function getCurrentPagename(){
  var pageName = "";
  var tempPageName = window.location.href;
  var strPageName = tempPageName.split("/");
  pageName = strPageName[strPageName.length-1].split("?")[0];
  return pageName;
}

/* @brief 쿠키를 설정한다.
*  @date 2023/03/02
*  @return 
*  @param cookieName: 쿠키명, value : 쿠키값, exdays : 종료일 (1 : 1일)
*/
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

/* @brief 쿠키를 삭제한다.
*  @date 2023/03/02
*  @return 
*  @param cookieName: 쿠키명
*/
function deleteCookie(cookieName){
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() - 1);
  document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

/* @brief 쿠키값을 얻어온다. 
*  @date 2023/03/02
*  @return 
*  @param cookieName: 쿠키명
*  @etc httpOnly일 경우에는 값을 읽어올 수 없다.
*/
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

/* @brief 쿠키값을 얻어온다. 도메인명을 제외한 서버 경로를 리턴한다.
*  @date 2023/03/02
*  @return "http://xxx.xxx.xxx/test/test.html" -> /test/test.html 을 리턴
*  @param 
*/
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

/* @brief 이미지 크기를 재조정해 리턴한다.
*  @date 2023/03/02
*  @return 
*  @param orgwidth: 원본넓이, orgheight: 원본높이, ration = 비율/소숫점 (0.3, 0.5 ..)
*/
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

/* @brief data가 base64 인코딩 된 것인지 확인
*  @date 2023/03/02
*  @return 
*  @param 
*/
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

/* @brief 값이 공백 또는 정의되지 않았는지 확인
*  @date 2023/03/02
*  @return 
*  @param pMsg : 공백이면 출력할 메시지
*/
function isEmpty(value, pMsg=""){
  if( value == "" || value == null || value == 'null' || 
      value == "undefined" || value == undefined || 
      ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    if (pMsg !== "")
      alert(pMsg);
    return true
  }else{
      return false
  }
}

/* @brief html id 형태로 리턴
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc : oninput 이벤트로 처리한다.
*/
function rtnIDString(pString, pAddString=""){
  var sztemp = "";
  sztemp = "#" + pString + pAddString;
  return sztemp;
}

/* @brief 값이 공백 또는 정의되지 않았는지 확인
*  @date 2023/03/02
*  @return 
*  @param value : 값, pMsg : 출력메시지, pID : 포커를 보낼 TagID, pType : 0 이면 아이디, 1 이면 객체 자체
*/
function isEmptyToFocus(value, pMsg, pID, pType = 0){
  if( value == "" || value == null || value == 'null' || value == "undefined" || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    alert(pMsg);
    if (pType == 0){
      $(pID).focus();

    }else{
      pID.focus();
    }
    return true
  } else{
      return false
  }
}

/* @brief 문자열이 포함되어 있으면 참을 리턴
*  @date 2023/03/02
*  @return 
*  @param pString: 문자열, pWord : 체크할 문자
*/
function getMatchString(pString, pWord){
var bMatch = false;
if (pString.match(pWord))
  bMatch = true;
return bMatch;
}

/* @brief  공백 삭제
*  @date 2023/03/02
*  @return 
*  @param 
*/
function TrimData(param){
  return $.trim($(param).val());
}

/* @brief URIComponent Encoding
*  @date 2023/03/02
*  @return 
*  @param 
*/
function trimeencodinguri(param){
  var sztemp = $.trim($(param).val());
  sztemp = encodeURIComponent(sztemp);
  return sztemp;
}

function encodinguri(data){
  var sztemp = encodeURIComponent(data);
  if (isEmpty(data))
    return "";
  else
    return sztemp;
}

/* @brief URIComponent Decoding;
*  @date 2023/03/02
*  @return 
*  @param 
*/
function decodinguri(param){
  var sztemp  = decodeURIComponent(param);
  if (isEmpty(sztemp))
    return "";
  else
    return sztemp;
}

/* @brief php의 urlencode 처리를 자바스크립트로 표현 시
*  @date 2023/03/02
*  @return 
*  @param 
*/
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

function inputNum(obj) {
  var patt = /[^0-9]/gi;
  obj.value = obj.value.replace(patt, '');
  }

/*
  encodeURI() : 인터넷 주소에서 사용하는 , ;, /, =, ?, & 등을 제외하고 인코딩
  decodeURI()
  encodeURIComponent() : 모든 문자를 인코딩 / 디코딩
  decodeURIComponent()
*/

/* @brief php의 urldecode 처리를 자바스크립트로 표현시
*  @date 2023/03/02
*  @return 
*  @param 
*/
function urldecode(str) {
  return decodeURIComponent((str + '')
      .replace(/%(?![\da-f]{2})/gi, function() {
          return '%25';
      })
      .replace(/\+/g, '%20'));
}

/* @brief php의 rawurlencode 처리를 자바스크립트로 표현시
*  @date 2023/03/02
*  @return 
*  @param 
*/
function rawurlencode(str) {
  str = (str + '').toString();
  return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
}

/* @brief  php의 rawurldecode 처리를 자바스크립트로 표현시
*  @date 2023/03/02
*  @return 
*  @param 
*/
function rawurldecode(str) {
  return decodeURIComponent((str + '')
      .replace(/%(?![\da-f]{2})/gi, function() {
          return '%25';
  }));
}

/* @brief 입력문자 체크 (입력 방지 처리)
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

/* @brief 입력 불가 문자 처리
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

/* @brief 입력 불가 문자 처리
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

/* @brief 문자열에서 pStartNum부터 nLength까지의 문자를 구한다.
*  @date 2023/03/02
*  @return 
*  @param pString : 문자열, pStartNum : 시작 숫자, nLength : 길이
*/
function getStringLength(pString, pStartNum, pLength){
  if (!isEmpty(pString))
      return pString.substr(pStartNum, pLength);
}

/* @brief input type이 number일 경우 maxlength를 넘어가지 않도록 처리
*  @date 2023/03/02
*  @return 
*  @param input element
*  @etc : oninput 이벤트로 처리한다.
*/
function maxLengthCheck(object){
  if (object.value.length > object.maxLength){
    object.value = object.value.slice(0, object.maxLength);
  }    
}

/* @brief id 또는 class의 value을 좌우 공백을 제거한 후 리턴
*  @date 2023/11/05
*  @return 
*  @param attrname = class, id
*/
function getIDValue(id, attrname="id"){
  try{
    return $.trim($(getID(id)).val());
  }
  catch(e){
    return "";
  }
}

/* @brief id 또는 class의 text를 좌우 공백을 제거한 후 리턴
*  @date 2023/11/05
*  @return 
*  @param attrname = class, id
*/
function getText(id, attrname="id"){
  try{
    return $.trim($(getID(id)).text());
  }
  catch(e){
    return "";
  }
}

/*
  classname => .class / id => #id 로 리턴
  type = class, id
*/
function getID(id, attrname="id"){
  try{
    var sztemp = "";
    if (attrname === "id"){
      if($.type(id).toLowerCase() === "object"){ // 객체이면
        var tmp = $(id).attr(attrname);
        if (!isEmpty(tmp))
          sztemp = "#" + tmp;
      }
      else{
        sztemp = "#" + id;
      }
    }
    else if (attrname === "class"){
      sztemp = '.' + id;
    }
    return sztemp;
  }
  catch(e){
    return "";
  }
}


/* @brief 입력창에 입력된 콤마 제거
*  @date 2023/08/25
*  @return 
*  @param 문자열
*/
function removeComma(pData){
  return pData.replaceAll(",", "");
}

/* @brief 날짜를 비교 후 시작 날짜가 종료 날짜보다 클 경우 false를 리턴
*  @date 2023/03/02
*  @return 
*  @param pStart : 시작 날짜 Datapicker ID / eEnd : 종료 날짜 Datapicker ID
*  @etc : datepikcer 사용 시
*/
function compareDate(pStart, pEnd){
  var rtnValue = true;
  var date1 = new Date(pStart).getTime();
  var date2 = new Date(pEnd).getTime();
  if (date2 - date1 < 0){
      rtnValue = false;
  }
  return rtnValue;
}

/**********************************************************************************
* 파일 업로드 관련 체크 함수
/********************************************************************************/
/* @brief 배열에 주어진 값이 있을 경우 
*  @date 2023/03/02
*  @return 값이 없을 경우 false를 리턴, 값이 존재할 경우 true 리턴
*  @param pType = 1 이면 파일명, 확장자 분리를 위해
*  @etc : 
*/
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

/* @brief 배열에 주어진 값이 있을 경우 
*  @date 2023/03/02
*  @return 원본 크기가 비교 크기 보다 클 경우 false 리턴
*  @param oSize : 원본 크기 (byte), nSize : 비교할 크기 (MB)
*  @etc : 
*/
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

/* @brief 구분자를 제외한 맨 마지막 문자를 리턴 (파일명 분리 또는 파일확장자 추출 등에 사용)
*  @date 2023/03/02
*  @return "c:\\test\\test.php", "\\" => test.php, "c:\\test\\test.php", "." => php
*  @param 
*  @etc : 
*/
function getSplitData(data, splitvalue="\\"){
  var rtnvalue = data.split(splitvalue).pop();
  return rtnvalue;
}

/* @brief 마지막 .(perido) 앞까지 값만 추출
*  @date 2023/03/02
*  @return "c:\\test\\test.php" => c:\\test\\test
*  @param 
*  @etc : 
  url에서 확장자 제외 파일명만 구하기  : getSplitDataPeriod(getSplitData(url, '/'))
*/
function getSplitDataPeriod(data) {
  var _lastDot = data.lastIndexOf('.');
  var _fileExt = data.substring(0, _lastDot);
  return _fileExt;
}

/* @brief selectbox를 pData값으로 선택한다. 
*  @date 2023/03/02
*  @return 
*  @param pTarget : SelectBox ID, pData : 값, pDisbled = endabled / disabled
*  @etc : 
*/
function selectedSelectbox(pTarget, pData, pDisbled=""){
  if (pOption === 0)
  {
      $(pTarget).val(pData).prop("selected", true);
      if (isEmpty(pDisbled))
        $(pTarget).prop("disabled", false);
  }
}

/* @brief Tag 값을 설정한다
*  @date 2023/03/02
*  @return 
*  @param pTarget : 설정할 ID (#id)
*  @etc : 
*/
function setElementValue(pTarget, pData){
  if (!isEmpty(pTarget))
    $(pTarget).val(pData);
}

/* @brief Tag 속성을 설정한다. (attr도 동일)
*  @date 2023/03/02
*  @return 
*  @param pTarget : 설정할 ID (#id), pProp : 속성명, pValue = 속성 값, 기본값은 false
*  @etc : setElementProp('#test', 'checked', 'none')
*/
function setElementProp(pTarget, pProp, pValue=0){
  if (pValue === 0)
      $(pTarget).prop(pProp, false);
  else if (pValue === 1)
      $(pTarget).prop(pProp, true);
  else
      $(pTarget).prop(pProp, pValue);
}

/* @brief Tag css 값을 설정한다.
*  @date 2023/03/02
*  @return 
*  @param pTarget : 설정할 ID (#id), pProp : Style 값, pValue = 값 
*  @etc : setElementCSS('#test', 'display', 'none')
*/
function setElementCSS(pTarget, pProp, pValue=""){
  $(pTarget).css(pProp, pValue);
}

/* @brief checkbox id의 체크된 값을 리턴한다.
*  @date 2023/03/02
*  @return 
*  @param pTarget : chechbox id
*  @etc : 
*/
function getCheckBoxValue(pTarget){
  var rtnValue = "0";
  if ($(pTarget).is(':checked'))
      rtnValue = "1";
  return rtnValue;
}

// 동일한 name의 체크박스를 대상으로 check된 값을 "," 구분 문자열로 리턴한다.
function getArrayCheckBoxValue(pTarget){
  var chkArr = [];
  pTarget.each(function(){
      var chk = $(this).val();
      chkArr.push(chk);
  });
  
  return String(chkArr);
}


/* @brief 문자열의 공백을 모두 제거한 뒤 비교한 결과 값을 리턴
*  @date 2023/03/02
*  @return 같으면 true, 틀리면 false
*  @param pTarget : chechbox id
*  @etc : 
*/
function compareText(pStr1, pStr2){
  var bRtnValue = false;
  pStr1 = pStr1.replace(/\s/gi, "")
  pStr2 = pStr2.replace(/\s/gi, "")
  if (pStr1 === pStr2)
      bRtnValue = true;
  return bRtnValue;
}

/* @brief 현재시간 타임스탬프를 구해 Text로 리턴
*  @date 2023/03/02
*  @return 
*  @param pValue가 있을 경우 "_" + pValue를 리턴한다.
*  @etc : 
*/
function getTimeStamp(pValue=""){
  // 초까지만 리턴
  var timestampSecond = Math.floor(+ new Date() / 1000);
  if (!isEmpty(pValue))
    timestampSecond = String(timestampSecond) + '_' + pValue;
  return String(timestampSecond);
}

/* @brief 배열에서 주어진 값을 제거 후 배열을 리턴
*  @date 2023/03/02
*  @return 
*  @param pArray : 배열, pVal : 제거할 값 (array)
*  @etc : 
*/
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

/* @brief 문자열을 hex 값으로 리턴
*  @date 2023/03/02
*  @return 
*  @param pArray : 배열, pVal : 제거할 값 (array)
*  @etc : 
*/
function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

/* @brief 주어진 배열에서 랜덤하게 pCount를 선별 후 배열값을 리턴
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc [0,1,2,3,4,5] 에서 3 => [1,4,5]
*/
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

/* @brief 주어진 숫자에서 랜덤하게 pCount를 뽑아내는 함수
*  @date 2023/03/02
*  @return 
*  @param 
*  @etc 10, 3 => [1,5,7] 리턴
*/
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
/* 오늘날짜 yyyy-mm-dd형식으로 바꿔주기
  ntype : month이면 월까지, day이면 날짜까지
*/
function tobayDateMake(pDate, ntype=""){
    var year = pDate.getFullYear();
    var month = ('0' + (pDate.getMonth() + 1)).slice(-2);
    var day = ('0' + (pDate.getDate())).slice(-2);
    //var today = `${year}-${month}-${day}`;
    if (ntype=='month')
      var today = `${year}-${month}`;
    else
      var today = `${year}-${month}-${day}`;
    return today;
}

/* @brief pColor에 대한 보색값을 리턴
*  @date 2023/03/02
*  @return 
*  @param  pColor : color 헥사 코드 (000000 -> #를 붙인값을 넘기면 안된다.)
*  @etc 10, 3 => [1,5,7] 리턴
*/
function getComplementaryColor(pColor){
  const colorPart = pColor.slice(1);
  const ind = parseInt(colorPart, 16);
  let iter = ((1 << 4 * colorPart.length) - 1 - ind).toString(16);
  while (iter.length < colorPart.length) {
    iter = '0' + iter;
  };
  return '#' + iter;
};

/* @brief  메타태그 변경 스크립트 (참고 : https://velog.io/@sso/open-graph-tag-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0 좀더 알아볼 필요가 있음)
*  @date 2023/03/02
*  @return 
*  @param  
*  @etc 
*/
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

// 주어진 테이블의 thead 의 tr의 td 값을 읽어 배열로 리턴
function columnHeadText(pTarget){
  var chkArray = [];
  var th = $(pTarget).children('thead').children('tr').children();
  th.each(function(i){
    var txt = th.eq(i).text();
    txt = $.trim(txt.replace(/\n/g, ''));  // 정규식을 이용해 개행문자 및 공백을 지운다.
    if (!isEmpty(txt)){
      chkArray.push(txt);
    }
  });
  return chkArray;
}

function getRadioValue(name){
  return $('input[name="' + name + '"]:checked').val();
}

function getSelectBoxText(pTarget){
  var result = $(pTarget + ' option:checked').text();
  return result;
}

// 주어진 Target의 자식 태그 중 checkbox를 찾아 체크된 항목의 value를 배열로 리턴한다.
function selectedCheckboxValue(pTarget){
  var chkArray = [];
  $(pTarget).children().each(function(){
    if ($(this).find('input').is(":checked")){
      var chk = $(this).find('input').val();
      chkArray.push(chk);
    }
  });
  return chkArray;
}

// 주어진 Target의 자식 태그 중 checkbox를 찾아 체크된 항목의 Text를 배열로 리턴한다.
function selectedCheckboxText(pTarget){
  var chkArray = [];
  $(pTarget).children().each(function(){
    if ($(this).find('input').is(":checked")){
      var chk = $.trim($(this).find('input').text());
      chkArray.push(chk);
    }
  });
  return chkArray;
}

// 주어진 Target의 자식 태그 중 checkbox를 찾아 체크된 항목의 Text를 배열로 리턴한다.
function selectedCheckboxID(pTarget){
  var chkArray = [];
  $(pTarget).children().each(function(){
    if ($(this).find('input').is(":checked")){
      var chk = $(this).find('input').attr('id');
      chkArray.push(chk);
    }
  });
  return chkArray;
}

// 체크박스 값 리턴
function chkValueArray(pTarget){
    var chkArr = [];
    pTarget.each(function(){
        var chk = $(this).val();
        chkArr.push(chk);
    });
    
    return chkArr;
}
//전화번호 정규식
$(document).on("keyup", ".phoneNumber", function() { 
  $(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") );
});

function formatPhoneNumber(input) {
  // 입력값 추출
  var phoneNumber = input.value;

  // 숫자만 추출
  phoneNumber = phoneNumber.replace(/\D/g, "");

  // 국제 전화번호 형식으로 변환
  if (phoneNumber.startsWith("82")) {
      // 국제 전화번호 (대한민국)
      phoneNumber = phoneNumber.replace(/^(82)(\d{1,2})(\d{3,4})(\d{4})$/, "$1-$2-$3-$4");
  } else if (phoneNumber.startsWith("1")) {
      // 미국 및 캐나다 휴대전화번호
      phoneNumber = phoneNumber.replace(/^(1)(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3-$4");
  } else {
      // 지역 전화번호 형식
      phoneNumber = phoneNumber.replace(/(\d{1,3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
  }

  // 변환된 전화번호를 입력 필드에 설정
  input.value = phoneNumber;
}

function numberWithCommas(object) {
  var x;
  x = object.value;
  x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
  x = x.replace(/,/g,'');          // ,값 공백처리
  $(object).val(x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 정규식을 이용해서 3자리 마다 , 추가 
}

function setNumberFormat(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
}

// yyyy-mm 만 리턴한다.
function getTodayType(){
  var date = new Date();
  return date.getFullYear() + "-" + ("0" + (date.getMonth()+1)).slice(-2);
}
// yyyy-mm-dd 만 리턴한다.
function getTodayType2() {
  var date = new Date();
  return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0"+date.getDate()).slice(-2);
}

/* @brief 페이징 처리 
*  @date 2023/03/02
*  @return 
*  @param tatalData : 전체데이터 개수, dataPerPage : 페이지당 데이터개수, 
* pageCount : 전체 출력할 페이지 수, currentPage : 현재 페이지
*/
function pagingAddit(totalData, dataPerPage, pageCount, currentPage, tblname, searchdata){

  //console.log("currentPage : " + currentPage);
  try{
    var totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹
  
    var MobilePageGroup = Math.ceil(currentPage/5);      // 모바일은 5개식 보여준다.
    
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage)
        last = totalPage;
    var first = last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last+1;
    var prev = first-1;
    
    
    var Mobilelast = MobilePageGroup * 5;    // 화면에 보여질 마지막 페이지 번호
    if (Mobilelast > totalPage)
        Mobilelast = totalPage;
    var Mobilefirst = Mobilelast - (4);    // 화면에 보여질 첫번째 페이지 번호
    
  
    var html = "";
  
    if (isEmpty(searchdata)){
        searchdata = "";
    }

    html = '<ul class="pagination">';
  
    if (first <= 0){
        first = 1;
    }
    if(currentPage > 1 && currentPage < 3){
        // html += "<li class='page-item'><a href='javascript:void(0);' class='page-link' data-page='1'>처음페이지</a></li>";
        // html += "<li class='page-item'><a href='javascript:void(0);' class='page-link' data-page='" + prev + "'></a></li>";
        html += "<li class='page-item'><a class='page-link' href='#' ";
        html += "data-searchdata='" + searchdata + "' data-tblname='" + tblname + "'";
        html += " data-page='" + (currentPage - 1) + "' aria-label='Previous'><span aria-hidden='true'>이전</span></a></li>";
    }else if(currentPage > 2){
        html += "<li class='page-item'><a class='page-link' href='#' ";
        html += "data-searchdata='" + searchdata + "' data-tblname='" + tblname + "' ";
        html += "data-page='1' aria-label='Previous'><span aria-hidden='true'>처음페이지</span></a></li>";
        html += "<li class='page-item'><a class='page-link' href='#' ";
        html += "data-searchdata='" + searchdata + "' data-tblname='" + tblname + "'";
        html += " data-page='" + (currentPage - 1) + "' aria-label='Previous'><span aria-hidden='true'>이전</span></a></li>";
    }
  
    for(var i=first; i <= last; i++){
        if (i == currentPage) {
            html += "<li class='page-item'><a class='page-link selected_page' href='#' "
            html += "data-searchdata='" + searchdata + "' data-tblname='" + tblname + "'";
            html += " data-page='" + i + "' aria-label='Previous'><span aria-hidden='true'>" + i + "</span></a></li>";
        }
        else {
            html += "<li class='page-item'><a class='page-link' href='#' ";
            html += "data-searchdata='" + searchdata + "' data-tblname='" + tblname + "' data-page='" + i + "' ";
            html += "aria-label='Previous'><span aria-hidden='true'>" + i + "</span></a></li>";
        }
    }
    
    if (last < totalPage) {
        html += "<li class='page-item'><a class='page-link' href='#' data-searchdata='" + searchdata + "' data-tblname='" + tblname + "' data-page='" + i + "' aria-label='Previous'><span aria-hidden='true'>" + i + "</span></a></li>";
    }

    if((currentPage + 1) > totalPage){
        return html;
    }else{
        if (totalPage > pageCount) {
            html += "<li class='page-item'><a class='page-link' href='#' data-searchdata='" + searchdata + "' ";
            html += "data-tblname='" + tblname + "' data-page='" + (currentPage + 1) + "' aria-label='Previous'>";
            html += "<span aria-hidden='true'>다음</span></a></li>";
        }
        html = html + "<li class='page-item'><a class='page-link' href='#' data-searchdata='" + searchdata + "' data-tblname='" + tblname + "' data-page='" + last + "' aria-label='Previous'><span aria-hidden='true'>마지막페이지</span></a></li></ul>";
        return html;
    }
    
   
  }
  catch(e)
  {
    alert(e.message);
  }
}
  



function checkReg(event) {
    const regExp = /[^\w\s]/g; // 숫자와 영문자만 허용
  //   const regExp = /[^ㄱ-ㅎ|가-힣]/g; // 한글만 허용
    const del = event.target;
    if (regExp.test(del.value)) {
      del.value = del.value.replace(regExp, '');
    }
};

// 퍼센테이지 계산
function getPercentage(pNowData, pPlandata){
    var tmp = parseFloat(pNowData) / parseFloat(pPlandata)
    tmp = (tmp * 100).toFixed(2);
    if (!isNaN(tmp)) {
        tmp = tmp + '%';
    } else {
        tmp = '0.00%';
    }
    return tmp;
}

// JSON 객체의 길이를 리턴한다.
function getJSONLength(pJSON){
  try{
    return Object.keys(pJSON).length;  
  }catch(e){
    return 0;
  }
}

// 현재날짜를 구한다음 01을 붙여 YYYY-MM-01로 리턴한다.
function getDateString(){
  var date = new Date();
  date = tobayDateMake(date);
  date = date.substr(0, 8);
  date = date + '01';
  return date;
}

/* @brief 변수 미선언 체크
*  @date 2023/03/02
*  @return 
*  @param pMsg : 공백이면 출력할 메시지
*/
var bDefine = function (pvalue){
  if (typeof pvalue == "undefined"){
    return false;
  }
  return true;
}

$.fn.setCSS = function (name, value) {
  $(this).css(name, value)
}

// jsonObj를 만든다.
const addOrUpdateInfoToJson = function (jsonObj, key, value) {
  // 키가 이미 존재하는지 확인
  if (jsonObj.hasOwnProperty(key)) {
      // 키가 존재하면 해당 키의 값을 업데이트
      jsonObj[key] = value;
  } else {
      // 키가 존재하지 않으면 새로운 키-값 쌍을 추가
      jsonObj[key] = value;
  }
  // 수정된 JSON 객체를 반환
  return jsonObj;
}

/* uuid 생성 */
const uuidv4 = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// json데이터 필터함수
/**
 * 배열객체에서 원하는 객체의 값을 가져오는 함수
 * @param {*} pData : 필터링 할 데이터
 * @param {*} value : 비교할 값
 * @param {*} keyName : 데이터에서 비교할 키 네임
 * @param {*} rtnKey : 리턴시킬 데이터의 키값
 */
function json_filter(pData, value, keyName, rtnKey){
  let rtnData = pData.filter((items) => {
    return String(value) === String(items[keyName]);
  });
  if(rtnData.length != 0){
    return rtnData[0][rtnKey];
  }else{
    return false;
  }

}

// json데이터 필터함수
/**
 * 배열객체에서 원하는 객체를 가져오는 함수
 * @param {*} pData : 필터링 할 데이터
 * @param {*} value : 비교할 값
 * @param {*} keyName : 데이터에서 비교할 키 네임
 * 
 */
function json_filter_json(pData, value, keyName){
  let rtnData = pData.filter((items) => {
    return String(value) === String(items[keyName]);
  });
  if(rtnData.length != 0){
    return rtnData[0];
  }else{
    return false;
  }
}

// json데이터 필터함수
/**
 * 배열객체에서 원하는  배열 가져오는 함수
 * @param {*} pData : 필터링 할 데이터
 * @param {*} value : 비교할 값
 * @param {*} keyName : 데이터에서 비교할 키 네임
 * 
 */
function json_filter_arr(pData, value, keyName){
  let rtnData = pData.filter((items) => {
    return String(value) === String(items[keyName]);
  });
  if(rtnData.length != 0){
    return rtnData;
  }else{
    return false;
  }
}

function hide_popup() {
  let modalid = getID('modal_popup_1');
  $(modalid).iziModal('close');

}