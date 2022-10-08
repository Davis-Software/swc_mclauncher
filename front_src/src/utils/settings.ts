function getSetting(key: string): Promise<any> {
    // @ts-ignore
    return global.window.settings.get(key);
}
function getSettingSync(key: string): any {
    // @ts-ignore
    return global.window.settings.getSync(key);
}
function setSetting(key: string, value: any) {
    // @ts-ignore
    global.window.settings.set(key, value);
}

async function getSettingBoolean(key: string): Promise<boolean> {
    return await getSetting(key).then((value) => value === true);
}

export { getSetting, getSettingSync, setSetting, getSettingBoolean };
