let g_error_message = "";
// 버튼 토글을 위한 원본 text 
let toggle_org_text = "";

/** @brief Ajax 처리 (plain data)
*  @date 2023/03/02
*  @return 
*  @param url : server url, headers : header(json), data : 전송 데이터(json), type = post(default)/get
**/
function xhr_palin(url, data, headers=null, dataType="text", async=true, type="POST") {
  return $.ajax({
    url: url,
    data : data,
    type: type,           
    async: async,
    dataType: dataType,       
    headers: headers, 
    contentType : 'text/html; charset=utf-8', // contentType : 'application/x-www-form-urlencoded; charset=utf-8',
    beforeSend: showLoadingButton(true, '#btnSetCookie')
  })
  .fail(function(xhr, textStatus, errorThrown) { 
    display_modal('fail', textStatus, errorThrown);
  })  // 항상 실행
  .always(function(xhr, textStatus, errorThrown) { 
    display_modal('always', textStatus, errorThrown);
    showLoadingButton(false, btnSetCookie);
  });
}

/** @brief Ajax 처리 - Multipart data (image, binary 등)
*  @date 2023/03/02
*  @return 
*  @param url : server url, header(json), data : 전송 데이터(formdata), type = post(default)/get
**/
function xhr_multipart(url, formdata, headers=null, dataType="text", async=true, type="POST") {
  return $.ajax({
    url: url,
    data : formdata,
    type: type,           
    async: async,
    dataType: dataType, 
    headers: headers,      // json
    enctype: "multipart/form-data", //form data 설정,
    processData: false, //프로세스 데이터 설정 : false 값을 해야 form data로 인식합니다
    contentType: false, //헤더의 Content-Type을 설정 : false 값을 해야 form data로 인식합니다
    //beforeSend: showLoadingButton(true, '#btnSetCookie')
  })
  .fail(function(xhr, textStatus, errorThrown) { 
    delay(3000);
    display_modal('fail', textStatus, errorThrown);
  })
  .always(function(xhr, textStatus, errorThrown) { 
    display_modal('always', textStatus, errorThrown);
  });
}

/** @brief 버튼 클릭 시 처리를 위한 토글 함수 (부트스트랩 5.0 사용)
*  @date 2023/03/02
*  @return 
*  @param bToggle : true/false, bTarget : 엘리먼트 ID
**/
function showLoadingButton(bToggle, bTarget){
    // 부트스트랩 스피너 정의
    var spinner_html = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    if (bToggle){
        spinner_html = spinner_html + ' Loading...';
        $(bTarget).html(spinner_html);
        $(bTarget).css('disabled', 1);
    }
    else{
        $(bTarget).html(toggle_org_text);
        $(bTarget).css('disabled', 0);
    }
}

/** @brief modal 창 출력 처리
*  @date 2023/03/02
*  @return 
*  @param url : textStatus 제목, textData 정상 내용, thrownError 오류 메시지
**/
function display_modal(textStatus="", textData="", thrownError=""){
  $('#staticBackdropLabel').text(textStatus);
  if (isEmpty(thrownError))
    $('.modal-body').text(textData);
  else  
    $('.modal-body').text(textData + ' : ' + thrownError);
}

/** @brief modal 창 출력 완료 이벤트 처리
*  @date 2023/03/02
*  @return 
*  @param url : textStatus 제목, textData 정상 내용, thrownError 오류 메시지
*  event : close.bs.alert, closed.bs.alert
**/
$(document).on('shown.bs.modal', "#staticBackdrop", function(e){
  console.log('모달창 출력 완료 처리');
});


// { "totcount":"count", "nowpage":"count","tabledata":[{}]}
//  pSearchKey : 찾을키 이름
//  pSearchData : 비교할 키의 값
//  pRtnKeyName : 리턴할 값의 키 이름
//  => getDataFromJSON(global_customer_list_json, 'cs_idx', '40', 'cs_name');
function getTableDataFromJSON(pJSON, pKeyname, pSearchKey, pSearchKeyData, pRtnKeyName){
    var rtnValue = "";
    try {
        $.each(pJSON, function (key, Items) {
            if (key === pKeyname) { // tabledata를 찾았을 때    
              dataJSON = JSON.parse(JSON.stringify(pJSON.pKeyname));
              try {
                $.each(dataJSON, function (skey, sItems) {
                  // 겁색하기 위한 키를 찾으면
                  if (sItems[pSearchKey] === pSearchKeyData){
                      rtnValue = sItems[pRtnKeyName];
                      return;
                  }
                });
              } catch (e) {
                console.log("getTableDataFromJSON(parser) : " + e.message);
              }
              return;
            }
        });
    } catch (e) {
        console.log("getTableDataFromJSON(parser) : " + e.message);
    }
    return rtnValue;
}

// JSON 객체로 부터 키의 값을 비교 후 pRtnKeyName의 값을 리턴한다. 
function getDataFromJSON(pJSON, pSearchKey, pSearchKeyData, pRtnKeyName){
    var rtnValue = "";
    try {
        $.each(pJSON, function (skey, sItems) {
          // 겁색하기 위한 키를 찾으면
          if (sItems[pSearchKey] === pSearchKeyData){
              rtnValue = sItems[pRtnKeyName];
            return;
          }
        });
    } catch (e) {
        console.log("getDataFromJSON(parser) : " + e.message);
    }
    return rtnValue;
}

// JSON 객체로 부터 주어진 키의 값을 리턴한다.
function getKeyDataFromJSON(pJSON, pSearchKey){
    var rtnValue = "";
    try {
        $.each(pJSON, function (skey, sItems) {
            // 겁색하기 위한 키를 찾으면
            if (skey === pSearchKey){
                rtnValue = sItems;
                return;
            }
        });
    } catch (e) {
        console.log("getKeyDataFromJSON(parser) : " + e.message);
    }
    return rtnValue;
}
