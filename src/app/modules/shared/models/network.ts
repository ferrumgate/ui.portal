
/**
 * a machine that can connect to a internal network
 */
export interface Gateway {
    // object id for finding objects in lists or comparing if they are same object
    objId?: string;
    id: string;
    name: string;
    labels: string[];
    networkId?: string;
    isEnabled?: boolean;

    [key: string]: any;
}

/**
 * @summary a group of @see Gateway s
 */
export interface Network {
    // object id for finding objects in lists or comparing if they are same object
    objId?: string;
    id: string;
    name: string;
    labels: string[];
    clientNetwork: string;
    serviceNetwork: string;
    isEnabled?: boolean;
    sshHost?: string;
    [key: string]: any;
}

