export interface Escala 
{
    id?: string,
    escala_name: string,
    start_date: Date,
    escala: Array<{id: number, hour: string, categoria: string, pessoa: string, descricao: string}>,
    user: string,
}