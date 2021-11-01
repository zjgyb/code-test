/*
 * @Author: gyb
 * @Date: 2021-10-30
 * @Description: 表格hooks
 */

import type { Pagination, SortKeys, TableColumn, TableRecord } from './types';
import { reactive, ref, Ref, computed, watch, getCurrentInstance, ComputedRef, watchEffect } from '@vue/composition-api';
import { cloneDeep, merge, sortBy, isNumber, isString } from 'lodash-es';
import { Order, pagination, orderMap, TableSize } from './const';

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

// 监听传入pagination变化
export function usePager(options: Ref<Pagination | false>, total: ComputedRef<number>) {
	const paginationOptions = reactive(merge({}, pagination, { total: total.value }));

	/**
	* 当表格页码改变时改变值
	* @param value 页码
	*/
	const onChangePager = (value: number) => {
		paginationOptions.current = value;
	}

	watchEffect(() => {
		paginationOptions.total = (options.value ? options.value.total : null) ?? total.value;
	});

	// 改变分页配置
	watch(options, (newVal) => {     
		merge(paginationOptions, newVal || {});
	}, { deep: true });

	return {
		paginationOptions,
		onChangePager
	}
}

// 与数据管理
export function useData(data: Ref<AnyObject[]>, sortField: Partial<SortKeys>, pagination: Pagination, isShowPager: ComputedRef<boolean>) {
	const sourceData = computed<TableRecord[]>(() => {
		return cloneDeep(data.value).map(item => {
			return { ...item, selected: item.selected ?? false };
		});
	});
	const vm = getCurrentInstance();

	// 排序后数据
	const sortData = computed(() => {
		const sortByData = sortBy(sourceData.value, [sortField.key]);
		sortField.order === Order.desc && sortByData.reverse();
		return sortField.order ? sortByData : sourceData.value;
	});

	// 判读是否需要截取数据，如果截取数据不为空，则截取，否则直接用源数据
	const sliceData = computed(() => {
		if (!isShowPager.value) {
			return sourceData.value;
		}

		const startPage = (pagination.current - 1) * pagination.pageSize;
		let sliceData = sortData.value?.slice(startPage, startPage + pagination.pageSize);
		return sliceData.length ? sliceData : sortData.value;
	});

	const tableData = ref(sliceData.value);

	// 页码或者排序变化时向外抛出事件
	watch(isShowPager.value ? [sortField, pagination] : [sortField], () => {
		vm?.emit('change', pagination, sortField);
	}, { deep: true });

	watch(sliceData, () => {
		tableData.value = sliceData.value;
	});

	return {
		tableData,
		sortData
	}
}

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
