import { Country } from "./country";


export interface FqdnIntelligenceSource {
    id: string;
    objId?: string;
    type: 'brightcloud.com' | string;
    name: string;
    insertDate: string;
    updateDate: string;
    [key: string]: any;
}

export interface FqdnIntelligenceCategory {
    id: string;
    name: string;
}

export interface FqdnIntelligenceSources {
    items: FqdnIntelligenceSource[];
}



export interface FqdnIntelligence {

    //intelligence sources
    sources: FqdnIntelligenceSources
    lists: FqdnIntelligenceList[];

}


export interface FqdnIntelligenceList {
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

export interface FqdnIntelligenceListStatus {
    id: string;
    lastCheck?: string;
    lastError?: string;
    hash?: string;
    isChanged?: boolean;
    hasFile?: boolean;
    [key: symbol]: string;
}

export interface FqdnIntelligenceListFiles {
    [key: string]: { page: number, hash: string };
}
export interface FqdnIntelligenceListItem {
    // list id
    id: string;
    page: number;
    // value
    fqdn: string;
    insertDate: string;

}




export interface FqdnIntelligenceItem {
    fqdn: string;
    categoryId: string;
    listId: string;
}

