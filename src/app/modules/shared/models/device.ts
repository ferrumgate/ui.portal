export type OSType = 'win32' | 'darwin' | 'linux' | 'android' | 'ios';

export interface DevicePosture {
    objId?: string
    id: string;
    name: string;
    labels: string[];
    isEnabled: boolean;
    insertDate: string;
    updateDate: string;
    os: OSType;
    clientVersions?: { version: string }[];
    osVersions?: { name: string, release?: string }[];
    filePathList?: { path: string; sha256?: string; fingerprint?: string }[];
    processList?: { path: string; sha256?: string; fingerprint?: string }[];
    registryList?: { path: string; key?: string, value?: string; }[];
    discEncryption?: boolean;
    firewallList?: { name: string }[];
    antivirusList?: { name: string }[];
    macList?: { value: string }[];
    serialList?: { value: string }[];
    [key: string]: any;
}