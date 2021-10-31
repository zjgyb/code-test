<template>
  <div>
    <h2>基本用法</h2>
    <TestTable :columns="columns" :data="data" />
    <h2>远程加载</h2>
    <TestTable :columns="columns" :data="data1" :pagination="pagination" @change="fetchData" />
    <h2>排序</h2>
    <TestTable :columns="columns2" :data="data" />
    <h2>插槽</h2>
    <TestTable :columns="columns" 
               :data="data">
      <template #header="{column}">
        <template v-if="column.key === 'age'">
          年龄
        </template>
      </template>
      <template #body="{ record, column }">
        <template v-if="column.key === 'age'">
          {{ record.age }} 岁
        </template>
      </template>
			<template #empty>无数据</template>
    </TestTable>
    <h2>可选择</h2>
    <TestTable :columns="columns" 
               :data="data"
							 selectable />
    <h2>隐藏分页、隐藏表头、自定义高度</h2>
    <TestTable :columns="columns" 
               :data="data"
               :has-header="false"
               :pagination="false"
               rowHeight="lg" />
    
    <SfPagination :current.sync="current" :total="total" />
    <SfCheckbox :checked.sync="checked" />
  </div>
</template>

<script lang="ts">
import { TestTable } from "../src/table";
import { defineComponent, reactive, ref, Ref } from "@vue/composition-api";
import { columns, data } from "./const";
import { cloneDeep } from "lodash-es";
import { SfPagination } from '../src/pagination';
import { SfCheckbox } from '../src/form/checkbox';
import { Pagination } from "src/table/types";

const columnSortable = cloneDeep(columns);
columnSortable[0].sortable = true;

export default defineComponent({
  name: "App",
  components: {
    TestTable,
    SfPagination,
    SfCheckbox
  },
  setup() {
    const tableData: Ref<AnyObject[]> = ref([]);
    // const table = ref(null);
    const pagination = ref<Partial<Pagination> | false>({
      total: 10,
    });
    const fetchData = async (pageOpt?: any, sortField?: any) => {
      console.log(pageOpt, sortField);
      // 传分页与排序相关的字段
      let { total, data } = await Promise.resolve().then(() => {
        let testData: any[] = [];
        for (let i = 0; i < 10; i++) {
          testData.push({
            name: "John Brown" + i,
            age: i,
            address: `New York No. ${i} Lake Park`,
          });
        }
        return {
          data: testData,
          total: 200,
        };
      });

      tableData.value = data;
      if (pagination.value) {
        pagination.value.total = total;
      }
    };

    setTimeout(() => {
      pagination.value = false;
    }, 3000)

    const current = ref(1);
    const total = ref(100);
    const checked = ref(false);

    // fetchData();
    return {
      columns,
      data,
      data1: tableData,
      fetchData,
      pagination,
      columns2: columnSortable,
      current,
      total,
      checked
    };
  },
});
</script>