
export interface LetsEncryptChallenge {
    key: string;
    value: string;
    type: 'http' | 'dns';
}
export interface LetsEncrypt {
    domain: string;
    updateDate: string;
    email: string;
    challengeType?: 'http' | 'dns';
    privateKey?: string;
    publicCrt?: string;
    chainCrt?: string;
    fullChainCrt?: string;
    challenge?: LetsEncryptChallenge;
    isEnabled?: boolean;
    [key: string]: any;
}

export type SSLCertificateCategory = 'ca' | 'jwt' | 'web' | 'tls' | 'auth';

export interface SSLCertificateBase {
    publicCrt?: string;
    privateKey?: string;
    parentId?: string;
    category?: SSLCertificateCategory;
    letsEncrypt?: LetsEncrypt;
    chainCrt?: string;
}

export interface SSLCertificate extends SSLCertificateBase {
    idEx?: string;
    name: string;
    labels: string[];
    usages: string[],
    insertDate: string;
    updateDate: string;
    isEnabled: boolean;
    isSystem?: boolean;
    [key: string]: any;


}
export interface SSLCertificateEx extends SSLCertificate {
    id: string;
    isIntermediate?: boolean;

}

export function cloneLetsEncrypt(val: LetsEncrypt): LetsEncrypt {
    return {
        domain: val.domain,
        updateDate: val.updateDate,
        email: val.email,
        challengeType: val.challengeType,
        privateKey: val.privateKey,
        publicCrt: val.publicCrt,
        fullChainCrt: val.fullChainCrt,
        challenge: val.challenge ? { ...val.challenge } : undefined,
        isEnabled: val.isEnabled

    }
}