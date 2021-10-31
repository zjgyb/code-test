import { mount } from '@vue/test-utils'
import { SfPagination } from '../pagination'

describe('Pagination', () => {
    const PaginationMount = options => mount(SfPagination, options)

    test('render', () => {
        const wrapper = PaginationMount()
        expect(wrapper.html()).toMatchSnapshot()
        expect(() => {
            wrapper.vm.$forceUpdate()
            wrapper.vm.$destroy()
        }).not.toThrow()
    })

    test('click', async() => {
        const wrapper = PaginationMount({
            propsData: {
                current: 1,
                total: 200
            }
        });
        const pagers = wrapper.findAll('.sf-pagination-item');
        pagers.at(2).trigger('click');
        const emits = wrapper.emitted()['change'];
        expect(emits).toBeTruthy();
        wrapper.setProps({ current: emits[0][0] });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-pagination-item--active').text()).toBe('2');
    });

    test('hasPrev5', async() => {
        const wrapper = PaginationMount({
            propsData: {
                current: 5,
                total: 200
            }
        });
        const prev = wrapper.find('.sf-pagination-item_prev');
        expect(prev.exists()).toBeTruthy();
        prev.trigger('click');
        const emits = wrapper.emitted()['update:current'];
        expect(emits[0]).toEqual([1]);
        wrapper.setProps({ current: emits[0][0] });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-pagination-item--active').text()).toBe('1');
        expect(wrapper.find('.sf-pagination-item_prev').exists()).toBeFalsy();
    })

    test('hasNext5', async() => {
        const wrapper = PaginationMount({
            propsData: {
                current: 1,
                total: 100
            }
        });
        const prev = wrapper.find('.sf-pagination-item_next');
        expect(prev.exists()).toBeTruthy();
        prev.trigger('click');
        const emits = wrapper.emitted()['update:current'];
        expect(emits[0]).toEqual([6]);
        wrapper.setProps({ current: emits[0][0] });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-pagination-item--active').text()).toBe('6');
    })

    test('prev click', async() => {
        const wrapper = PaginationMount({
            propsData: {
                current: 1,
                total: 100
            }
        });
        let prevBtn = wrapper.find('.sf-pagination-item--disabled');
        expect(prevBtn.exists()).toBeTruthy()
        prevBtn.trigger('click');
        const emits = wrapper.emitted()['update:current'];
        expect(emits).toBeFalsy();
    });

    test('next click', async() => {
        const wrapper = PaginationMount({
            propsData: {
                current: 10,
                total: 100
            }
        });
        let nextBtns = wrapper.find('.sf-pagination-item--disabled');
        expect(nextBtns.exists()).toBeTruthy()
        nextBtns.trigger('click');
        const emits = wrapper.emitted()['update:current'];
        expect(emits).toBeFalsy();
    })
})