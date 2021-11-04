
import type { TableRecord } from '../types';
import { ref, Ref, computed, watch, getCurrentInstance } from '@vue/composition-api';

// 勾选相关
export function useChecked(tableData: Ref<TableRecord[]>, allData: Ref<TableRecord[]>) {
	const checked = ref(false);
	const vm = getCurrentInstance();

	const selectedData = computed(() => {
		return allData.value.filter(item => item.selected);
	});

	// 是否处于部分勾选状态
	const isHalfChecked = computed(() => {
		const selectedLen = selectedData.value.length;
		return selectedLen > 0 && tableData.value.length > selectedLen;
	});

	/**
	 * 改变勾选状态
	 * @param isChecked 勾选状态
	 */
	const onChangeSelections = (isChecked: boolean) => {
		checked.value = isChecked;
		const selectedItems: TableRecord[] = [];
		tableData.value.forEach(item => {
			if (!item.selected) {
				selectedItems.push(item);
			}
			item.selected = isChecked;
		});
		vm?.emit('select', selectedItems, selectedData);
	}

	// 表格勾选状态改变
	const onChangeCheckbox = (record: TableRecord) => {
		record.selected = !record.selected;
		vm?.emit('select', [record], selectedData.value);
	}

	watch(tableData, () => {
		checked.value = tableData.value.every(item => item.selected);
	}, { immediate: true });

	return {
		checked,
		onChangeCheckbox,
		onChangeSelections,
		isHalfChecked
	}
}
