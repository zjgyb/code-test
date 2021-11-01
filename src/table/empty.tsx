/*
 * @Author: gyb
 * @Date: 2021-10-18
 * @Description: 空状态相关界面
 */

import type { SetupContext } from '@vue/composition-api';
import type { TablePublicProps } from './types';

export function renderEmpty(props: TablePublicProps, context: SetupContext) {
	return (
		<tr class="sf-table-placeholder">
			<td class="sf-table-cell" colspan={props.columns.length}>
				{context.slots?.empty?.() || props.emptyText}
			</td>
		</tr>
	)
}