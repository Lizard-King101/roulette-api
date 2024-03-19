import { Api } from "nocodb-sdk";
import { NocoDB, SystemColumns } from "../../modules/noco";
import { AccountRow } from "./account";

export class AccountService {
    db: Api<unknown>
    constructor() {
        this.db = NocoDB.getAPI();
    }

    public async getAccount(uid: string): Promise<AccountRow> {
        let exists = await this.db.dbTableRow.findOne('noco', 'pi-roulette', 'accounts', {
            fields: ['UID', 'Balance', 'CreatedAt', 'Id'],
            where: `(UID,eq,${uid})`
        });
        if(Object.keys(exists).length == 0) return {
            UID: uid,
            Balance: 0
        }  as AccountRow;
        return exists as AccountRow;
    }
}