import { Role } from "./rbac";

export interface User {
    id: string;
    name: string;
    username: string;
    groupIds: string[]
    roles: Role[]
}