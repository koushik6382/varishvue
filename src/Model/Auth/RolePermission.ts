interface RoleClaims {
    type: string;
    value: string;
    selected: boolean;
}

export interface RolePermission {
    roleId: string;
    roleClaims: Array<RoleClaims>;
}