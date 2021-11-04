import type { Pagination } from '../types';
import { reactive, Ref, watch, ComputedRef, watchEffect } from '@vue/composition-api';
import { merge } from 'lodash-es';
import { pagination } from '../const';

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
