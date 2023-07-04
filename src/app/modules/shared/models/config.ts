import { SafeResourceUrl } from "@angular/platform-browser";

export interface ConfigPublic {

}

export interface ConfigCommon {
    url?: string;
    domain?: string;
    httpsRedirect?: boolean;
}

export interface ConfigCaptcha {
    server?: string;
    client?: string;
}

export interface ConfigEmail {
    type: 'google' | 'office365' | 'smtp' | 'empty',
    fromname: string,
    user: string,
    pass: string,
    [key: string]: any;
}

export interface ConfigES {
    host?: string;
    user?: string;
    pass?: string;
    //delete old records, maximum days
    deleteOldRecordsMaxDays?: number;
}

export interface ConfigBrand {

    name?: string;
    logoWhite?: string;
    logoWhiteUrl?: SafeResourceUrl;
    logoBlack?: string;
    logoBlackUrl?: SafeResourceUrl;
}

