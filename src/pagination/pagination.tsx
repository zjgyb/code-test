/*
 * @Author: gyb
 * @Date: 2021-10-18
 * @Description: 分页组件
 */

import type { PaginationPublicProps } from './types';
import type { Ref, SetupContext } from '@vue/composition-api';

import { computed, defineComponent } from '@vue/composition-api';
import { paginationProps } from './types';
import PaginationItem from './item';

export default defineComponent({
	name: 'SfPagination',
	props: paginationProps,
	setup(props: PaginationPublicProps, context) {
		const endPage = computed(() => {
			return Math.ceil(props.total / props.pageSize);
		});
		const { prevCls, nextCls } = useClasses(props, endPage);
		const children = getRangeItems(props, endPage, context);
		const { onPageChange } = getEvents(props, endPage, context);

		return {
			endPage,
			prevCls,
			nextCls,
			children,
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
				this.children
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

function getRangeItems(props: PaginationPublicProps, endPage: Ref<number>, context: SetupContext) {
	return computed(() => {
		const middleCount = 5; // 中间页码个数
		const count = 2; // 第一页和最后一页固定死，一共两个
		const allCount = middleCount + count;
		const isOverMinCount = endPage.value > middleCount + count;
		const { emitPageNum, onPageChange } = getEvents(props, endPage, context);
		let itemPages: number[] = [];

		if (endPage.value <= allCount) {
			itemPages = getItemsNumber(count, endPage.value);
		} else {
			let prev = Math.max(count, props.current - count);
			prev = Math.min(prev, endPage.value - middleCount + 1);
			let end = Math.min(prev + middleCount, endPage.value);
			itemPages = getItemsNumber(prev, end);
		}

		// 判断是否需要显示往前5页与往后5页的按钮
		const hasPrev5 = isOverMinCount && (props.current >= middleCount);
		const haxNext5 = isOverMinCount && (props.current <= endPage.value - middleCount + 1)

		return [
			<PaginationItem active-index={props.current} onChange={emitPageNum} />,
			hasPrev5 && <li class="sf-pagination-item sf-pagination-item_prev" title={`向前${middleCount}页`} onClick={() => onPageChange(-middleCount)}></li>,
			...itemPages.map(i => {
				return <PaginationItem title={i} active-index={props.current} value={i} onChange={emitPageNum} />
			}),
			haxNext5 && <li class="sf-pagination-item sf-pagination-item_next" title={`向后${middleCount}页`} onClick={() => onPageChange(middleCount)}></li>,
			endPage.value > 1 && <PaginationItem value={endPage.value} active-index={props.current} onChange={emitPageNum} />
		]
	})
}

function getEvents(props: PaginationPublicProps, endPage: Ref<number>, context: SetupContext) {

	// 判断是否等于边界值
	const pageMap = new Map([
		[1, endPage.value],
		[-1, 1]
	]);

	const emitPageNum = (pageNum: number) => {
		context.emit('change', pageNum);
		context.emit('update:current', pageNum);
	}

	const onPageChange = (value = 1) => {
		if (props.current === pageMap.get(value)) {
			return;
		}
		let currentPage = props.current + value;
		currentPage = Math.min(Math.max(currentPage, 1), endPage.value);
		emitPageNum(currentPage);
	}

	return {
		emitPageNum,
		onPageChange
	}
}