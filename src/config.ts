export const Config: ConfigType = { 
    port: 9000,
    pi: {
        apiKey: '1ccbgirca4u78zkprqfop90tkwnmvs7wmfckk18xxgiatwvg8hpyewsflvtfb3yb',
        privateSeed: 'SBVQ5QC4XCT6AU6JC3O3AFTBLKOVX3MOL5YFY5RCLP5USMKDMGASEJTN'
    },
    noco: {
        apiKey: 'YTOYeS0TbRVNQ3nC2NHbplwgOFQFWLCY7s4KzLjp'
    },
    host: 'https://nodeapi.com/'
}

export interface ConfigType {
    port?: number;
    pi: {
        apiKey: string;
        privateSeed: string;
    };
    noco: {
        apiKey: string;
    };
    host: string;
}