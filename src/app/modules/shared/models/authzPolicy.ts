import { AuthorizationProfile } from "./authzProfile";

export interface AuthorizationRule {
    objId?: string;
    id: string;
    name: string;
    networkId: string;
    userOrgroupIds: string[];
    serviceId: string;
    profile: AuthorizationProfile;
    isEnabled: boolean;

    [key: string]: any;

}

export interface AuthorizationPolicy {

    rules: AuthorizationRule[];
    rulesOrder: string[];

}