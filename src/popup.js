function sendActionToContent(action, data = {}) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, { action, data });
        }
    });
}
document.getElementById('startLoop').addEventListener('click', () => {
    sendActionToContent("startEnterSpam", { message: "Loop is started!" });
})

document.getElementById('stopLoop').addEventListener('click', () => {
    sendActionToContent("stopEnterSpam", { message: "Loop is stop!" });
})
