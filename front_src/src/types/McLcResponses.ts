interface McLcProgress {
    type: "natives" | "classes" | "assets" | "forge" | "classes-custom";
    task: number;
    total: number;
}
interface McLcDownloadStatus {
    name: string;
    current: number;
    total: number;
    type: string;
}

export type { McLcProgress, McLcDownloadStatus };
