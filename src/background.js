const createContextMenu = () => {
    chrome.contextMenus.create({
        id: "wallify-set-background",
        title: "Set as Wallify Background",
        contexts: ["image"]
    }, () => {
        if (chrome.runtime.lastError) {
            console.log("Context menu already exists or other error: ", chrome.runtime.lastError.message);
        }
    });
};

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "wallify-set-background") {
        const imageUrl = info.srcUrl;

        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    chrome.storage.local.set({ backgroundImage: base64data }, () => {
                        console.log("Background set from context menu");
                    });
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error("Error fetching image:", error);
            });
    }
});
