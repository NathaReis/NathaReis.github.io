export interface Escala 
{
    id?: string,
    escala_name: string,
    escala_id: string,
    start_date: string,
    escala: Array<{id: number, hour: string, categoria: string, pessoa: string, descricao: string}>,
    user: string,
}