window.WallifyConfig = {
    isAllowedDomain: function (hostname) {
        const isGoogle = hostname.includes('google.') && !hostname.includes('googleusercontent');
        const isYouTube = hostname.includes('youtube.com');
        const isWikipedia = hostname.includes('wikipedia.org');
        const isChatGPT = hostname.includes('chatgpt.com') || hostname.includes('openai.com');

        return {
            isGoogle,
            isYouTube,
            isWikipedia,
            isChatGPT,
            any: isGoogle || isYouTube || isWikipedia || isChatGPT
        };
    }
};
