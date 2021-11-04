import type { SortKeys, TableColumn } from '../types';
import { reactive } from '@vue/composition-api';
import { Order, orderMap } from '../const';

// 分页相关
export function useSort() {
	const sortField = reactive<Partial<SortKeys>>({ key: '', order: '' });

	/**
	 * 排序函数，一般情况下先顺序再倒序
	 * @param column 表格列参数
	 */
	const onChangeSort = (column: TableColumn) => {
		sortField.key = column.key;
		sortField.order = sortField.order ? orderMap.get(sortField.order) : Order.asc;
	}

	return {
		sortField,
		onChangeSort
	}
}