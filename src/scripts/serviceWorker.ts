console.log("Service Worker Loaded...");
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("Service Worker Loaded...");
  console.log(tab.url);
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
