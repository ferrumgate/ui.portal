import { Role } from "./rbac";

export interface User {
    id: string;
    name: string;
    username: string;
    roles: Role[]
}