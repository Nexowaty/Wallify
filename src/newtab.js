const bgLayer = document.getElementById('background-layer');

const applyEffects = (effects) => {
    if (window.WallifyEffects && bgLayer) {
        bgLayer.style.filter = window.WallifyEffects.getFilterString(effects);
    }
};

chrome.storage.local.get(['backgroundImage', 'effects'], (result) => {
    if (result.backgroundImage && bgLayer) {
        bgLayer.style.backgroundImage = `url('${result.backgroundImage}')`;
    } else {
        console.log('No background image found in storage.');
    }

    if (result.effects) {
        applyEffects(result.effects);
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        if (changes.backgroundImage && bgLayer) {
            bgLayer.style.backgroundImage = `url('${changes.backgroundImage.newValue}')`;
        }
        if (changes.effects) {
            applyEffects(changes.effects.newValue);
        }
    }
});
