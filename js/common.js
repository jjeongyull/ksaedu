/**
 * 공통 인터페이스 함수
 * 화살표 함수 시 this : global(window), e.target => this 
 * @copyright : Greenpot Co., Ltd.
*/

/**
 * loading 화면 토글
 * @author : 신종훈
 * @date : 2023.12.07
 */
function showloading(){
  $('#div_loading').toggleClass('hidden');
}

/**
 * iziModal 종료 확장 함수
 * @author : 신종훈
 * @date : 2023.12.07
 * @usage : $(target).hide_popup()
 */
$.fn.hide_popup = function() {
  this.on('click', function(){
    let modalid = getID('modal_popup_1');
    $(modalid).iziModal('close');
  });
}

/**
 * keydown 확장 함수 
 * @param {Object} triggerid 
 * @author : 신종훈
 * @date : 2023.12.07
 * @usage : $(target).hide_popup()
 */
$.fn.EnterKeyDown = function (triggerid) {
  this.on('keydown', function(event){
    let keyCode = (event.keyCode ? event.keyCode : event.which);   
    if (keyCode === 13) {
        $(triggerid).trigger('click');
    }
  })
}

/**
 * 넘버콤마 확장 함수 
 * @param {Object} triggerid 
 * @author : 신종훈
 * @date : 2023.12.07
 * @usage : $(target).hide_popup()
 */
