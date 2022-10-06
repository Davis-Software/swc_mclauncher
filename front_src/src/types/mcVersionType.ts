interface McVersionType{
    id: string;
    type: "release" | "snapshot" | "old_beta" | "old_alpha";
    url?: string;
    time?: string;
    releaseTime?: string;
}
interface McVersionResponseType{
    latest: {
        release: string;
        snapshot: string;
    }
    versions: McVersionType[];
}

export type {McVersionType, McVersionResponseType};
