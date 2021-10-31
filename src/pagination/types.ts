/*
 * @Author: gyb
 * @Date: 2021-10-18 08:26:00
 * @Description: 分页组件
 */

import type { IxPublicPropTypes } from '../table/types';

// 分页组件的props
export const paginationProps = {
	current: {
		type: Number
	},
	total: {
		type: Number,
		default: 0
	},
	pageSize: {
		type: Number,
		default: 10
	}
};

// 页码组件
export const itemProps = {
	value: {
		type: Number,
		default: 1
	},
	activeIndex: {
		type: Number,
		default: 1
	}
}

export type PaginationPublicProps = Required<IxPublicPropTypes<typeof paginationProps>>
export type ItemPublicProps = Required<IxPublicPropTypes<typeof itemProps>>