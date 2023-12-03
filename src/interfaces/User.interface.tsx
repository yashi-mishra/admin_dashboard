export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface UserRowData extends User {
    action: JSX.Element; 
}
