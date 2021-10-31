## 使用教程

### 基本用法

```vue
<template>
    <TestTable :columns="columns" 
               :data="data" />
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age',
  },
  {
    title: 'Address',
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
    <TestTable :columns="columns" :data="data" :pagination="pagination" />
  </div>
</template>

<script lang="ts">
import { TestTable } from "../src/table";
import { defineComponent, reactive, ref, Ref } from "@vue/composition-api";

const columns = [
  {
    title: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age',
  },
  {
    title: 'Address',
    key: 'address',
  }
];
export default defineComponent({
  name: "App",
  components: {
    TestTable
  },
  setup() {
    const tableData: Ref<AnyObject[]> = ref([]);
    const pagination = reactive({
      total: 10
    });
    const fetchData = async (pageOpt?: any, sortField?: any) => {
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
               :data="data" />
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
    key: 'name',
		sortable: true
  },
  {
    title: 'Age',
    key: 'age',
  },
  {
    title: 'Address',
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
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age',
  },
  {
    title: 'Address',
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

### 可选择

```vue
<template>
    <div>
      <TestTable ref="table"
							 :columns="columns" 
               :data="data"
							 selectable />
      <button @click="onTest">test</button>
    </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent, ref } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age',
  },
  {
    title: 'Address',
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
		const table = ref(null);
		const onTest = () => {
			console.log(table.value?.getAllSelections())
		}
    return { columns, data, table, onTest }
  },
})
</script>
```

## 隐藏分页、隐藏表头、包含边框、自定义高度

```vue
<template>
    <div>
      <TestTable :columns="columns" 
                 :data="data"
                 :has-border="false"
                 :has-header="false"
                 :pagination="false"
                 :rowHeight="64" />
    </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age',
  },
  {
    title: 'Address',
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

### 虚拟列表

```vue
<template>
    <div>
      <TestTable :columns="columns" 
                 :data="data"
                 :pagination="false"
                 bufferview />
    </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table';
import { defineComponent } from '@vue/composition-api';

const columns = [
  {
    title: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age',
  },
  {
    title: 'Address',
    key: 'address',
  }
];
let data: any[] = [];
for(let i = 0; i < 10000; i++) {
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