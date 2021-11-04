/*
 * @Author: gyb
 * @Date: 2021-10-29
 * @Description: checkbox组件
 */

import type { CheckboxPublicProps } from './types';

import { computed, defineComponent, getCurrentInstance } from '@vue/composition-api';
import { checkboxProps } from './types';

export default defineComponent({
	name: 'SfCheckbox',
	props: checkboxProps,
	setup(props: CheckboxPublicProps) {
		const { onCheckboxChange } = useEvents();
		const classes = computed(() => {
			return {
				'sf-checkbox_inner': true,
				'sf-checkbox_inner--checked': props.checked,
				'sf-checkbox_inner--half': props.isHalf,
				'sf-checkbox_inner--disabled': props.disabled
			}
		});

		return () => {
			return (
				<label class="sf-checkbox">
					<span class={classes.value}></span>
					<input 
						class="sf-checkbox_input"
						type="checkbox"
						checked={props.checked}
						onChange={onCheckboxChange}
						disabled={props.disabled} />
				</label>
			)
		}
	}
});

function useEvents() {
	const vm = getCurrentInstance();
	const onCheckboxChange = (event: Event) => {
		const value = (event.target as HTMLInputElement).checked;
		vm?.emit('update:checked', value);
		vm?.emit('change', value);
	}
	return {
		onCheckboxChange
	}
}
