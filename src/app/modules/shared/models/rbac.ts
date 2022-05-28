/**
 * @summary this definitions comes from rest.portal project rbac.ts file
 */

export interface Role {
    id: string;
    name: string;
    rightIds?: string[];
    [key: string]: any;
}
export interface Right {
    id: string;
    name: string;


}
export class RBACDefault {

    //system defined default rights
    /**
     * @summary system defined right ids
     */
    static systemRightIds = ['Admin', 'Reporter', 'User'];
    static rightAdmin: Right = { id: 'Admin', name: 'Admin', };
    static rightReporter: Right = { id: 'Reporter', name: 'Reporter' };
    static rightUser: Right = { id: 'User', name: 'User' };



    // new rights here
    static rightIds: string[] = [];
    ////  system defined roles
    /**
     * @summary system defined role ids
     */
    static systemRoleIds = ['Admin', 'Reporter', 'User'];
    static roleAdmin: Role = { id: 'Admin', name: 'Admin', rightIds: [this.rightAdmin.id] };
    static roleReporter: Role = { id: 'Reporter', name: 'Reporter', rightIds: [this.rightReporter.id] };
    static roleUser: Role = { id: 'User', name: 'User', rightIds: [this.rightUser.id] };

}