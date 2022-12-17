import { Role } from "./rbac";


export interface User {
    id: string;
    name: string;
    username: string;
    groupIds: string[]
    roles: Role[];
    source: string;

}


export interface User2 {
    // object id for finding objects in lists or comparing if they are same object
    objId?: string;
    id: string;
    name: string;
    username: string;
    groupIds: string[];
    source: string;
    isVerified?: boolean;
    isLocked?: boolean;
    is2FA?: boolean;
    twoFASecret?: string;
    insertDate: string;
    updateDate: string;
    isOnlyApiKey?: boolean;
    apiKey?: string;
    roleIds?: string[];
    email?: string;
    isEmailVerified?: boolean;
    labels?: string[];
    [key: string]: any;

}

