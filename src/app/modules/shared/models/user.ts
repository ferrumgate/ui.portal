import { Role } from "./rbac";

export interface User {
    id: string;
    name: string;
    email: string;
    roles: Role[]
}