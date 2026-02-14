function applyBackground(base64Image, readableContent, effects) {
    if (!base64Image) {
        const existingStyle = document.getElementById('wallify-style');
        if (existingStyle) existingStyle.remove();

        const existingLayer = document.getElementById('wallify-background-layer');
        if (existingLayer) existingLayer.remove();
        return;
    }

    console.log("Wallify: applyBackground called");
    if (typeof window.WallifyConfig === 'undefined') {
        console.error("Wallify: Config is undefined");
        return;
    }

    const domains = window.WallifyConfig.isAllowedDomain(window.location.hostname);
    console.log("Wallify: Domains check", domains);

    if (!domains.any) {
        return;
    }

    let style = document.getElementById('wallify-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'wallify-style';
        document.documentElement.appendChild(style);
    }

    let bgLayer = document.getElementById('wallify-background-layer');
    if (!bgLayer) {
        bgLayer = document.createElement('div');
        bgLayer.id = 'wallify-background-layer';
        document.body.appendChild(bgLayer);
    }

    if (typeof window.WallifyStyles === 'undefined') return;

    let customCss = window.WallifyStyles.getGlobalCss(base64Image, effects);

    if (domains.isGoogle) {
        customCss += window.WallifyStyles.getGoogleCss(readableContent);
    }
    else if (domains.isYouTube) {
        customCss += window.WallifyStyles.getYoutubeCss(readableContent);

        if (window.wallifyObserver) {
            window.wallifyObserver.disconnect();
        }
        if (window.wallifyInterval) {
            clearInterval(window.wallifyInterval);
        }

        const forceTransparency = () => {
            const elementsToClear = [
                'ytd-app',
                '#content',
                '#page-manager',
                '#primary',
                '#secondary',
                '#background',
                '#cinematics',
                'div#background',
                'div#cinematics'
            ];

            elementsToClear.forEach(selector => {
                const els = document.querySelectorAll(selector);
                els.forEach(el => {
                    el.style.setProperty('background', 'transparent', 'important');
                    el.style.setProperty('background-color', 'transparent', 'important');
                });
            });

            document.documentElement.style.setProperty('background-color', 'transparent', 'important');
            document.body.style.setProperty('background-color', 'transparent', 'important');
        };

        window.wallifyObserver = new MutationObserver((mutations) => {
            forceTransparency();

            if (!document.getElementById('wallify-background-layer')) {
                document.body.appendChild(bgLayer);
            }
        });

        window.wallifyObserver.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });

        window.wallifyInterval = setInterval(forceTransparency, 500);
        forceTransparency();
    }
    else if (domains.isChatGPT) {
        customCss += window.WallifyStyles.getChatGptCss();
    }
    else if (domains.isWikipedia) {
        customCss += window.WallifyStyles.getWikipediaCss(readableContent);
    }

    style.textContent = customCss;
}

chrome.storage.local.get(['backgroundImage', 'readableContent', 'effects'], (result) => {
    if (result.backgroundImage) {
        applyBackground(result.backgroundImage, result.readableContent, result.effects);
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        chrome.storage.local.get(['backgroundImage', 'readableContent', 'effects'], (result) => {
            applyBackground(result.backgroundImage, result.readableContent, result.effects);
        });
    }
});
