//Load uploads queue
function loadQueue() {
  chrome.storage.local.get(["queue"], function (result) {
    var queue = JSON.stringify(result["queue"]);
    //var queue = [];
    if (queue == null || queue == "undefined" || queue.length == 2) {
      message_queue.style.display = "block";
      const messages = [
        "<span style='color:#63b182'>Alt+S</span> to take a screenshot.",
        "<span style='color:#63b182'>Right click</span> on any image to upload.",
        "<span style='color:#63b182'>Right click</span> to screenshot.",
      ];
      var random_message =
        messages[Math.floor(Math.random() * messages.length)];
      //show random message in queue
      message_queue.innerHTML = random_message;

      chrome.browserAction.setBadgeText({ text: "" });
    } else {
      message_queue.style.display = "none";
      message_help.style.display = "none";
      queue_main.style.display = "flex";
      result["queue"].forEach(function (item, index) {
        var queue = document.createElement("div");
        queue.className = "col-4";

        var img = document.createElement("img");
        img.id = "queueImage-" + item.id;
        img.src = item.source;
        img.style.cssText =
          "width: 100%; padding: 2px 2px 2px 2px; border-radius:2px";

        queue.appendChild(img);
        queue_main.appendChild(queue);
      });
    }
  });
}

//
//
//
//Save Settings
function saveSettings() {
  if (!apikey_input.value) {
    apikey_input.style = "border:2px solid #e45757; font-size:12px";
  } else {
    //create storage with empty upload array and 0 in queue
    var set_array = [];
    var set_uploads = "0";
    chrome.storage.local.set({ currentUploads: set_uploads }, function () {});
    chrome.storage.local.set({ queue: set_array }, function () {});
    chrome.storage.local.set({ apiKey: apikey_input.value }, function () {});
    //
    page_settings.style.display = "none";
    page_home.style.display = "block";
    message_danger.style.display = "none";
    message_success.style.display = "block";
    message_success.innerHTML = "Settings saved!";
  }
}

function getApiData() {
  chrome.storage.local.get("apiKey", function (data) {
    if (data.apiKey == null || data.apiKey == "") {
      message_danger.style.display = "block";
      message_danger.innerHTML = "Add your API >";
      settings_title.innerHTML = "Welcome to Slate!";
    } else {
      message_danger.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  //load queue and get api data onload
  loadQueue();
  getApiData();

  //help button link onclick
  message_help.addEventListener("click", function () {
    var open_url = "https://slate.host/jason/slate-chrome";
    chrome.tabs.create({ url: open_url });
  });

  //show home page on help page logo click
  settings_home.addEventListener("click", function () {
    page_home.style.display = "block";
    page_settings.style.display = "none";
  });

  //show settings page on icon click
  settings_icon.addEventListener("click", function () {
    page_home.style.display = "none";
    page_settings.style.display = "inline";
  });
  //show settings page api error message click
  message_danger.addEventListener("click", function () {
    page_home.style.display = "none";
    page_settings.style.display = "inline";
  });
  //new api link onclick
  settings_newapi.addEventListener("click", function () {
    var open_url = "https://slate.host/_";
    chrome.tabs.create({ url: open_url });
  });

  //populate api key input
  chrome.storage.local.get("apiKey", function (data) {
    if (data.apiKey !== undefined) {
      apikey_input.value = data.apiKey;
    }
  });
  //save settings on button click
  settings_save.addEventListener("click", saveSettings);
});
