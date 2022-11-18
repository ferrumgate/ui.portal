/**
 * @summary
 * @remark this code comes from rest.portal
 */
export interface AuditLog {
    userId: string;
    username: string;
    insertDate: string;
    message: string;
    messageSummary: string;
    ip: string;
    severity: string;
    messageDetail: string;
    tags: string;
    [key: string]: any;
}