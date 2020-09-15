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
//Load uploads queue
function loadQueue() {
  chrome.storage.local.get(["queue"], function (result) {
    var queue = JSON.stringify(result["queue"]);
    //var queue = [];
    if (queue == null || queue == "undefined" || queue.length == 2) {
      document.getElementById("queueMessage").style.display = "block";
      const messages = [
        "<span style='color:#63b182'>Alt+S</span> to take a screenshot.",
        "<span style='color:#63b182'>Right click</span> on any image to upload.",
        "<span style='color:#63b182'>Right click</span> to screenshot.",
      ];

      var random = messages[Math.floor(Math.random() * messages.length)];

      document.getElementById("queueMessage").innerHTML = random;

      chrome.browserAction.setBadgeText({ text: "" });
    } else {
      document.getElementById("queueMessage").style.display = "none";
      document.getElementById("queueMessageHelp").style.display = "none";
      document.getElementById("rowQueue").style.display = "flex";
      result["queue"].forEach(function (item, index) {
        var main = document.getElementById("rowQueue");
        var queue = document.createElement("div");
        queue.className = "col-4";

        var img = document.createElement("img");
        img.id = "queueImage-" + item.id;
        img.src = item.source;
        img.style.width = "100%";
        img.style.padding = "2px 2px 2px 2px";
        img.style.borderRadius = "2px";

        queue.appendChild(img);
        main.appendChild(queue);
      });
    }
  });
}
//
//
//
//Save Settings
function saveSettings() {
  apiKeyValue = document.getElementById("apiKeyInput").value;

  if (!apiKeyValue) {
    document.getElementById("apiKeyInput").style =
      "border:2px solid #e45757; font-size:12px";
  } else {
    array = [];
    uploads = "0";
    chrome.storage.local.set({ currentUploads: uploads }, function () {});
    chrome.storage.local.set({ queue: array }, function () {});
    chrome.storage.local.set({ apiKey: apiKeyValue }, function () {});
    document.getElementById("pageSettings").style.display = "none";
    document.getElementById("pageButtons").style.display = "block";
    document.getElementById("homeDangerMessage").style.display = "none";
    document.getElementById("homeSuccessMessage").style.display = "block";
    document.getElementById("homeSuccessMessage").innerHTML = "Settings saved!";
  }
}

function getApiData() {
  chrome.storage.local.get("apiKey", function (data) {
    if (data.apiKey == null || data.apiKey == "") {
      document.getElementById("homeDangerMessage").style.display = "block";
      document.getElementById("homeDangerMessage").innerHTML = "Add your API >";
      document.getElementById("settingsTitle").innerHTML = "Welcome to Slate!";
    } else {
      document.getElementById("homeDangerMessage").style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadQueue();
  getApiData();
  //Signup Button Link
  document
    .getElementById("queueMessageHelp")
    .addEventListener("click", function () {
      var newURL = "https://slate.host/jason/slate-chrome";
      chrome.tabs.create({ url: newURL });
    });
  //Show home page on help page logo click
  document
    .getElementById("settingsHomeLink")
    .addEventListener("click", function () {
      document.getElementById("pageButtons").style.display = "block";
      document.getElementById("pageSettings").style.display = "none";
    });
  //Show Settings page on settings icon click
  document
    .getElementById("setttingIcon")
    .addEventListener("click", function () {
      document.getElementById("pageButtons").style.display = "none";
      document.getElementById("pageSettings").style.display = "inline";
    });
  //Show Settings page on no api error message click
  document
    .getElementById("homeDangerMessage")
    .addEventListener("click", function () {
      document.getElementById("pageButtons").style.display = "none";
      document.getElementById("pageSettings").style.display = "inline";
    });
  //New API Link
  document
    .getElementById("settingTopLinkNewApi")
    .addEventListener("click", function () {
      var newURL = "https://slate.host/_";
      chrome.tabs.create({ url: newURL });
    });

  //Populate API key input with storage settings
  chrome.storage.local.get("apiKey", function (data) {
    if (data.apiKey !== undefined) {
      document.getElementById("apiKeyInput").value = data.apiKey;
    }
  });
  //Save settings on button click
  document
    .getElementById("saveSettings")
    .addEventListener("click", saveSettings);
});
