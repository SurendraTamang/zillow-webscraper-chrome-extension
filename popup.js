document.getElementById('startScraping').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab) {
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ['content.js']
      });
    }
  });
});