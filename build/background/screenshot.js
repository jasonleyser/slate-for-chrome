//File Upload onclick listener
document.addEventListener("DOMContentLoaded", function () {
  image_preview.src = getUrlVars()["id"];
  _handleGetSlates();

  upload_button.addEventListener("click", _handleClick);
});
//
//
//send message for upload
_handleClick = () => {
  const slate_name = slates_select.options[slates_select.selectedIndex].text;
  const slate_id = slates_select.options[slates_select.selectedIndex].value;

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var date_time = "screenshot-" + date + "-" + time;

  chrome.runtime.sendMessage(
    {
      msg: "screenshot",
      url: image_preview.src,
      slateName: slate_name,
      slateId: slate_id,
      source: date_time,
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
  for (var i = 0; i < json.slates.length; i++) {
    var slates = json.slates[i];
    var addOption = document.createElement("option");
    addOption.value = slates.id;
    addOption.innerHTML = slates.slatename;
    slates_select.appendChild(addOption);
  }
};
