window.WallifyStyles = {
    getGlobalCss: (base64Image, effects) => {
        const filterStyle = (typeof window.WallifyEffects !== 'undefined')
            ? window.WallifyEffects.getFilterString(effects)
            : 'brightness(100%) contrast(100%) saturate(100%) blur(0px)';

        return `
        html, body {
            background-color: transparent !important;
            background: transparent !important;
        }
        
        #wallify-background-layer {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: -2147483647 !important;
            background-image: url('${base64Image}') !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center center !important;
            filter: ${filterStyle} !important;
            pointer-events: none !important;
        }
    `;
    },

    getGoogleCss: (readable) => `
        .L3eUgb { background: transparent !important; }
        
        ${readable ?
            `#rcnt { background: rgba(255, 255, 255, 0.9) !important; border-radius: 16px; margin-top: 10px; padding: 20px; }
             .sfbg, .sfbgg, .appbar { background: transparent !important; }
             @media (prefers-color-scheme: dark) {
                 #rcnt { background: rgba(32, 33, 36, 0.9) !important; }
             }`
            :
            `#rcnt { background: transparent !important; margin-top: 10px; padding: 20px; }
             .sfbg, .sfbgg, .appbar { background: transparent !important; }
             @media (prefers-color-scheme: dark) {
                 #rcnt { background: transparent !important; }
             }`
        }
    `,

    getYoutubeCss: (readable) => {
        if (readable) {
            return `
                ytd-app { background: transparent !important; }
                #content { background: transparent !important; }
                
                #masthead-container { background: rgba(255, 255, 255, 0.95) !important; }
                #guide-content { background: rgba(255, 255, 255, 0.95) !important; }
                #columns { background: rgba(255, 255, 255, 0.9) !important; margin: 0 10px; border-radius: 12px; }
                #primary { background: transparent !important; }
                #secondary { background: transparent !important; }
                #chips-wrapper { background: rgba(255, 255, 255, 0.95) !important; }

                html[dark] #masthead-container, html[dark] #guide-content { background: rgba(15, 15, 15, 0.95) !important; }
                html[dark] #columns { background: rgba(0, 0, 0, 0.8) !important; }
                html[dark] #chips-wrapper { background: rgba(15, 15, 15, 0.95) !important; }
            `;
        } else {
            return `
                ytd-app { background: transparent !important; }
                #content { background: transparent !important; }
                #masthead-container { background: transparent !important; box-shadow: none !important; }
                #guide-content { background: transparent !important; }
                #columns { background: transparent !important; margin: 0 10px; }
                #primary { background: transparent !important; }
                #secondary { background: transparent !important; }
                #chips-wrapper { background: transparent !important; }
                html[dark] #masthead-container, html[dark] #guide-content { background: transparent !important; }
                html[dark] #columns { background: transparent !important; }
                html[dark] #chips-wrapper { background: transparent !important; }
            `;
        }
    },

    getChatGptCss: () => `
        main { background-color: transparent !important; }
        .dark main { background-color: transparent !important; }
        .flex-shrink-0 { background-color: rgba(0, 0, 0, 0.4) !important; }
    `,

    getWikipediaCss: (readable) => {
        if (readable) {
            return `
                .mw-page-container { background-color: transparent !important; }
                .mw-workspace-container { background-color: transparent !important; }
                #content { 
                    background-color: rgba(255, 255, 255, 0.95) !important; 
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
            `;
        } else {
            return `
                .mw-page-container { background-color: transparent !important; }
                .mw-workspace-container { background-color: transparent !important; }
                #content { 
                    background-color: transparent !important; 
                    border: none !important;
                    box-shadow: none !important;
                }
                .vector-header-container { background-color: transparent !important; }
                .vector-sticky-header { background-color: transparent !important; }
            `;
        }
    }
};
