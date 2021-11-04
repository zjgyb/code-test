import { mount } from '@vue/test-utils'
import { cloneDeep } from 'lodash-es';
import { TestTable } from '../table'

export const columns = [{
        title: 'name1111111111111111111111111111111111111111111111111',
        dataIndex: 'name',
        key: 'name',
        sortable: true
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    }
];

let testData = [];
for (let i = 0; i < 100; i++) {
    testData.push({
        name: 'John Brown' + i,
        age: i,
        address: `New York No. ${i} Lake Park`
    })
}
export const data = testData;

describe('Table', () => {
    const TableMount = options => mount(TestTable, options)

    test('render', () => {
        const wrapper = TableMount()
        expect(wrapper.html()).toMatchSnapshot()
        expect(() => {
            wrapper.vm.$forceUpdate()
            wrapper.vm.$destroy()
        }).not.toThrow()
    });

    test('props columns', async() => {
        const wrapper = TableMount({
            propsData: {
                data,
                columns
            },
        });
        expect(wrapper.find('.sf-table-cell-title').text()).toBe(columns[0].title);
        wrapper.setProps({ columns: cloneDeep(columns).reverse() });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-table-cell-title').text()).toBe(columns[columns.length - 1].title);
    });

    test('props empty data', async() => {
        const wrapper = TableMount({
            propsData: {
                data: [],
                columns
            },
        });

        expect(wrapper.find('.sf-table-placeholder').exists()).toBeTruthy();
        wrapper.setProps({ data });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-table-placeholder').exists()).toBeFalsy();
    });

    test('props emptyText', () => {
        const wrapper = TableMount({
            propsData: {
                data: [],
                columns,
                emptyText: 'No'
            },
        })
        expect(wrapper.find('.sf-table-placeholder .sf-table-cell').text()).toEqual('No')
    });

    test('sortable', async() => {
        const wrapper = TableMount({
            propsData: {
                data: [],
                columns,
            }
        });
        expect(wrapper.find('.sf-table-sorter').exists()).toBeTruthy();
        const sortHeader = wrapper.find('.sf-table-thead .sf-table-cell');
        sortHeader.trigger('click');
        expect(wrapper.find('.fa-sort-up').exists()).toBeTruthy();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.fa-sort-up.sf-table-sorter--active').exists()).toBeTruthy();
        sortHeader.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-table-sorter .fa-sort-down.sf-table-sorter--active').exists()).toBeTruthy();
        await wrapper.vm.$nextTick();
        sortHeader.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-table-sorter .sf-table-sorter--active').exists()).toBeFalsy();
    });

    test('pagination', async() => {
        let testData = [];
        for (let i = 0; i < 100; i++) {
            testData.push({
                name: 'John Brown' + i,
                age: i,
                address: `New York No. ${i} Lake Park`
            })
        }
        const wrapper = TableMount({
            propsData: {
                data: testData,
                columns,
                pagination: {
                    current: 1
                }
            }
        });
        expect(wrapper.find('.sf-table-pagination').exists()).toBeTruthy()
        const nextBtns = wrapper.findAll('.sf-pagination-item')
        nextBtns.at(nextBtns.length - 1).trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-pagination-item--active').text()).toEqual('2');
        wrapper.setProps({ pagination: { current: 3 } });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-pagination-item--active').text()).toEqual('3');

        wrapper.setProps({ pagination: false });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-table-pagination').exists()).toBeFalsy();
    });

    test('pagination empty', async() => {
        let testData = [];
        for (let i = 0; i < 100; i++) {
            testData.push({
                name: 'John Brown' + i,
                age: i,
                address: `New York No. ${i} Lake Park`
            })
        }
        const wrapper = TableMount({
            propsData: {
                data: testData,
                columns,
                pagination: false
            }
        });
        expect(wrapper.find('.sf-table-pagination').exists()).toBeFalsy()
        expect(wrapper.findAll('tbody tr').length).toBe(testData.length);
    });

    test('slots empty', () => {
        const emptySlots = {
            template: `<span class="test-empty">HaHaHa</span>`
        }
        const wrapper = TableMount({
            propsData: {
                data: [],
                columns,
            },
            slots: {
                empty: emptySlots
            }
        });
        expect(wrapper.html()).toContain(emptySlots.template)
        expect(wrapper.find('.test-empty').exists()).toBeTruthy()
        expect(wrapper.find('.test-empty').text()).toEqual('HaHaHa')
    });

    test('slots header', () => {
        const headerSlots = `
              <template v-if="column.key === 'name'">
                <span class="test-header">
                  test
                </span>
              </template>
          `;

        const wrapper = TableMount({
            propsData: {
                data: [],
                columns,
            },
            scopedSlots: {
                header: `<template slot-scope="{column}">${headerSlots}</template>`
            }
        });

        expect(wrapper.find('.test-header').exists()).toBeTruthy();
        expect(wrapper.find('.test-header').text()).toEqual('test');
    });

    test('table header hide', async() => {
        const wrapper = TableMount({
            propsData: {
                data,
                columns,
                hasHeader: false
            },
        });
        expect(wrapper.find('.sf-table-thead').exists()).toBeFalsy();
        wrapper.setProps({ hasHeader: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-table-thead').exists()).toBeTruthy();
    });

    test('slots body', async() => {
        const bodySlots = `
              <template v-if="column.key === 'name'">
                <span class="test-body">
                  test
                </span>
              </template>
          `;

        const wrapper = TableMount({
            propsData: {
                data,
                columns,
            },
            scopedSlots: {
                body: `<template slot-scope="{column}">${bodySlots}</template>`
            }
        });

        expect(wrapper.find('.test-body').exists()).toBeTruthy();
        expect(wrapper.find('.test-body').text()).toEqual('test');
    });

    test('table selectable', async() => {
        const wrapper = TableMount({
            propsData: {
                data,
                columns,
                selectable: true
            },
        });

        const bodyCheckbox = wrapper.find('tbody .sf-checkbox');
        const headerCheckbox = wrapper.find('thead .sf-checkbox');
        expect(bodyCheckbox.exists()).toBeTruthy();
        const bodyCheckboxInput = bodyCheckbox.find('input');
        expect(bodyCheckboxInput.exists()).toBeTruthy();

        // body checkbox checked
        await bodyCheckboxInput.setChecked();
        expect(bodyCheckboxInput.element.checked).toBeTruthy();
        expect(wrapper.emitted().select).toBeTruthy();
        expect(wrapper.emitted().select[0].length).toBe(2);
        expect(wrapper.emitted().select[0][0]).toEqual([{...data[0], selected: true }]);
        const headerCheckboxInput = headerCheckbox.find('input');
        expect(headerCheckboxInput.exists()).toBeTruthy();
        await headerCheckboxInput.setChecked();
        expect(headerCheckboxInput.element.checked).toBeTruthy();
    });

    test('table rowHeight', async() => {
        const wrapper = TableMount({
            propsData: {
                data,
                columns,
                rowHeight: 64
            },
        });
        const td = wrapper.find('tbody td');
        expect(td.attributes().style).toContain('64px');
        wrapper.setProps({ rowHeight: 'lg' });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.sf-table-cell--lg')).toBeTruthy();
    });
})