import { AuthenticationProfile, cloneAuthenticationProfile } from "./authnProfile";



export interface AuthenticationRule {
    objId?: string;
    id: string;
    name: string;
    networkId: string;
    userOrgroupIds: string[];
    profile: AuthenticationProfile;
    isEnabled: boolean;
    [key: string]: any;


}
export function cloneAuthenticationRule(val: AuthenticationRule): AuthenticationRule {
    return {
        id: val.id,
        name: val.name,
        networkId: val.networkId,
        userOrgroupIds: val.userOrgroupIds ? Array.from(val.userOrgroupIds) : [],
        profile: cloneAuthenticationProfile(val.profile),
        isEnabled: val.isEnabled
    }
}


export interface AuthenticationPolicy {
    rules: AuthenticationRule[];
    rulesOrder: string[];
}