/**
 * @summary
 * @remark this code comes from rest.portal
 */
export interface ActivityLog {
    insertDate: string;
    requestId: string;
    type: string;//'login try','login allow','login deny','service allow','service deny','pam activated'
    authSource: string;//google, apikey
    ip: string;
    status: number;//0 success;
    statusMessage?: string;

    username?: string;
    userId?: string;
    user2FA?: boolean;

    sessionId?: string;
    is2FA?: boolean;

    trackId?: number;
    assignedIp?: string;
    tunnelId?: string;
    serviceId?: string;
    serviceName?: string;
    networkId?: string;
    networkName?: string;
    gatewayId?: string;
    gatewayName?: string;
    authnRuleId?: string;
    authnRuleName?: string
    authzRuleId?: string;
    authzRuleName?: string
    tun?: string;

    deviceId?: string;
    deviceName?: string;
    osName?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;

    [key: string]: any;
}