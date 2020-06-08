# goodwe-table

[![image](https://img.shields.io/npm/v/goodwe-table.svg)](https://www.npmjs.com/package/goodwe-table)
[![](https://img.shields.io/npm/l/goodwe-table.svg)](https://www.npmjs.com/package/goodwe-table)
[![](https://img.shields.io/github/issues/everygit/goodwe-table)](https://github.com/everygit/goodwe-table/issues)

goodwe table, Extend the elmentUI

## Install

```sh
npm install goodwe-table
```

## Example

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
show-header|	是否显示表头|	boolean|	—|	true
highlight-current-row|	是否要高亮当前行|	boolean| —|	false
row-class-name|	行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。|	Function({row, rowIndex})/String|	—|	—
span-method	|合并行或列的计算方法|	Function({ row, column, rowIndex, columnIndex })|	—|	—

## Table-column Scoped Slot

name | 说明
-|-
--| 自定义列的内容，参数为 { row, column, $index }
header | 自定义表头的内容. 参数为 { column, $index }

## Table Events

事件名 |	说明|	参数
-|-|-
cell-click|	当某个单元格被点击时会触发该事件	|row, column, cell, event
row-click|	当某一行被点击时会触发该事件|	row, column, event
current-change	|当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性	|currentRow, oldCurrentRow