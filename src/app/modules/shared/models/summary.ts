// this models come from rest.portal project

/**
 * @summary 
 */
export interface SummaryConfig {
    networkCount: number;
    gatewayCount: number;
    userCount: number;
    groupCount: number;
    serviceCount: number;
    authnCount: number;
    authzCount: number
}

export interface SummaryActive {
    sessionCount: number;
    tunnelCount: number;
}

/**
 * @summary aggregations
 */
export interface SummaryAgg {
    total: number;
    aggs: SummaryAggItem[];
}
export interface SummaryAggItem {
    key: any,
    value: number;
    sub?: SummaryAggItem[]

}