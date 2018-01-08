chrome.contextMenus.create({
    title: "jsblock",
    contexts:["all"],
    onclick: function (content) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "fromMenu", content: content}, function(response) {

            });
        });
    }
});