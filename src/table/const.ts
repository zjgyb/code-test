/*
 * @Author: gyb
 * @Date: 2021-10-18
 * @Description: 表格组件默认配置项
 */

// 表格分页配置默认值
export const pagination = {
	pageSize: 10,
	current: 1,
	total: 0
}

// 排序相关
export enum Order {
	desc = 'desc',
	asc = 'asc'
}

// 排序相关，用于改变排序值
export const orderMap = new Map<Order, Order | ''>([
	[Order.asc, Order.desc],
	[Order.desc, '']
]);

// 表格高度相关
export enum TableSize {
	small = 'sm',
	normal = 'normal',
	large = 'lg'
}