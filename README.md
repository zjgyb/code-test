## 接口文档

### props

| name | type | description |
|:---|:---|:---|
| column | array | 表头定义 |
| data | array | 表格数据定义
| pagination | object | 分页相关
| emptyText | string | 空数据提示文本

### slots

| name | description |
|:---|:---|
empty | 空状态
header | 表头相关
body | 表格主体相关

### methods

name | description |
|:---|:---|
change | 分页数据或排序时变动

## 使用教程

### 基本用法

```vue
<template>
    <TestTable :columns="columns" 
               :data="data"
               :pagination="pagination" />
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name'
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
let data: any[] = [];
for(let i = 0; i < 100; i++) {
  data.push({
    name: `test${i}`,
    age: i,
    address: `test${i}`
  })
}
export default defineComponent({
  name: 'App',
  components: {
    TestTable
  },
  setup() {
    return { columns, data }
  },
})
</script>
```

### 远程加载

```vue
<template>
  <div>
    <TestTable :columns="columns" :data="data" :pagination="pagination">
    </TestTable>
  </div>
</template>

<script lang="ts">
import { TestTable } from "../src/table";
import { SfPagination } from "../src/pagination";
import { defineComponent, reactive, ref, Ref } from "@vue/composition-api";

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name'
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
export default defineComponent({
  name: "App",
  components: {
    TestTable,
    SfPagination,
  },
  setup() {
    const tableData: Ref<AnyObject[]> = ref([]);
    const pagination = reactive({
      total: 10
    });
    const fetchData = async (pagOpt?: any, sortField?: any) => {
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
      pagination.total = total;
    };

    fetchData();
    const current = ref(1);
    const total = 20;

    return { columns, data: tableData, fetchData, pagination, current, total };
  },
});
</script>
```

### 排序
```vue
<template>
    <TestTable :columns="columns" 
               :data="data"
               :pagination="pagination" />
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
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
let data: any[] = [];
for(let i = 0; i < 100; i++) {
  data.push({
    name: `test${i}`,
    age: i,
    address: `test${i}`
  })
}
export default defineComponent({
  name: 'App',
  components: {
    TestTable
  },
  setup() {
    return { columns, data }
  },
})
</script>
```

### 插槽

```vue
<template>
    <TestTable :columns="columns" 
               :data="data"
               :pagination="pagination">
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
    </TestTable>
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name'
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
let data: any[] = [];
for(let i = 0; i < 100; i++) {
  data.push({
    name: `test${i}`,
    age: i,
    address: `test${i}`
  })
}
export default defineComponent({
  name: 'App',
  components: {
    TestTable
  },
  setup() {
    return { columns, data }
  },
})
</script>
```