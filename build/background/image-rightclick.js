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
//Convert image to base64
function convertImgToBase64URL(url, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    var canvas = document.createElement("CANVAS"),
      ctx = canvas.getContext("2d"),
      dataURL;
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
    canvas = null;
    document.getElementById("imagePreview").src = dataURL;
  };
  img.src = url;
}
//
//
//File Upload onclick listener
document.addEventListener("DOMContentLoaded", function () {
  image = getUrlVars()["url"];
  document.getElementById("imagePreview").src = image;

  convertImgToBase64URL(image, function (base64Img) {});
  _handleGetSlates();

  document
    .getElementById("uploadButton")
    .addEventListener("click", _handleClick);
});

//handle upload after submit
_handleClick = () => {
  const image = document.getElementById("imagePreview").src;
  const imageSource = getUrlVars()["url"];

  const slateOptions = document.getElementById("slates");
  const slateSelectedID =
    slateOptions.options[slateOptions.selectedIndex].value;
  const slateSelectedName =
    slateOptions.options[slateOptions.selectedIndex].text;

  chrome.runtime.sendMessage(
    {
      msg: "image",
      url: image,
      slateName: slateSelectedName,
      slateId: slateSelectedID,
      source: imageSource,
    },
    (response) => {
      console.log(response);
    }
  );
  window.close();
};

//Getting all user Slates
_handleGetSlates = async () => {
  const apiKey = await getAPIKey();

  const response = await fetch("https://slate.host/api/v1/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
