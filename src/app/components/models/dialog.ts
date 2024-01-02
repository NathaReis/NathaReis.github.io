export interface Dialog 
{
    title?: string,
    message?: string,
    confirm?: boolean,
    alert?: boolean,
    id?: string,
    passwordBox?: boolean,
    escalaBox?: boolean,
    escalaView: Array<{id: number, hour: string, categoria: string, pessoa: string, descricao: string}>,
}