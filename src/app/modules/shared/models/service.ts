
export interface ServicePort {
    port: number;
    isTcp?: boolean;
    isUdp?: boolean;
    protocol?: string;
    [key: string]: any;

}
export interface ServiceHost {
    host: string;
    [key: string]: any;

}

export interface Service {
    objId?: string
    id: string;
    name: string;
    labels?: string[];

    //listen ports
    ports: ServicePort[];
    protocol?: string;
    //upstream hosts and rules
    hosts: ServiceHost[];
    networkId: string;
    isEnabled: boolean;
    assignedIp: string;
    isSystem?: boolean;
    count: number;
    [key: string]: any;
}