$.fn.numberWithCommasFn = function () {
  this.on('keyup', function(event){
    var x;
    x = this.value;
    x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
    x = x.replace(/,/g,'');          // ,값 공백처리
    $(this).val(x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 정규식을 이용해서 3자리 마다 , 추가 
  })
}

/**
 * 팝업창 출력 (izModal)
 * @author : 신종훈
 * @date : 2023.12.07
 * @param {Object} pObj 
    contentHtml = content html file
    title : 타이틀바에 출력될 제목
    focusid : 팝업 이후 포커스를 줄 object id
    orgfocusid : 팝업 창이 종료 후 포커스를 부여할 object id
    showfs : fullscreen 버튼 출력 여부 (기본값 : false)
    showclose : 팝업 종료 버튼 출력 (기본값 : false)
    icon : icommon에 정의된 아이콘 파일(https://icomoon.io/app/#/select/font) 또는 fontawome
*/

function showPopup(pObj){
  let modalid = getID('modal_popup_1');
  let contentid = getID('popup_content_1');
  $(modalid).iziModal({
    title : pObj.title,
    subtitle : pObj.subtitle,
    icon : pObj.icon,
    width : pObj.width,   
    fullscreen : pObj.showfs,
    closeButton : pObj.showclose,
    transitionIn: 'comingIn',
    transitionOut: 'comingOut',
    onClosed: function(){
      $(modalid).iziModal('destroy');
      if (!isEmpty(pObj.orgfocusid))
        $(pObj.orgfocusid).select();
    },
    onOpened: function(){
      if (!isEmpty(pObj.focusid))
        $(pObj.focusid).select();
    }
  });

  $(contentid).html(pObj.contentHtml);
  $(modalid).iziModal('setWidth', pObj.width);
  $(modalid).iziModal('open');

  // 이미 모달 인스턴스가 생성되었을 경우에는 포커스를 바로 준다.
  if (!isEmpty(modalid)){
    if (!isEmpty(pObj.focusid))
      $(pObj.focusid).select();
  }
}

/**
 * 알림 메시지 출력 (izModal)
 * @author : 신종훈
 * @date : 2023.12.07
 * @param {Object} pObj 
    title : 제목, message : 출력할 메시지 
    btype : 출력 형식 (오류(1), 알람(0))
    closetime : 자동 닫힘 여부 (초단위)
    focusid : 알림창 종료 시 포커스를 보낼 Object id
    icon : icommon에 정의된 아이콘 파일(https://icomoon.io/app/#/select/font) 또는 fontawome
*/
async function showiziModal(msgboxobj, focusid=''){
  /* 
    <i class="fa-solid fa-circle-info"></i>
    <i class="fa-solid fa-question"></i>
    <i class="fa-solid fa-xmark"></i>
  */
  let modalid = $('#modal_status');
  if (isEmpty(modalid)){
    alert('Invalid modal element id(id : modal_status)');
    return false;
  }

  if (isEmpty(msgboxobj.icon)){
    msgboxobj.icon = "fa-solid fa-circle-info";
  }

  $(modalid).iziModal({
    title: msgboxobj.title,
    subtitle: "",
    icon: msgboxobj.icon,
    width: msgboxobj.width,
    timeoutProgressbar: false,
    transitionIn: 'comingIn',
    transitionOut: 'comingOut',
    pauseOnHover: true,
    onClosed: function(){
      modalid.iziModal('destroy');
      if ($(focusid).length > 0){
        $(focusid).select();
      }
      if (!isEmpty(msgboxobj.link)){
        gotoPage(msgboxobj.link);
      }
    }
  });
  // iziModal.js 내에 변경 함수 있음 :아이콘 변경 -> setIcon 등등
  if (msgboxobj.closetime == no_delay)
    $(modalid).iziModal('setTimeout', false);
  else
    $(modalid).iziModal('setTimeout', msgboxobj.closetime);

  // 파란 : #5b68bd    
  if (msgboxobj.type == t_error)     // 빨간
    $(modalid).iziModal('setHeaderColor', '#BD5B5B');
  else{               // 녹색
    $(modalid).iziModal('setHeaderColor', '#1aa163');
  }

  // 신종훈 수정 : 최종 배포 시 메시지 코드 및 desc 문구 제거 */
  // let msgContent = '<br>code : ' + msgboxobj.status;
  // msgContent = msgContent + '<br>desc : ' + msgboxobj.message;
  let msgContent = '<br>' + msgboxobj.message;
  $(modalid).iziModal('setSubtitle', msgContent);
  $(modalid).iziModal('open');
}

/* confirm : https://izitoast.marcelodolza.com/*/
/*
iziToast.question({
  timeout: 20000,
  close: false,
  overlay: true,
  displayMode: 'once',
  id: 'question',
  zindex: 999,
  title: 'Hey',
  message: 'Are you sure about that?',
  position: 'center',
  buttons: [
      ['<button><b>YES</b></button>', function (instance, toast) {

          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

      }, true],
      ['<button>NO</button>', function (instance, toast) {

          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

      }],
  ],
  onClosing: function(instance, toast, closedBy){
      console.info('Closing | closedBy: ' + closedBy);
  },
  onClosed: function(instance, toast, closedBy){
      console.info('Closed | closedBy: ' + closedBy);
  }
});
*/

/**
 * 부트스트랩을 이용한 메시지 출력 - 예 / 아니오 처리 
 * @author : 신종훈
 * @date : 2023.12.07
 * @param {Object} options 
*/
function greenModal (options) {

	let deferredObject = $.Deferred();
	let defaults = {
		type: "alert", //alert, prompt,confirm 
		modalSize: 'modal-sm', //modal-sm, modal-lg
		okButtonText: 'Ok',
		cancelButtonText: 'Cancel',
		yesButtonText: 'Yes',
		noButtonText: 'No',
		headerText: 'Attention',
		messageText: 'Message',
		alertType: 'default', //default, primary, success, info, warning, danger
		inputFieldType: 'text', //could ask for number,email,etc
	}
	$.extend(defaults, options);
  
	let _show = function(){
		let headClass = "navbar-default";
		switch (defaults.alertType) {
			case "primary":
				headClass = "alert-primary";
				break;
			case "success":
				headClass = "alert-success";
				break;
			case "info":
				headClass = "alert-info";
				break;
			case "warning":
				headClass = "alert-warning";
				break;
			case "danger":
				headClass = "alert-danger";
				break;
        }
		$('BODY').append(
			'<div id="greenAlerts" class="modal fade">' +
			'<div class="modal-dialog" class="' + defaults.modalSize + '">' +
			'<div class="modal-content">' +
			'<div id="greenAlerts-header" class="modal-header ' + headClass + '">' +
			'<h4 id="greenAlerts-title" class="modal-title" data-feather="user">Modal title</h4>' +
      '<button id="btn_confirm_close" type="button" class="close" data-dismiss="modal">'+
      '<span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' +      
			'</div>' +
			'<div id="greenAlerts-body" class="modal-body">' +
			'<div id="greenAlerts-message" ></div>' +
			'</div>' +
			'<div id="greenAlerts-footer" class="modal-footer">' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>');

		$('.modal-header').css({
			'padding': '15px 15px',
			'-webkit-border-top-left-radius': '5px',
			'-webkit-border-top-right-radius': '5px',
			'-moz-border-radius-topleft': '5px',
			'-moz-border-radius-topright': '5px',
			'border-top-left-radius': '5px',
			'border-top-right-radius': '5px'
		});
    
		$('#greenAlerts-title').text(defaults.headerText);
		$('#greenAlerts-message').html(defaults.messageText);

		let keyb = "false", backd = "static";
		let calbackParam = "";
		switch (defaults.type) {
			case 'alert':
				keyb = "true";
				backd = "true";
				$('#greenAlerts-footer').html(
          '<button class="btn btn-' + defaults.alertType + '">' +defaults.okButtonText +
          '</button>').on('click', ".btn", function () {
					calbackParam = true;
					$('#greenAlerts').modal('hide');
				});
				break;
			case 'confirm':
        keyb = "true";
				backd = "true";
				var btnhtml = '<button id="btn_green_ok" class="basic-btn-2 text-sm btn-default-bg-color text-white py-1 px-3">' + defaults.yesButtonText + '</button>';
				if (defaults.noButtonText && defaults.noButtonText.length > 0) {
					btnhtml += '<button id="btn_green_close" class="basic-btn-2 text-sm btn-default-bg-color text-white py-1 px-3">' + defaults.noButtonText + '</button>';
				}
				$('#greenAlerts-footer').html(btnhtml).on('click', 'button', function (e) {
						if (e.target.id === 'btn_green_ok') {
							calbackParam = true;
							$('#greenAlerts').modal('hide');
						} else if (e.target.id === 'btn_green_close') {
							calbackParam = false;
							$('#greenAlerts').modal('hide');
						}
					});
				break;
			case 'prompt':
        keyb = "true";
				backd = "true";
				$('#greenAlerts-message').html(defaults.messageText + 
          '<br /><br /><div class="form-group"><input type="' + 
          defaults.inputFieldType + '" class="form-control" id="prompt" /></div>');
				$('#greenAlerts-footer').html('<button class="btn btn-primary">' + 
        defaults.okButtonText + '</button>').on('click', ".btn", function () {
					calbackParam = $('#prompt').val();
					$('#greenAlerts').modal('hide');
				});
				break;
		}
   
		$('#greenAlerts').modal({ 
          show: false, 
          backdrop: backd, 
          keyboard: true 
        }).on('hidden.bs.modal', function (e) {
			$('#greenAlerts').remove();
			deferredObject.resolve(calbackParam);
		}).on('shown.bs.modal', function (e) {
			if ($('#prompt').length > 0) {
				$('#prompt').focus();
			}
    }).on('show.bs.modal', function(){
      //
    }).modal('show')
	}
  _show();  
  return deferredObject.promise();    
}

/**
 * html을 이미지로 변경 (dom-to-image 라이브러리)
 * @param {Object} targetid 이미지로 변환할 Object ID
*/
// html을 이미지로 변경 (dom-to-image 라이브러리)
async function convertToPng(targetid) {
  return new Promise(function(resolve, reject){ // promise 정의       
    domtoimage.toPng(targetid)
    .then(function(dataUrl) {
      resolve(dataUrl);
    })
    .catch(function(error) {
      reject(error);
    });
  });
}

/**
 * Objdct ID 하위요소를 이미지 데이터로 리턴 
 * @author : 신종훈
 * @date : 2023.12.07
 * @param {Object} targetid 이미지로 변환할 Object ID
*/
async function htmlToImage(targetid){
  // option
  let scale = 0.5;
  const styleProp = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: targetid.clientWidth + 'px',
    height: targetid.clientHeight + 'px'
  };

  let imageData = new Image();
  // loading 메시지 처리
  imageData.src = await convertToPng(targetid, {
    width: targetid.clientWidth * scale,
    height: targetid.clientHeight * scale,
    style: styleProp,
  });
  return imageData;
}


/* 주어진 JSON으로 부터 radio를 그린다. (라디오는 name은 같고 id는 구분되어야 한다. (동시 선택 불가))
*  @date 2023/03/02
*  @return 
*  @param  pJSON : 원본 데이터 (JSON)  : [{"idx" : "1", "data" : "값1"}, {"idx" : "2", "data" : "값2"}] 
          radio에서 idx는 value가 되며 data는 text가 된다.
          pTarget : checkbox를 그리기 위한 타겟 ID (#aaaa)
          selectedvalue : 선택된 값이 있을 경우 체크, 
          valueKeyName : 
          dataKeyName : 
          bVertial : 수직으로 그릴 경우 true
          pID : radio를 구분하기 위한 ID값 (생략할 경우 타임스탬프로 지정)
          expetedValue : 출력하지 않을 값
          pclass : 클래스 구분 시 prefix
*/
function draw_radio_data(pJSON, pTarget, selectedvalue, valueKeyName, dataKeyName, dataKeyName2="",
  bVertial=false, pID="", expetedValue="-1", pclass="radiolass"){
var tmpHTML = "";
if (isEmpty(pID))
{
  const time = Date.now();
  pID = String(time);
}

var tmpTag = "";
if (bVertial){
  tmpTag = '<br>';
}

try{
  selectedvalue = String(selectedvalue);
  var tmp = selectedvalue.split('|');
  var tmpIdx = 1;
  $.each(pJSON, function (key, Items) {
    let data2 = Items[dataKeyName2];
    if(isEmpty(data2)){
      data2 = "";
    }else{
      data2 = `(${data2})`;
    }
    var tmpName = "radio_" + pID;
    var tmpID = tmpName + "_" + String(tmpIdx);
    for (var i=0; i<tmp.length; i++){
      if (tmp[i] === Items[valueKeyName]){
        tmpHTML = tmpHTML + "<label class='form-check-label' for='" + tmpID + "'> ";
        tmpHTML = tmpHTML + "<input type='radio' id='" + tmpID + "'";
        tmpHTML = tmpHTML + " class='form-check-input " + pclass + "' ";
        tmpHTML = tmpHTML + " name='" + tmpName + "' value='" + Items[valueKeyName] + "' checked> ";
        tmpHTML = tmpHTML + Items[dataKeyName] + data2 +"</label>" + tmpTag;
      }
      else{
        if (Items[valueKeyName] != expetedValue){
          tmpHTML = tmpHTML + "<label class='form-check-label' for='" + tmpID + "'> ";
          tmpHTML = tmpHTML + "<input type='radio' id='" + tmpID + "'";
          tmpHTML = tmpHTML + " class='form-check-input " + pclass + "' ";
          if (Items[dataKeyName] == "none")
            tmpHTML = tmpHTML + " name='" + tmpName + "' value='" + Items[valueKeyName] + "' checked> ";
          else
            tmpHTML = tmpHTML + " name='" + tmpName + "' value='" + Items[valueKeyName] + "'> ";
          tmpHTML = tmpHTML + Items[dataKeyName] + data2 + "</label>" + tmpTag;
        }
      }
    }
    tmpIdx = tmpIdx + 1;
  });
  $(pTarget).html(tmpHTML);
}
catch(e){
  console.log(e.message);
}
}