export function dispatchClosePopover() {
  window.postMessage({ source: "recipe-modal", action: "closePopover" }, "*");
}

export function dispatchTogglePopover() {
  window.postMessage({ source: "recipe-modal", action: "togglePopover" }, "*");
}
