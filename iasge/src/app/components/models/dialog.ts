export interface Dialog 
{
    title?: string,
    message?: string,
    confirm?: boolean,
    alert?: boolean,
    eventBox?: boolean,
    eventEdit: boolean,
    id?: string,
    passwordBox?: boolean,
}