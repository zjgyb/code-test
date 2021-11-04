/*
 * @Author: gyb
 * @Date: 2021-10-18
 * @Description: 分页组件
 */

import type { PaginationPublicProps } from './types';
import { getCurrentInstance, Ref, toRefs } from '@vue/composition-api';

import { computed, defineComponent } from '@vue/composition-api';
import { paginationProps } from './types';
import PaginationItem from './item';
import { middleCount, allCount, count } from './const';

export default defineComponent({
	name: 'SfPagination',
	props: paginationProps,
	setup(props: PaginationPublicProps) {
		const { current } = toRefs(props);
		const endPage = computed(() => {
			return Math.ceil(props.total / props.pageSize);
		});
		const { prevCls, nextCls } = useClasses(props, endPage);
		const { pagerItems } = useRangeItems(current, endPage);
		const { onPageChange } = useEvents(current, endPage);

		return {
			endPage,
			prevCls,
			nextCls,
			pagerItems,
			onPageChange
		}
	},
	render() {
		return <ul class="sf-pagination">
			{/* 未国际化 */}
			<li class={this.prevCls} title="上一页" onClick={() => this.onPageChange(-1)}>
				&lt;
			</li>
			{
				this.pagerItems
			}
			<li class={this.nextCls} title="下一页" onClick={() => this.onPageChange()}>
				&gt;
			</li>
		</ul>
	}
})

function useClasses(props: PaginationPublicProps, endPage: Ref<number>) {
	const prevCls = computed(() => {
		return {
			'sf-pagination-item': true,
			'sf-pagination-item--disabled': props.current === 1
		}
	});
	const nextCls = computed(() => {
		return {
			'sf-pagination-item': true,
			'sf-pagination-item--disabled': props.current === endPage.value
		}
	})
	return {
		prevCls,
		nextCls
	}
}

function getItemsNumber(start: number, end: number) {
	let nums = [];
	for (let i = start; i < end; i++) {
		nums.push(i);
	}
	return nums;
}

function useRangeItems(current: Ref<number>, endPage: Ref<number>) {
	const { emitPageNum, onPageChange } = useEvents(current, endPage);

	const pagerItems = computed(() => {
		const isOverMinCount = endPage.value > middleCount + count;
		let itemPages: number[] = [];

		if (endPage.value <= allCount) {
			itemPages = getItemsNumber(count, endPage.value);
		} else {
			let prev = Math.max(count, current.value - count);
			prev = Math.min(prev, endPage.value - middleCount + 1);
			let end = Math.min(prev + middleCount, endPage.value);
			itemPages = getItemsNumber(prev, end);
		}

		// 判断是否需要显示往前5页与往后5页的按钮
		const hasPrev5 = isOverMinCount && (current.value >= middleCount);
		const haxNext5 = isOverMinCount && (current.value <= endPage.value - middleCount + 1);

		return [
			<PaginationItem active-index={current.value} onChange={emitPageNum} />,
			hasPrev5 && <li class="sf-pagination-item sf-pagination-item_prev" title={`向前${middleCount}页`} onClick={() => onPageChange(-middleCount)}></li>,
			...itemPages.map(i => {
				return <PaginationItem title={i} active-index={current.value} value={i} onChange={emitPageNum} />
			}),
			haxNext5 && <li class="sf-pagination-item sf-pagination-item_next" title={`向后${middleCount}页`} onClick={() => onPageChange(middleCount)}></li>,
			endPage.value > 1 && <PaginationItem value={endPage.value} active-index={current.value} onChange={emitPageNum} />
		]
	});
	return {
		pagerItems
	}
}

function useEvents(current: Ref<number>, endPage: Ref<number>) {
	const vm = getCurrentInstance();
	// 判断是否等于边界值
	const pageMap = new Map([
		[1, endPage.value],
		[-1, 1]
	]);

	const emitPageNum = (pageNum: number) => {
		vm?.emit('change', pageNum);
		vm?.emit('update:current', pageNum);
	}

	const onPageChange = (value = 1) => {
		if (current.value === pageMap.get(value)) {
			return;
		}
		let currentPage = current.value + value;
		currentPage = Math.min(Math.max(currentPage, 1), endPage.value);
		emitPageNum(currentPage);
	}

	return {
		emitPageNum,
		onPageChange
	}
}