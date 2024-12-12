chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.tabInfo) {
      console.log("Tab Information:");
      console.log("URL:", request.tabInfo.url);
      console.log("Title:", request.tabInfo.title);
      console.log("Scroll Position:", request.tabInfo.scrollPosition);
    }
  });