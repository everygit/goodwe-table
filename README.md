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