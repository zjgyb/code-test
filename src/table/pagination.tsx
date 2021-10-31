/*
 * @Author: gyb
 * @Date: 2021-10-18
 * @Description: 表格分页相关代码
 */

import type { TablePaginationOptions } from './types';

import { SfPagination } from '../pagination';

export function renderPagination(options: TablePaginationOptions) {
    const { pagination, props, onChangePager } = options;
    
    if (props.pagination === false) {
        return null;
    }
    
    return <SfPagination class="sf-table-pagination" current={pagination.current} total={pagination.total} onChange={onChangePager} />
}