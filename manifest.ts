import fs from "fs";
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Cattlelog for Chrome",
  description: "An easier way to pick the right classes and export them to your calendar",
  version: packageJson.version,
  icons: {
    "16": "icon128.png",
    "32": "icon128.png", 
    "48": "icon128.png",
    "128": "icon128.png",
  },
  action: {
    default_popup: "src/popup/index.html",
    default_icon: {
      "16": "icon128.png",
      "32": "icon128.png",
      "48": "icon128.png",
      "128": "icon128.png"
    }
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  }
};

export default manifest;
