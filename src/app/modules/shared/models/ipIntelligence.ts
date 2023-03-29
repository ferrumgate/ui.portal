import { Country } from "./country";


export interface IpIntelligenceSource {
    id: string;
    objId?: string;
    type: 'ipdata.co' | 'ipapi.com' | 'ipify.org' | string;
    name: string;
    insertDate: string;
    updateDate: string;
    [key: string]: any;
}
export interface IpIntelligenceSources {
    items: IpIntelligenceSource[];
}
export interface IpIntelligenceFilterCategory {
    proxy?: boolean,
    hosting?: boolean,
    crawler?: boolean,
}


export interface IpIntelligenceCountryList {
    items: Country[];
}

export interface IpIntelligence {

    //allowed country list
    countryList: IpIntelligenceCountryList,
    //filter category option
    filterCategory: IpIntelligenceFilterCategory,
    //intelligence sources
    sources: IpIntelligenceSources
    lists: IpIntelligenceList[];

}


export interface IpIntelligenceList {
    // for using in ui
    objId?: string;
    id: string;
    name: string;
    http?: {
        url: string;
        checkFrequency: number;//minutes

    };
    file?: {
        source?: string;
        key?: string;


    };
    splitter?: string;
    splitterIndex?: number;
    labels?: string[],
    updateDate: string;
    insertDate: string;
    [key: string]: any;

}

export interface IpIntelligenceListStatus {
    id: string;
    lastCheck?: string;
    lastError?: string;
    hash?: string;
    isChanged?: boolean;
    hasFile?: boolean;
    [key: symbol]: string;
}

export interface IpIntelligenceListFiles {
    [key: string]: { page: number, hash: string };
}
export interface IpIntelligenceListItem {
    id: string;
    cidr: string;
    listId: string;
}




export interface IpIntelligenceItem {
    ip: string;
    countryCode: string;
    countryName: string;
    isProxy: boolean;
    isHosting: boolean;
    isCrawler: boolean;
}

