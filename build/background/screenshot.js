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
//File Upload onclick listener
document.addEventListener("DOMContentLoaded", function () {
  image = getUrlVars()["id"];
  document.getElementById("imagePreview").src = image;

  //convertImgToBase64URL(image, function (base64Img) {});
  _handleGetSlates();

  document
    .getElementById("uploadButton")
    .addEventListener("click", _handleClick);
});
//
//
//Convert URL image to blob
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { mime });
}
//
//
//Hi
_handleClick = () => {
  const slateOptions = document.getElementById("slates");
  const slateSelectedID =
    slateOptions.options[slateOptions.selectedIndex].value;
  const slateSelectedName =
    slateOptions.options[slateOptions.selectedIndex].text;

  var image = document.getElementById("imagePreview").src;

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = "screenshot-" + date + "-" + time;

  chrome.runtime.sendMessage(
    {
      msg: "screenshot",
      url: image,
      slateName: slateSelectedName,
      slateId: slateSelectedID,
      source: dateTime,
    },
    (response) => {
      console.log(response);
    }
  );
  window.close();
};
//
//
//Getting all user Slates
_handleGetSlates = async () => {
  const apiKey = await getAPIKey();

  const response = await fetch("https://slate.host/api/v1/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // NOTE: your API key
      Authorization: "Basic " + apiKey,
    },
    body: JSON.stringify({
      data: {
        // NOTE: optional, if you want your private slates too.
        private: true,
      },
    }),
  });
  const json = await response.json();
  console.log(json);
  for (var i = 0; i < json.slates.length; i++) {
    var slates = json.slates[i];
    var select = document.getElementById("slates");
    var addOption = document.createElement("option");
    addOption.value = slates.id;
    addOption.innerHTML = slates.slatename;
    select.appendChild(addOption);
  }
};
