//get api key from local storage
async function getAPIKey() {
  var storage = new Promise(function (resolve, reject) {
    chrome.storage.local.get({ apiKey: true }, function (options) {
      resolve(options.apiKey);
    });
  });

  try {
    const getAPIKey = await storage;
    return getAPIKey;
  } catch (e) {
    return "Can not retrieve API Key";
  }
}
//
//
//get vars from url
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}
//
//
//convert data url to blob
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  var mime = dataurl.split(",")[0].split(":")[1].split(";")[0];

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { mime });
}
