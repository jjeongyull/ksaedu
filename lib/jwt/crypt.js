// JWT 변수
var g_access_token = "";
var g_refresh_token = "";

// 암복호화
//let key = CryptoJS.enc.Hex.parse("4a0c605da26c413f0304188615da9139");
//let iv =  CryptoJS.enc.Hex.parse("3c4909a6557fc2b9855351afaca45e54");  

function encodeByAES256(data){
  const cipher = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
  });
  szTemp = cipher.toString();
  szTemp = szTemp.replaceAll('=', '');
  return rawurlencode(szTemp);
}
// CryptoJS.enc.Base64
function decodeByAES256(data){
  data = rawurldecode(data);
  const cipher = CryptoJS.AES.decrypt(data, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
  });
  return cipher.toString(CryptoJS.enc.Utf8);
};