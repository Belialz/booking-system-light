let enterInterval = null;
let observer = null;
let originalTitle = document.title;

// Function to create a notification
function showNotification(title, message) {
    chrome.runtime.sendMessage({
        action: "showNotification",
        title: title,
        message: message
    });
}

// Function to start Enter spam
function startEnterSpam() {
    if (!enterInterval) {
        enterInterval = setInterval(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
            document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
            console.log('Enter pressed');
        }, 2000);
        
        showNotification("Enter Spammer", "✅ Automatic Enter input started!");
    }
}

// Function to stop Enter spam
function stopEnterSpam() {
    if (enterInterval) {
        clearInterval(enterInterval);
        enterInterval = null;
        console.log("❌ Enter spam stopped");

        document.title = "❌ Spam Stopped! " + originalTitle;
        setTimeout(() => {
            document.title = originalTitle;
        }, 5000);
        chrome.runtime.sendMessage({ action: "highlightTab" });

        showNotification("Enter Spammer", "⛔ Automatic Enter input stopped.");
    }
    if (observer) {
        observer.disconnect();
        observer = null;
        console.log("❌ UI Observer stopped");
    }
}

// Start a MutationObserver to monitor modal closure
function observeModal(modalSelector) {
    let modal = document.querySelector(modalSelector);
    if (!modal) return;

    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.removedNodes.length > 0) {
                stopEnterSpam();
            }
        });
    });

    observer.observe(modal.parentNode, { childList: true });
}

// Listen for commands from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startEnterSpam") {
        startEnterSpam();
        observeModal("#modal-id"); // Pass the modal window selector
        sendResponse({ status: "Started" });
    } 
    else if (message.action === "stopEnterSpam") {
        stopEnterSpam();
        sendResponse({ status: "Stopped" });
    }
});
