export const Config: ConfigType = { 
    port: 9000,
    host: 'https://nodeapi.com/'
}

export interface ConfigType {
    port?: number;
    host: string;
}