export enum AccountRole {
    Session = "ROLE_SESSION",
    User = "ROLE_USER",
    // Admin = "ROLE_ADMIN"
}

export class Account {
    role: AccountRole | undefined;
    username: string;
    password: string | undefined;
    constructor(username: string, password?: string, role?: AccountRole) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
} 

