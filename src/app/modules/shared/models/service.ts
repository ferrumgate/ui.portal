export interface Service {
    objId?: string
    id: string;
    name: string;
    labels?: string[];
    tcp?: number;
    udp?: number;
    protocol?: string;
    host: string;
    networkId: string;
    isEnabled: boolean;
    assignedIp: string;
}