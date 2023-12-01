
export interface Dns {

    records: DnsRecord[]
}

export interface DnsRecord {
    objId?: string
    id: string;
    fqdn: string;
    ip: string;
    labels?: string[];
    isEnabled: boolean
    [key: string]: any;
}

