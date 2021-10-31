/*
 * @Author: gyb
 * @Date: 2021-10-14 22:05:08
 * @Description: 用于表格初始数据的常量文件
 */
import type { TableColumn } from 'src/table/types';

export const columns: TableColumn[] = [
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

let testData = [];
for(let i = 0; i < 100; i++) {
  testData.push({
    name: 'John Brown' + i,
    age: i,
    address: `New York No. ${i} Lake Park`
  })
}
export const data = testData;