export const buildCustomOptions = (options: Record<string, any>): Record<string, any> => {
    if (options?.hideLines)
        return {
            "glyphMargin": false,
            "folding": false,
            "lineNumbers": "off",
            "lineDecorationsWidth": 0,
            "lineNumbersMinChars": 0,
            minimap: {
                enabled: options?.minimap,
            },
            automaticLayout: true,
        };
    return {};
};

export const buildStyle = (options: Record<string, any>): Record<string, any> => {
    const defaultOptions = {
        height: options?.style?.height || "10em",
        width: options?.style?.width || "100%",
    };
    if (!options?.style) return defaultOptions;
    return { ...options.style, ...defaultOptions };
};
