/*
 * @Author: gyb
 * @Date: 2021-10-18
 * @Description: 表格主体相关界面
 */

import type { TableBodyOptions } from './types';

import { SfCheckbox } from '../form/checkbox';

export function renderBody(options: TableBodyOptions) {
	const { context, props, tableData, onChangeCheckbox, tdClasses, tdStyles } = options;	

	return (
		tableData.value.map(record => {
			return <tr>
				{ props.selectable && 
					<td class={tdClasses.value} style={tdStyles.value}>
						<div class="sf-table-cell-selection">
							<SfCheckbox checked={record.selected} onChange={() => onChangeCheckbox(record)} />
						</div>
					</td> 
				}
				{
					props.columns.map(column => {

						// 判断是否存在slots
						const vnodes = context.slots?.body?.({column, record});					
						const hasVNode = vnodes?.some(vnode => vnode.text || vnode.tag);
						return <td class={tdClasses.value} style={tdStyles.value} colspan={1}>
							{ hasVNode ? vnodes : record[column.key] }
						</td>
					})
				}
			</tr>
		})
	)
}