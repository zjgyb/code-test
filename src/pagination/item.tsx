/*
 * @Author: gyb
 * @Date: 2021-10-18
 * @Description: 分页组件页码
 */

import type { ItemPublicProps } from './types';

import { computed, defineComponent } from '@vue/composition-api';
import { itemProps } from './types';

export default defineComponent({
  name: 'SfPaginationItem',
  props: itemProps,
  setup(props: ItemPublicProps, { emit }) {
    const classes = useClasses(props);
    const onClick = () => {
      emit('change', props.value);
    };

    return () => {
      return (
        <li class={classes.value} title={props.value?.toString()} onClick={onClick}>{props.value}</li>
      )
    }
  },
})

function useClasses(props: ItemPublicProps) {
  return computed(() => ({
    'sf-pagination-item': true,
    'sf-pagination-item--active': props.value === props.activeIndex
  }));
}