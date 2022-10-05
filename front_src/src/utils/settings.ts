function getSetting(key: string): Promise<any> {
    // @ts-ignore
    return global.window.settings.get(key);
}
function setSetting(key: string, value: any) {
    // @ts-ignore
    global.window.settings.set(key, value);
}

export { getSetting, setSetting };
