export enum AccountRole {
    Session = "ROLE_SESSION",
    User = "ROLE_USER",
    Admin = "ROLE_ADMIN"
}

export interface Account {
    role: AccountRole;
    username: string;
} 

