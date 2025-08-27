chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveCourses") {
        chrome.storage.local.set({
            courses: message.courses,
            academicTerm: message.academicTerm
        });
    }

    if (message.action === "getCourses") {
        chrome.storage.local.get(["courses", "academicTerm"], result => {
            sendResponse({
                courses: result.courses || [],
                academicTerm: result.academicTerm || null
            });
        });
        return true;
    }

    if (message.action === "saveFilterOption") {
        chrome.storage.local.set({ filterOption: message.filterOption });
    }

    if (message.action === "getFilterOption") {
        chrome.storage.local.get("filterOption", result => {
            sendResponse(result.filterOption || "registered");
        });
        return true;
    }
});