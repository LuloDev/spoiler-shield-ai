chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    tab.url?.includes("youtube.com") &&
    changeInfo.status === "complete" &&
    tab.id
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"],
    });
  }
});
