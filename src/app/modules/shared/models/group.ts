import { SecurityProfile } from "./securityProfile";

export interface Group {
    id: string;
    name: string;
    labels: string[];
    isEnabled: boolean;
    securityProfile?: SecurityProfile;
    [key: string]: any;
}