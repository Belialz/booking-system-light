let enterInterval = null;
let observer = null;
let originalTitle = document.title;

const waitForElement = (selector, callback) => {
    const observer = new MutationObserver(() => {
        const element = document.querySelector(selector)
        if (element) {
            callback(element)
        }
    })

    observer.observe(document.body, { childList: true, subtree: true })
}

waitForElement('#slotsDisplay', (targetNode) => {
    const enableButtons = () => {
        targetNode.querySelectorAll('button[disabled]').forEach((button) => {
            button.removeAttribute('disabled')
            button.classList.remove('disabled')
            button.style.pointerEvents = 'auto'
        })
    }

    enableButtons()

    const observer = new MutationObserver(enableButtons)
    observer.observe(targetNode, { childList: true, subtree: true })
})


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
        chrome.runtime.sendMessage({ action: "highlightTab" });

        showNotification("Enter Spammer", "⛔ Automatic Enter input stopped.");
    }
    if (observer) {
        observer.disconnect();
        observer = null;
        console.log("❌ UI Observer stopped");
    }
}

// Listen for commands from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startEnterSpam") {
        startEnterSpam();
        sendResponse({ status: "Started" });
    } 
    else if (message.action === "stopEnterSpam") {
        stopEnterSpam();
        sendResponse({ status: "Stopped" });
    }
});

const modal = document.querySelector('#vbsBgModal');

if (modal) {
    // Create an observer to track attribute changes
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            // Check if the 'style' attribute has changed
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                console.log('Element style changed:', modal.style.display);
                
                // You can add additional actions if the style changes to 'none'
                if (modal.style.display === 'none') {
                        chrome.runtime.sendMessage({ action: "modalClosed" });
                        stopEnterSpam();
                } else if (modal.style.display === 'block') {
                        chrome.runtime.sendMessage({ action: "modalOpened" });
                }
            }
        });
    });

    // Configure the observer to watch for attribute changes on the element
    observer.observe(modal, {
        attributes: true, // Only track attribute changes
    });
}
