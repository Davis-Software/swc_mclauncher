async function getProfileInfo(profileUUID: string): Promise<any> {
    let resp: any = await (await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${profileUUID}`)).json();
    return JSON.parse(atob(resp.properties[0].value))
}

export default getProfileInfo;
