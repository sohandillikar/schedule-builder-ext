const manifest = {
  manifest_version: 3,
  name: "Cattlelog for Chrome",
  description: "An easier way to pick the right classes and export them to your calendar",
  version: "1.0.0",
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
