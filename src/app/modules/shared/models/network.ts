
/**
 * a machine that can connect to a internal network
 */
export interface Gateway {
    id: string;
    name: string;
    labels: string[];
    networkId?: string;
    isJoined?: number;
    isActive?: number;
    [key: string]: any;
}


/**
 * @summary a group of @see Gateway s
 */
export interface Network {
    id: string;
    name: string;
    labels: string[];
    clientNetwork: string;
    serviceNetwork: string;
    gateways: Gateway[];
    [key: string]: any;
}