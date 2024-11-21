export enum AuthState {
    Unknown,
    Session,
    User
}

export interface Auth {
    state: AuthState;
    username: string;
}
