interface UpdateInfoFileType{
    url: string;
    sha512: string;
    size: number;
}

interface UpdateInfoType{
    tag: string;
    version: string;
    files: UpdateInfoFileType[];
    path: string;
    sha512: string;
    releaseDate: string;
    releaseName: string;
    releaseNotes: string;
}

export type {UpdateInfoType, UpdateInfoFileType};
