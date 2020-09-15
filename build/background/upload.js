chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  _handleFileUpload(
    request.url,
    request.slateName,
    request.slateId,
    request.source
  );
});
//
//
//Get API Key from Local Storage
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
//
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
//
//
//
function addToQueue(id, filename, source) {
  chrome.storage.local.get(function (result) {
    var allUploads = [];
    allUploads = result["queue"];
    //var allUploads = [];
    allUploads.push({ id: id, filename: filename, source: source });

    chrome.storage.local.set({ queue: allUploads }, function () {
      chrome.storage.local.get("currentUploads", function (result) {
        let number = parseInt(result.currentUploads);
        number++;
        //let number = 0;
        chrome.storage.local.set({ currentUploads: number }, function () {});
        chrome.browserAction.setBadgeBackgroundColor({ color: "#ed0f45" });
        chrome.browserAction.setBadgeText({ text: number.toString() });
      });
    });
  });
}
//
//
//
function removeFromQueue(removeId) {
  chrome.storage.local.get({ queue: [] }, function (items) {
    var queue = items.queue;
    var objIndex = queue.findIndex((obj) => obj.id === removeId);
    const updatedQueue = queue.splice(objIndex, 0);

    //const updatedQueue = queue.splice(objIndex, 1);

    chrome.storage.local.set({ queue: updatedQueue }, function () {
      chrome.storage.local.get("currentUploads", function (result) {
        let number = parseInt(result.currentUploads);

        if (number == 1 || number < 1) {
          chrome.storage.local.set({ currentUploads: 0 }, function () {});
          chrome.browserAction.setBadgeBackgroundColor({ color: "#17ce0d" });
          chrome.browserAction.setBadgeText({ text: "done" });
        } else {
          number--;
          chrome.storage.local.set({ currentUploads: number }, function () {});
          chrome.browserAction.setBadgeBackgroundColor({ color: "#ed0f45" });
          chrome.browserAction.setBadgeText({ text: number.toString() });
        }
      });
    });
  });
}
//
//
//
//Upload File
_handleFileUpload = async (imageUrl, slateName, slateId, source) => {
  const apiKey = await getAPIKey();
  const final = dataURLtoBlob(imageUrl);

  const rndId = Math.floor(Math.random() * Math.floor(100));
  var filename = source.substring(source.lastIndexOf("/") + 1);

  addToQueue(rndId, filename, imageUrl);

  const file = new File([final], source, { type: "image/png" });
  let data = new FormData();
  data.append("data", file);
  const response = await fetch(
    "https://slate.host/api/v1/upload-data/" + slateId,
    {
      method: "POST",
      headers: {
        // NOTE: your API key
        Authorization: "Basic " + apiKey,
      },
      body: data,
    }
  );

  const json = await response.json();

  removeFromQueue(rndId);
  // NOTE: the URL to your asset will be available in the JSON response.
  console.log(json);
};
