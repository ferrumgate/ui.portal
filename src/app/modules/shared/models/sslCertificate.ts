export type SSLCertificateCategory = 'ca' | 'jwt' | 'web' | 'tls' | 'auth';

export interface SSLCertificate {
    idEx?: string;
    name: string;
    labels: string[];
    insertDate: string;
    updateDate: string;
    publicCrt?: string;
    privateKey?: string;
    isEnabled: boolean;
    parentId?: string;
    category?: SSLCertificateCategory;
    isSystem?: boolean;
    [key: string]: any;


}
export interface SSLCertificateEx extends SSLCertificate {
    id: string;
    isIntermediate?: boolean;

}