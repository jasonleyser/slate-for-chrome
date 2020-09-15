function onClickHandlerImage(info, tab) {
  url = info.srcUrl;
  url = chrome.extension.getURL("build/html/image-rightclick.html?url=" + url);

  chrome.windows.create(
    { url: url, width: 232, height: 324, type: "popup" },
    function (window) {}
  );
}

function onClickHandlerScreenshot() {
  var id = 100;
  chrome.tabs.captureVisibleTab(function (screenshotUrl) {
    var viewTabUrl = chrome.extension.getURL(
      "build/html/screenshot.html?id=" + screenshotUrl
    );
    var targetId = null;

    chrome.windows.create(
      { url: viewTabUrl, width: 232, height: 282, type: "popup" },
      function (window) {}
    );
  });
}

chrome.commands.onCommand.addListener(function (command) {
  if (command === "screenshot") {
    onClickHandlerScreenshot();
  }
});

chrome.contextMenus.create({
  title: "Slate",
  id: "parent",
  contexts: ["all"],
});

chrome.contextMenus.create({
  title: "Add image",
  contexts: ["image"],
  parentId: "parent",
  id: "image",
  onclick: onClickHandlerImage,
});

chrome.contextMenus.create({
  title: "Take screenshot",
  parentId: "parent",
  contexts: ["all"],
  id: "screenshot",
  onclick: onClickHandlerScreenshot,
});
