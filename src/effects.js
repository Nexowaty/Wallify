window.WallifyEffects = {
    defaults: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0
    },

    getFilterString: (effects) => {
        const e = effects || window.WallifyEffects.defaults;
        const b = e.brightness !== undefined ? e.brightness : 100;
        const c = e.contrast !== undefined ? e.contrast : 100;
        const s = e.saturation !== undefined ? e.saturation : 100;
        const bl = e.blur !== undefined ? e.blur : 0;

        return `brightness(${b}%) contrast(${c}%) saturate(${s}%) blur(${bl}px)`;
    }
};
