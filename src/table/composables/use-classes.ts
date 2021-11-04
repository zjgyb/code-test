import { isNumber, isString } from 'lodash-es';
import { Ref, computed } from '@vue/composition-api';
import { TableSize } from '../const';

// 样式相关
export function useClasses(rowHeight: Ref<TableSize | number>) {

	// 如果传入的字符串，则根据传入的值渲染类名
	const tdClasses = computed(() => {
		const isTableSize = isString(rowHeight.value) && Object.values(TableSize).includes(rowHeight.value);
		const size = isTableSize ? rowHeight.value : TableSize.normal;
		return {
			'sf-table-cell': true,
			[`sf-table-cell--${size}`]: true
		}
	});

	// 如果传入的是number，则使用style进行渲染
	const tdStyles = computed(() => {
		return isNumber(rowHeight.value) ? {
			height: rowHeight.value + 'px'
		} : {}
	});

	return {
		tdClasses,
		tdStyles
	};
}
