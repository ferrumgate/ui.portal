export type SSLCertificateCategory = 'ca' | 'jwt' | 'web' | 'tls' | 'auth';

export interface SSLCertificateBase {
    publicCrt?: string;
    privateKey?: string;
    parentId?: string;
    category?: SSLCertificateCategory;
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