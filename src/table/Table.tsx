/*
 * @Author: gyb
 * @Date: 2021-10-17
 * @Description: 表格组件
 */
import type { TablePublicProps } from './types';

import { computed, defineComponent, toRefs } from '@vue/composition-api';
import { tableProps } from './types';
import { renderHeader } from './header';
import { renderPagination } from './pagination';
import { renderEmpty } from './empty';
import { renderBody } from './body';
import { useClasses } from './composables/use-classes';
import { useSort } from './composables/use-sort';
import { usePager } from './composables/use-pager';
import { useChecked } from './composables/use-checked';
import { useData } from './composables/use-data';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  setup(props: TablePublicProps, context) {
    const { rowHeight, data, pagination } = toRefs(props);
    const isShowPager = computed(() => !!pagination.value);
    const total = computed(() => data.value.length);
    const { sortField, onChangeSort } = useSort();
    const { paginationOptions, onChangePager } = usePager(pagination, total);
    const { tableData, sortData } = useData(data, sortField, paginationOptions, isShowPager);
    const { checked, onChangeSelections, onChangeCheckbox, isHalfChecked } = useChecked(tableData, sortData);
    const { tdClasses, tdStyles } = useClasses(rowHeight);

    return () => {
      const headerNode = renderHeader({ props, context, sortField, checked, onChangeSelections, isHalfChecked, onChangeSort });
      const emptyNode = renderEmpty(props, context);
      const bodyNode = renderBody({ props, context, tableData, tdClasses, tdStyles, onChangeCheckbox });
      const paginationNode = renderPagination({ props, context, pagination: paginationOptions, onChangePager });

      return (
        <div>
          <table class="sf-table">
            {/* <colgroup>
              {props.columns.map(() => <col />)}
            </colgroup> */}
            {headerNode}
            <tbody class="sf-table-tbody">
              {!props.data.length ? emptyNode : bodyNode}
            </tbody>
          </table>
          { props.pagination !== false && paginationNode}
        </div>
      )
    }
  },
});
