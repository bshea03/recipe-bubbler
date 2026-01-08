// Handles the icon click event and sends a message to the active tab's content script to toggle the popover.
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: "togglePopover" });
  }
});
