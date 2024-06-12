/* 
Date : 2023.01.08
Desc : 유틸리티 함수 정의
Copyright : GreenPot Co., Ltd.
*/

function getNameFromPath(strFilepath) {
    var objRE = new RegExp(/([^\/\\]+)$/);
    var strName = objRE.exec(strFilepath);
    if (strName == null) {
        return null;
    }
    else {
        return strName[0];
    }
}

// 새창을 출력
function OpenWindow(pURL, pTitle, nWidth, nHeight)
{
    var popupX = (document.body.offsetWidth / 2) - (nWidth / 2);
    var popupY= (window.screen.height - nHeight) / 2;
    nHeight = nHeight-100;
    window.open(pURL, pTitle, 'scrollbars=1, status=no, height=' + nHeight + ', width=' + nWidth +', left='+ popupX + ', top='+ popupY);
}

// 디버깅 메시지 출력
function ShowDebug(Messagse, Debug){
    if (Debug){
        alert(Messagse);
    }
}

// 페이지 이동
// url : http를 포함한 url : http://www.additcorp.com , param : param1=aaa&param2=bb
function goToPage(url, param){
    if (isEmpty(param)){
        location.href=url;    
    } else {
        location.href=url + "?" + param;    
    }
}

// 이메일 유효성 체크
function ValidateEmail(InputData) 
{
    var emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if(emailRule.test(InputData)) {    
        return true;
    }
    else{
        return false; 
    }
}

// 숫자 입력 체크
function ValidateNumber(InputData) {
    var Number = /^\d{10}$/;
    if (InputData.match(Number)) {
        return true;
    } else {
        return false;
    }
}
// 아이디 유효성 검증
// 자리수 : 4~15자리 (영어 대소문자 + 숫자만 )
function ValidateID(InputData) {
    var RegID = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
    if (InputData.match(RegID)) {
        return true;
    } else {
        return false;
    }
}
// 비밀번호 정규식 체크
// 8자리~20자리, 특수문자+대소문자+숫자 반드시 포함
function ValidatePassword(InputData){
    var passwordRule = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (InputData.match(passwordRule)) {
        return true;
    } else {
        return false;
    }
}

// 한글 입력 방지 (크롬일 경우)
function fncRplc(obj)
{
    var patt = /[\ㄱ-ㅎ가-힣]/g;
    obj.value = obj.value.replace(patt, '');
}

