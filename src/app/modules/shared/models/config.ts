export interface ConfigPublic {

}

export interface ConfigCommon {
    url?: string;
    domain?: string;
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