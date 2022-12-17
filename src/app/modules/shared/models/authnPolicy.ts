import { AuthenticationProfile, cloneAuthenticatonProfile } from "./authnProfile";



export interface AuthenticationRule {
    objId?: string;
    id: string;
    name: string;
    networkId: string;
    userOrgroupIds: string[];
    profile: AuthenticationProfile;
    isEnabled: boolean;
    action: 'allow' | 'deny';
    [key: string]: any;

}
export function cloneAuthenticationRule(val: AuthenticationRule): AuthenticationRule {
    return {
        id: val.id,
        action: val.action,
        name: val.name,
        networkId: val.networkId,
        userOrgroupIds: val.userOrgroupIds ? Array.from(val.userOrgroupIds) : [],
        profile: cloneAuthenticatonProfile(val.profile),
        isEnabled: val.isEnabled
    }
}


export interface AuthenticationPolicy {
    rules: AuthenticationRule[];
}