// 숫자 및 소수점만 입력되도록
function numberWithPoint(object) {
    var x;
    x = object.value;
    x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
    x = x.replace(/,/g,'');          // ,값 공백처리
    $(object).val(x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 정규식을 이용해서 3자리 마다 , 추가 
}

// GET 방식으로 전달된 파라미터를 배열로 리턴
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

// 현재 페이지 가져오기
function getPageName(){
    var pageName = "";
    var tempPageName = window.location.href;
    var strPageName = tempPageName.split("/");
    pageName = strPageName[strPageName.length-1].split("?")[0];
 
    return pageName;
}

// 쿠키 설정
function setCookie(cookieName, value, exdays){
    var exdate = new Date();
    if (exdays == ""){
        exdate.setDate(exdate.getDate() + exdays);
        var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    }
    else{
        exdate.setDate(exdate.getDate() + exdays);
        var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    }
    document.cookie = cookieName + "=" + cookieValue + "; httpOnly";
    //document.cookie = cookieName + "=" + cookieValue;
        // SSL에서만 요청할 경우
        //document.cookie = cookieName + "=" + cookieValue + "; httpOnly; Secure";
}

// 쿠키 삭제
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

// 쿠키 불러오기
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

/**
 * 파일명에서 확장자명 추출
 * @param filename   파일명
 * @returns _fileExt 확장자명
 */
function getExtensionOfFilename(filename) {
    var _fileLen = filename.length;
    /** 
     * lastIndexOf('.') 
     * 뒤에서부터 '.'의 위치를 찾기위한 함수
     * 검색 문자의 위치를 반환한다.
     * 파일 이름에 '.'이 포함되는 경우가 있기 때문에 lastIndexOf() 사용
     */
    var _lastDot = filename.lastIndexOf('.');
    var _fileExt = filename.substring(_lastDot+1, _fileLen);
    return _fileExt;
}

// 확장자 제외한 파일명 추출 (url에서 확장자명을 제외한 파일명까지 추출)
function getOfwithurlFilename(filename) {
    var _fileLen = filename.length;
    /** 
     * lastIndexOf('.') 
     * 뒤에서부터 '.'의 위치를 찾기위한 함수
     * 검색 문자의 위치를 반환한다.
     * 파일 이름에 '.'이 포함되는 경우가 있기 때문에 lastIndexOf() 사용
     */
    var _lastDot = filename.lastIndexOf('.');
    var _fileExt = filename.substring(0, _lastDot);
    return _fileExt;
}

// url에서 확장자 제외, url제외 파일명만 추출하기
function getOfFileName(filename){
    var arSplitUrl = filename.split("/"); //   "/" 로 전체 url 을 나눈다
    var nArLength = arSplitUrl.length;
    var arFileName = arSplitUrl[nArLength - 1]; // 나누어진 배열의 맨 끝이 파일명이다
    var arSplitFileName = arFileName.split("."); // 파일명을 다시 "." 로 나누면 파일이름과 확장자로 나뉜다
    sFileName = arSplitFileName[0]; // 파일이름
    return sFileName;
    //var sFileExtension = arSplitFileName[1] // 확장자
}

// url에서 경로를 제외한 파일명만 추출하기
function getOfFileNameFromUrl(filename) {
    if (!isEmpty(filename)){
      var arSplitUrl = filename.split("/"); //   "/" 로 전체 url 을 나눈다
      var nArLength = arSplitUrl.length;
      var arFileName = arSplitUrl[nArLength - 1]; // 나누어진 배열의 맨 끝이 파일명이다
  /*    
      var arSplitFileName = arFileName.split("."); // 파일명을 다시 "." 로 나누면 파일이름과 확장자로 나뉜다
      var sFileExtension = arSplitFileName[1]; // 확장자
      sFileName = arSplitFileName[0] + '.' + sFileExtension; // 파일명
  */    
      return arFileName;
    }
    else{
      return "";
    }
}

// 도메인명을 제외한 서버 경로를 리턴한다. (http://wwww.xxxx.com/path)
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

// 모바일일 경우 Body의 95% 크기로 반환
// PC의 경우 지정된 크기로 반환
// 미리 보기일 경우 50%로 줄인다. (flag true)
function ResizeImage(orgwidth, orgheight, flag) {
    var width = orgwidth;
    var height = orgheight;
    var viewWidth = 0, viewHeight = 0;
    var mRaito = 0.9;
    if (flag){
        mRaito = 0.5;
    }
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

// Syncronize blocking 
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// URL이미지를 base64로 변경
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

function IsBase64Valid(data)
{
    if ((typeof (data) != "undefined") && (data != null)) {
        if (data.indexOf('base64') != -1)
            return true;
        else
            return false;
    }
    return false;
}

function IsBase64Valid__(param) {
    var base64Rejex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
    var isBase64Valid = base64Rejex.test(param); // base64Data is the base64 string
    return isBase64Valid;
}

// 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다. 
function isEmpty(value){
    if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
        return true
    }else{
        return false
    }
}

function isEmptyMsg(value, pMsg){
    if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
        alert(pMsg);
        return true
    }else{
        return false
    }
}

// value : 값, pMsg : 출력메시지, pID : 포커를 보낼 TagID, pType : 0 이면 아이디, 1 이면 객체 자체
function isEmptyToFocus(value, pMsg, pID, pType = 0){
    if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
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

// 데이터의 공백을 삭제한다.
function TrimData(param){
    return $.trim($(param).val());
}

// 로그인+ 비밀번호 스페이스 바 방지 
function noSpaceForm(obj) {
    var str_space = /\s/;  
    if(str_space.exec(obj.value)) { 
        obj.focus();
        obj.value = obj.value.replace(/\s| /gi,''); // 공백제거
        return false;
    }
}

/*
이벤트 사이의 간격 체크
var last, diff;
$("div").click(function (event) {
    if (last) {
        diff = event.timeStamp - last;
        $("div").append("time since last event: " + diff + "<br>");
    } else {
        $("div").append("Click again.<br>");
    }
    last = event.timeStamp;
});
*/

function get_string_length(pString, pLength){
    return pString.substr(0, pLength);
}