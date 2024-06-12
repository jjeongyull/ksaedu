// 서버 복호화
$(document).on("click", "#btnServerDecrypt", function(){
  //var szTemp = $('#inputEmail').val();
  var szTemp = $.trim($('#client_data').text());
  szTemp = rawurlencode(szTemp);
  $.ajax({
    type: "POST",
    url: "api.php",
    dataType: 'text',
    contentType : 'text/html; charset=utf-8',
    // parameter 보낼 경우 (서버에서 POST로 받음)
    // data: params,
    // request payload로 보낼 경우 (서버에서 request_body로 받음)
    data : szTemp,
    async: false,
    success: function(data) {
        $('#server_data').html(data);
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert("요청 처리 실패(ajax): " + xhr.status + "\n" + thrownError);
    }
  });
});

// 서버 암호화 -> 클라이언트 복호화
$(document).on("click", "#btnServerEncrypt", function(){
  //var szTemp = $('#inputEmail').val();
  $.ajax({
    type: "POST",
    url: "api.php",
    dataType: 'text',
    contentType : 'application/x-www-form-urlencoded; charset=utf-8',
    async: false,
    success: function(data) {
        data = urldecode(data);
        $('#server_data').html(data);
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert("요청 처리 실패(ajax): " + xhr.status + "\n" + thrownError);
    }
  });
});

function showModalDialog(){

}

function genJWTToken(){
  var rtnValue= "";
  // AccessToken 및 RefreshToken을 구한다.
  $.ajax({
    type: "POST",
    url: "api.php",
    dataType: 'text',
    contentType : 'text/html; charset=utf-8',
    data : "",
    async: false,
    success: function(data) {
      // data를 JSON으로 변경 
      // refresh 토근 쿠키 저장
      data = hex2a(data);
      var resultdata = JSON.parse(data);
      rtnValue = resultdata['a_token'];
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert("요청 처리 실패(ajax): " + xhr.status + "\n" + thrownError);
    }
  });
  return rtnValue;
}

// 로그인
$(document).on('click', '#btnLogin', function(){

  var user_id = TrimData(rtnIDString('inputEmail'));
  var user_password = TrimData(rtnIDString('inputPassword'));

  if (isEmpty(user_id)) {  return false }
  if (isEmpty(user_password)) { return false }


  // AccessToken 및 RefreshToken을 구한다.
  if (isEmpty(g_access_token))
    g_access_token = genJWTToken();
  $('#client_data').append(g_access_token + '<br>');
  // 토큰 밸리데이션 체크
  $.ajax({
    type: "POST",
    url: "api.php",
    dataType: 'text',
    headers: {
      "Authorization": "Bearer " + g_access_token
    },
    contentType : 'text/html; charset=utf-8',
    data : "",
    async: false,
    success: function(data) {
      data = hex2a(data);
      var resultdata = JSON.parse(data);
      g_access_token = resultdata['a_token'];
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert("요청 처리 실패(ajax): " + xhr.status + "\n" + thrownError);
        return "";
    }
  });
/*
  // 암호화 key, iv를 구한다.
  key = CryptoJS.enc.Hex.parse(g_access_token);
  iv = CryptoJS.enc.Hex.parse(g_access_token);

  var params = {};
  params.cmd = "login";
  params.user_id =user_id;
  params.user_password = user_password;

  var access_result = "";
  var refresh_result = "";
  var sendata = JSON.stringify(params);
  var sendata = urlencode(encodeByAES256(sendata));
  $.ajax({
    type: "POST",
    url: "api.php",
    dataType: 'text',
    contentType : 'text/html; charset=utf-8',
    data : sendata,
    async: false,
    success: function(data) {
      resultdata = JSON.parse(rawurldecode(data));
      if (typeof resultdata['mem_id'] !== 'undefined') {
        g_access_token = resultdata['access_token'];
        access_result = "access token : " + g_access_token;
        setCookie('access_token', g_access_token, 1);
        if (typeof resultdata['access_exp'] !== 'undefined') {
          access_result = access_result + ' / 토큰 만료 : ' + resultdata['access_exp'];
        }
        
        g_refresh_token = resultdata['refresh_token'];
        refresh_result = "refresh token : " + g_refresh_token;
        if (typeof resultdata['refresh_exp'] !== 'undefined') {
          refresh_result = refresh_result + ' / 토큰 만료 : ' + resultdata['refresh_exp'];
        }


        $('#div_access_token').html(access_result);
        $('#div_refesh_token').html(refresh_result);
        $('#btnLogout').css('display', 'block');
        $('#btnGetResource').css('display', 'block');
        $('#btnLogin').css('display', 'none');

      } 
      else if (typeof resultdata['error'] !== 'undefined') {
        alert('Error: ' + resultdata['error']);
      }
      else {
        alert('Error: Your request has failed.');
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert("요청 처리 실패(ajax): " + xhr.status + "\n" + thrownError);
    }
  });
*/  
});
// 로그인 유효성 검사
$(document).on('click', '#btnGetResource', function(){
  params = {};
  params.cmd = "check_valid_token";

  var sendata = JSON.stringify(params);
  var sendata = urlencode(encodeByAES256(sendata));


  $.ajax({
    type: "POST",
    url: "resource.php",
    dataType: 'text',
    contentType: "text/html; utf-8",
    headers: {
      "Authorization": "Bearer " + getCookie("access_token")
    },
    data: sendata,
    /*
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ');
    },
    */
    success: function(data, textStatus, request) {
      if (typeof data['mem_id'] !== 'undefined') {
        var alertMessage = '유효한 토큰!!! user id : ' + data['mem_id'];

        if (typeof data['exp'] !== 'undefined') {
          alertMessage = alertMessage + '  / 토큰 만료: ' + data['exp'];
        }

        $('#div_current_status').html(alertMessage);

      } 
      else if (typeof data['error'] !== 'undefined') {
        alert('Error: ' + data['error']);
      }
      else {
        $('#div_current_status').html('Error: Your request has failed.');
      }
    },
    error:function(request,status,error){
      alert("code:"+request.status+"\n"+"error:"+error);
    }
  });
});

// 로그아웃
$(document).on('click', '#btnLogout', function(){
  var szresult = "";
  $('#div_access_token').html(szresult);
  $('#btnLogout').css('display', 'none');
  $('#btnGetResource').css('display', 'none');
  $('#btnLogin').css('display', 'block');
});