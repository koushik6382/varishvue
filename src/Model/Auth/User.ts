export interface GetUser {
    id: string,
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    lockoutEnabled: boolean
    phoneNumber: string;
    roles: string;
    username: string;
    role: string;
}

export interface CreateUser {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    conformPassword: string;
    phoneNumber: string;
    role: string;
}

export interface EditUser {
    firstName: string;
    lastName: string;
    email: string;
    // userName: string;
    // lockoutEnabled: boolean;
    phoneNumber: string;
    role: string;
}

export interface UserResetPassword {
    userName: string;
    token: string;
    newPassword: string;
    conformPassword: string;
}


// export interface GetUser {
//     id: string,
//     firstName: string;
//     lastName: string;
//     email: string;
//     normalizedEmail: string | null;
//     emailConfirmed: boolean
//     emailVerificationCode: string | null;
//     createdAt: string | null;
//     createdBy: string | null;
//     refreshTokens: string | null;
//     normalizedUserName: string | null;
//     userName: string;
//     username: string;
//     lockoutEnabled: boolean;
//     password: string;
//     conformPassword: string;
//     phoneNumber: string;
//     role: string;
//     roles: string;
//     licenseeCode: string;
//     licenseeId: number;
//     passwordHash: string | null;
//     securityStamp: string | null;
//     concurrencyStamp: string | null;
//     phoneNumberConfirmed: boolean;
//     twoFactorEnabled: boolean;
//     lockoutEnd: string | null;
//     accessFailedCount: number;
// }