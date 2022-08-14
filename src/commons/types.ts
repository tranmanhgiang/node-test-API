export interface SearchParam {
    page?: number;
    pageSize?: number;
    searchValue?: string;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

export interface FindAndCountSequelizeResponse<T> {
    rows: T[];
    count: number;
    page: number;
}
