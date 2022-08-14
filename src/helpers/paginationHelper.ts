import { OrderItem } from 'sequelize/types';
import { FindAndCountSequelizeResponse, SearchParam } from '../commons/types';

const paginate = ({ page = 1, pageSize = 10, sortBy = 'id', sortDirection = 'ASC' }: SearchParam, where = {}) => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const order = [[sortBy, sortDirection] as OrderItem];

    return {
        where,
        order,
        offset,
        limit,
    };
};

const formatResponse = (paginationData: FindAndCountSequelizeResponse<any>) => ({
    list: paginationData.rows,
    total: paginationData.count,
    current_page: paginationData.page,
});

export default { paginate, formatResponse };
