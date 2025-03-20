chrome.runtime.onInstalled.addListener(() => {
    console.log('Plugin installed!')
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showNotification") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "./icons/icon-144x144.png",
            title: message.title,
            message: message.message,
            priority: 2
        });
    }  
    if (message.action === "highlightTab") {
        chrome.action.setBadgeText({ text: "❌" });
        chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
        setTimeout(() => {
            chrome.action.setBadgeText({ text: "" });
        }, 5000);
    }
});
