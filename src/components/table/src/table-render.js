import * as attrs from './attrs';

export default {
    methods: {
        renderHeaderItem(column, idx) {
            var r = column;
            if (r.rowspan == 0 || r.colspan == 0) return null;
            var attr = {
                attrs: {
                    rowspan: r.rowspan,
                    colspan: r.colspan
                },
                'class': [],
                style: {}
            };

            attrs.thTdStickySetting.call(this, attr, r.colspan, idx);

            return (
                <th {...attr}>
                    {r.column.$scopedSlots.header
                        ? r.column.$scopedSlots.header({
                            column: r.column,
                            $index: idx
                        })
                        : r.label}
                </th>
            );
        },
        bodyTrRender(row, rowIndex) {
            return (<tr class={attrs.getTableBodyTrClass.call(this, row, rowIndex)}>
                {this.realColumns.map((columnContainer, columnIndex) => this.tdRender(row, columnContainer, rowIndex, columnIndex))}
            </tr>)
        },
        tdRender(row, columnContainer, rowIndex, columnIndex) {
            if (attrs.isHiddenTd.call(this, row, columnContainer.column, rowIndex, columnIndex)) return null;
            return (
                <td  {...attrs.getTableTdAttributes.call(this, row, columnContainer, rowIndex, columnIndex)}>
                    <div class="goodwe-table-cell" style={this.tdCellStyle(row, columnContainer, rowIndex, columnIndex)}>
                        {columnContainer.column.$scopedSlots.default
                            ? columnContainer.column.$scopedSlots.default({
                                row,
                                column: columnContainer.column,
                                $index: rowIndex
                            })
                            : row[columnContainer.column.prop]}
                    </div>
                </td>
            );
        }
    }
}


