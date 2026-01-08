import React from "react";
import ReactDOM from "react-dom/client";
import type { Recipe } from "schema-dts";
import App from "../src/App";
import contentCss from "../src/index.css?inline";
import { fetchRecipes } from "./helpers/fetch";

// Auto-import all component styles
const componentStyles = import.meta.glob<string>(
  "../src/components/**/styles.css?inline",
  {
    eager: true,
    import: "default",
  }
);

let cachedRecipes: Recipe[] = [];

// Load recipes and cache them
const loadRecipes = async () => {
  const recipes = await fetchRecipes();
  if (recipes) {
    cachedRecipes = recipes;
    // Optionally notify the app of updates
    chrome.runtime.sendMessage({ action: "recipesUpdated", recipes });
  }
};

// Inject shadow DOM CSS
export function injectStyles(shadowRoot: ShadowRoot, css: string) {
  const style = document.createElement("style");
  style.textContent = css;
  shadowRoot.appendChild(style);
}

// Create and append popover to the DOM
const createPopover = () => {
  popoverElement = document.createElement("div");
  popoverElement.id = "recipe-popover-root";

  // Apply host styles directly via JavaScript (cannot be styled from inside shadow DOM)
  Object.assign(popoverElement.style, {
    top: "30px",
    right: "50px",
    zIndex: "10000",
    position: "fixed",
  });

  document.body.appendChild(popoverElement);

  const shadowRoot = popoverElement.attachShadow({ mode: "open" });

  // Combine all CSS (Tailwind + components)
  const allCss = [contentCss, ...Object.values(componentStyles)].join("\n");

  // Inject as single <style> tag
  injectStyles(shadowRoot, allCss);

  // Render React app
  popoverRoot = ReactDOM.createRoot(shadowRoot);
  popoverRoot.render(React.createElement(App, { recipes: cachedRecipes }));
};

// On close
const removePopover = () => {
  popoverElement?.remove();
  popoverElement = null;
  popoverRoot?.unmount();
  popoverRoot = null;
};

const getRecipeCallback = () => {
  if (cachedRecipes.length === 0) {
    return null; // No recipes, don't open popover
  }
  createPopover();
};

// Initialize when DOM is ready
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    loadRecipes().then(getRecipeCallback)
  );
} else {
  loadRecipes().then(getRecipeCallback);
}

let popoverRoot: ReactDOM.Root | null = null;
let popoverElement: HTMLElement | null = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getRecipes") {
    sendResponse({ recipes: cachedRecipes });
  } else if (
    request.action === "closePopover" ||
    request.action === "togglePopover"
  ) {
    if (popoverElement || request.action === "closePopover") {
      // Remove popover if it exists
      removePopover();
    } else {
      createPopover();
    }
  }
});
