import { Api } from 'nocodb-sdk'

export class NocoDB {
    public static getAPI() {
        return new Api({
            baseURL: 'https://noco.multihosts.net',
            headers: {
                'xc-token': global.config.noco.apiKey
            }
        })
    }
}

export interface SystemColumns {
    Id: number;
    CreatedAt: string | Date;
    UpdatedAt: string | Date;
}