export interface Node {
    // object id for finding objects in lists or comparing if they are same object
    objId?: string;
    id: string;
    name: string;
    labels: string[];
    insertDate: string,
    [key: string]: any;
}

/**
 * Host details like network, cpu 
 *  also there is one in rest.portal
 */
export interface NodeDetail {
    id: string;
    arch?: string;
    cpusCount?: number,
    cpuInfo?: string,
    hostname?: string,
    totalMem: number,
    type: string,
    uptime?: number,
    version: string,
    platform: string,
    release: string,
    freeMem: number,
    interfaces: string,
    lastSeen: number,
    roles?: string
    nodeIp?: string,
    nodePort?: string,
    nodeIpw?: string,
    nodePortw?: string,
    nodePublicKey?: string,
}