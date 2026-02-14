import translations from './locales.js';

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const previewContainer = document.getElementById('previewContainer');
    const statusDiv = document.getElementById('status');
    const langSelect = document.getElementById('langSelect');
    const readableContentCheckbox = document.getElementById('readableContentCheckbox');
    const helpBtn = document.getElementById('helpBtn');

    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('src/help.html') });
        });
    }

    const brightnessInput = document.getElementById('brightnessInput');
    const contrastInput = document.getElementById('contrastInput');
    const saturationInput = document.getElementById('saturationInput');
    const blurInput = document.getElementById('blurInput');

    let currentImageBase64 = null;

    chrome.storage.local.get(['language', 'backgroundImage', 'readableContent', 'effects'], (result) => {
        if (result.language) {
            langSelect.value = result.language;
        } else {
            langSelect.value = 'en';
            chrome.storage.local.set({ language: 'en' });
        }
        updateTexts(langSelect.value);

        if (result.effects) {
            brightnessInput.value = result.effects.brightness || 100;
            contrastInput.value = result.effects.contrast || 100;
            saturationInput.value = result.effects.saturation || 100;
            blurInput.value = result.effects.blur || 0;
        }

        if (result.backgroundImage) {
            showPreview(result.backgroundImage);
            updatePreviewFilter({
                brightness: brightnessInput.value,
                contrast: contrastInput.value,
                saturation: saturationInput.value,
                blur: blurInput.value
            });
        }

        readableContentCheckbox.checked = result.readableContent === true;
    });

    readableContentCheckbox.addEventListener('change', (e) => {
        chrome.storage.local.set({ readableContent: e.target.checked });
    });

    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        chrome.storage.local.set({ language: lang });
        updateTexts(lang);
    });

    const saveEffects = () => {
        const effects = {
            brightness: brightnessInput.value,
            contrast: contrastInput.value,
            saturation: saturationInput.value,
            blur: blurInput.value
        };
        chrome.storage.local.set({ effects });
        updatePreviewFilter(effects);
    };

    [brightnessInput, contrastInput, saturationInput, blurInput].forEach(input => {
        input.addEventListener('input', saveEffects);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            currentImageBase64 = event.target.result;
            showPreview(currentImageBase64);
            updatePreviewFilter({
                brightness: brightnessInput.value,
                contrast: contrastInput.value,
                saturation: saturationInput.value,
                blur: blurInput.value
            });
        };
        reader.readAsDataURL(file);
    });

    saveBtn.addEventListener('click', () => {
        if (!currentImageBase64) {
            chrome.storage.local.get(['backgroundImage'], (res) => {
                if (res.backgroundImage && !currentImageBase64) {
                    showStatus('successMsg');
                    return;
                }
                if (!currentImageBase64 && !res.backgroundImage) {
                    showStatus('errorMsg');
                    return;
                }
                saveToStorage(currentImageBase64);
            });
            return;
        }
        saveToStorage(currentImageBase64);
    });

    resetBtn.addEventListener('click', () => {
        chrome.storage.local.remove(['backgroundImage', 'effects'], () => {
            currentImageBase64 = null;
            previewContainer.innerHTML = '<span class="placeholder-text">No image selected</span>';

            brightnessInput.value = 100;
            contrastInput.value = 100;
            saturationInput.value = 100;
            blurInput.value = 0;

            showStatus('resetMsg');
        });
    });

    function saveToStorage(base64) {
        try {
            chrome.storage.local.set({ backgroundImage: base64 }, () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    showStatus('errorMsg');
                } else {
                    showStatus('successMsg');
                }
            });
        } catch (e) {
            showStatus('errorMsg');
        }
    }

    function showPreview(src) {
        previewContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        previewContainer.appendChild(img);
    }

    function updatePreviewFilter(effects) {
        const img = previewContainer.querySelector('img');
        if (img) {
            img.style.filter = `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%) blur(${effects.blur}px)`;
        }
    }

    function updateTexts(lang) {
        const t = translations[lang] || translations['en'];
        document.getElementById('title').textContent = t.title;
        document.getElementById('uploadLabel').textContent = t.uploadLabel;
        document.getElementById('saveBtn').textContent = t.saveBtn;
        document.getElementById('resetBtn').textContent = t.resetBtn;
        document.getElementById('readableContentLabel').textContent = t.readableContent;

        document.getElementById('labelBrightness').textContent = t.brightness;
        document.getElementById('labelContrast').textContent = t.contrast;
        document.getElementById('labelSaturation').textContent = t.saturation;
        document.getElementById('labelBlur').textContent = t.blur;

        window.currentTranslations = t;
    }

    function showStatus(key) {
        const t = window.currentTranslations || translations['en'];
        statusDiv.textContent = t[key];
        statusDiv.style.opacity = '1';
        setTimeout(() => {
            statusDiv.style.opacity = '0';
        }, 2000);
    }
});
