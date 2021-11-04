import type { Pagination, SortKeys, TableRecord } from '../types';
import { ref, Ref, computed, watch, getCurrentInstance, ComputedRef } from '@vue/composition-api';
import { cloneDeep, sortBy } from 'lodash-es';
import { Order } from '../const';

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
