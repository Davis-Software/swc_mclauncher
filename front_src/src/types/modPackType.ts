interface ModPackType{
    name: string;
    version: string;
    mcVersion: string;
    "bg-picture": string;
    id: string;
    creator: string;
    desc: string;
    icon: string;
    override: boolean;
    "override-options": any[];
    type: string;
}

export type { ModPackType };
