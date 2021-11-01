/*
 * @Author: gyb
 * @Date: 2021-10-18
 * @Description: 表格表头
 */

import type { TableHeaderOptions } from './types';

import { SfCheckbox } from '../form/checkbox';
import { Order } from './const';

export function renderHeader(options: TableHeaderOptions) {
	const {
		sortField,
		context,
		props,
		checked,
		isHalfChecked,
		onChangeSelections,
		onChangeSort } = options;

	if (!props.hasHeader) {
		return null;
	}

	return (
		<thead class="sf-table-thead">
			<tr>
				{props.selectable &&
					<th class="sf-table-cell" colspan="1" style={{ width: '40px' }}>
						<div class="sf-table-cell-selection">
							<SfCheckbox checked={checked.value} onChange={onChangeSelections} isHalf={isHalfChecked.value} />
						</div>
					</th>
				}
				{
					props.columns.map(column => {
						const isSameKey = sortField.key === column.key;
						const isAscActive = isSameKey && sortField.order === Order.asc;
						const isDescActive = isSameKey && sortField.order === Order.desc;
						const vnodes = context.slots?.header?.({ column });
						const hasVNode = vnodes?.some(vnode => vnode.text || vnode.tag);

						return (
							<th class={{ 'sf-table-cell': true, 'sf-table-cell--sorable': column.sortable }} colspan="1" onClick={() => onChangeSort(column)}>
								<div class="sf-table-cell-hbox">
									{hasVNode ? vnodes : <span class="sf-table-cell-title ellipsis" title={column.title}>{column.title}</span>}
									{column.sortable &&
										<span class="sf-table-sorter">
											<i class={`fas fa-sort-up sf-table-sorter-up ${isAscActive ? 'sf-table-sorter--active' : ''}`}></i>
											<i class={`fas fa-sort-down sf-table-sorter-down ${isDescActive ? 'sf-table-sorter--active' : ''}`}></i>
										</span>
									}
								</div>
							</th>
						)
					})
				}
			</tr>
		</thead>
	)
}