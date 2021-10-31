import { mount } from '@vue/test-utils'
import { SfCheckbox } from '../form/checkbox'

describe('Pagination', () => {
    const CheckboxMount = options => mount(SfCheckbox, options)

    test('render', () => {
        const wrapper = CheckboxMount()
        expect(wrapper.html()).toMatchSnapshot()
        expect(() => {
            wrapper.vm.$forceUpdate()
            wrapper.vm.$destroy()
        }).not.toThrow()
    });

    test('checked', async() => {
        const wrapper = CheckboxMount({
            propsData: {
                checked: false
            }
        })
        const checkbox = wrapper.find('.sf-checkbox input');
        expect(checkbox.exists()).toBeTruthy();
        await checkbox.setChecked();
        expect(checkbox.element.checked).toBeTruthy();
    });

    test('half checked', async() => {
        const wrapper = CheckboxMount({
            propsData: {
                checked: false,
                isHalf: true
            }
        })
        const checkbox = wrapper.find('.sf-checkbox_inner--half');
        expect(checkbox.exists()).toBeTruthy();
    });
})