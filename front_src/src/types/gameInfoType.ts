import {McLcVersionType} from "./mcVersionType";

interface ClientInfoType{
    version: McLcVersionType;
    pid: number | null;
    name?: string;
}
interface GamesInfoType{
    [uuid: string]: ClientInfoType
}

export default GamesInfoType;
export type {ClientInfoType};
