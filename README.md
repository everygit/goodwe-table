# goodwe-table

goodwe table, Extend the elmentUI

## install

```sh
npm install goodwe-table
```

## example

```js
import {Table as GoodweTable, TableColumn as GoodweTableColumn} from 'goodwe-table';

export default {
    data() {
        return {
            data: {
                name: 'jack',
                age: 18,
            },
            {
                name: 'justin',
                age: 19,
            }
        }
    }
    components: {
        GoodweTable,
        GoodweTableColumn
    },
    render() {
        return <goodwe-table data={}>
            <goodwe-table-column label="student name" prop="name">
            </goodwe-table-column>
            <goodwe-table-column label="student age" prop="age">
            </goodwe-table-column>
        </goodwe-table>
    }
}
```

## goodwe-table Attributes

 参数|说明|类型|可选值|默认值
 -|-|-|-|-
 data|显示的数据|array|-|-
 height|暂不支持|string / number|-|-
 max-height|暂不支持|string / number |-|-
 stripe|是否为斑马纹 table|boolean|-|false
 border|是否带有纵向边框。 多级表头时固定为true|boolean|-|false