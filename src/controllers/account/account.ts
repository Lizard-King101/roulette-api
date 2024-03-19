import { SystemColumns } from "../../modules/noco";


export interface AccountRow extends SystemColumns{
    UID: string;
    Balance: number;
}
