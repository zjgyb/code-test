/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SetupContext, Ref, ComputedRef } from '@vue/composition-api';
import type { PropOptions, PropType } from 'vue-types/dist/types';
import type { StyleValue } from 'typings/vue-runtime-dom';
import type { PaginationPublicProps } from '../pagination/types';
import { Order, TableSize } from './const';

type Prop<T, D = T> = PropOptions<T, D> | PropType<T>
type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T]

type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>
type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? Record<string, any>
      : T extends BooleanConstructor | { type: BooleanConstructor }
        ? boolean
        : T extends Prop<infer V, infer D>
          ? unknown extends V
            ? D
            : V
          : T

// eslint-disable-next-line @typescript-eslint/ban-types
export type IxPublicPropTypes<O> = O extends object
  ? { [K in PublicRequiredKeys<O>]: InferPropType<O[K]> } & { [K in PublicOptionalKeys<O>]?: InferPropType<O[K]> }
  : { [K in string]: any }

// 表头定义
export interface TableColumn {
  title: string;
  key: string;
  sortable?: boolean;
}

export type Pagination = PaginationPublicProps;

// Props 定义在这里
export const tableProps = {
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  data: {
    type: Array as PropType<AnyObject[]>,
    default: () => []
  },
  pagination: {
    type: [Boolean, Object] as PropType<false | Pagination>,
    default: () => ({})
  },
  selectable: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'No data'
  },
  hasHeader: {
    type: Boolean,
    default: true
  },
  rowHeight: {
    type: [String, Number] as PropType<number | TableSize>,
    default: TableSize.normal
  }
}

export type TablePublicProps = Required<IxPublicPropTypes<typeof tableProps>>

export interface SortKeys {
  key: string;
  order: Order | '';
}

export interface TableRecord {
  selected: boolean;
  [name: string]: any;
}

// 传递到各个组件时所需的参数
export interface TableArgs {
  props: TablePublicProps;
  context: SetupContext;
}

export interface TableHeaderOptions extends TableArgs {
  sortField: Partial<SortKeys>;
  checked: Ref<boolean>;
  isHalfChecked: ComputedRef<boolean>;
  onChangeSelections: (isChecked: boolean) => void;
  onChangeSort: (column: TableColumn) => void;
}

export interface TableBodyOptions extends TableArgs {
  tableData: Ref<TableRecord[]>;
  onChangeCheckbox: (record: TableRecord) => void;
  tdClasses: ComputedRef<{ [name: string]: boolean }>;
  tdStyles: ComputedRef<StyleValue>;
}

export interface TablePaginationOptions extends TableArgs {
  onChangePager: (value: number) => void;
  pagination: Pagination;
}