<script>
import debounce from "debounce";
import { getChildrenCount, getHeadData } from "../../../utils/header";
export default {
    name: "goodwe-table",
    data() {
        return {
            columns: [],
            realColumns: [],
            headerLevel: 1,
            rowcols: [],
            isMultiple: false,
            selectedIndex: -1
        };
    },
    props: {
        data: {
            tpye: Array,
            default: function() {
                return [];
            }
        },
        height: [String, Number],
        maxHeight: [String, Number],
        stripe: {
            tpye: Boolean,
            default: false
        },
        border: {
            tpye: Boolean,
            default: false
        },
        size: {
            type: String,
            validator(value) {
                return ["medium", "small", "mini"].indexOf(value) !== -1;
            }
        },
        fit: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false
        },
        currentRowKey: [String, Number],
        rowClassName: Function,
        rowStyle: [Function, Object],
        cellClassName: [Function, String],
        cellStyle: [Function, Object],
        headerRowClassName: [Function, String],
        headerRowStyle: [Function, String],
        headerCellClassName: [Function, String],
        headerCellStyle: [Function, Object],
        rowkey: [Function, String],
        emptyText: {
            type: String,
            default: "暂无数据"
        },
        defaultExpandAll: {
            type: Boolean,
            default: false
        },
        expandRowKeys: Array,
        defaultSort: Object,
        tooltipEffect: {
            type: String,
            validator(value) {
                return ["dark", "light"].indexOf(value) !== -1;
            }
        },
        showSummary: {
            type: Boolean,
            default: false
        },
        sumText: {
            type: String,
            default: "合计"
        },
        summaryMethod: Function,
        spanMethod: Function,
        selectOnIndeterminate: {
            type: Boolean,
            default: true
        },
        indent: {
            type: Number,
            default: 16
        },
        lazy: Boolean,
        load: Function,
        treeProps: Object
    },
    watch: {
        data() {
            this.selectedIndex = -1;
        },
        columns: {
            handler(v) {
                this.updateLayout();
            }
        },
        height: {
            handler(v) {
                if (v)
                    console.warn(
                        "[goodwe-table] does not support the height attribute"
                    );
            },
            immediate: true
        },
        maxHeight: {
            handler(v) {
                if (v)
                    console.warn(
                        "[goodwe-table] does not support the max-height attribute"
                    );
            },
            immediate: true
        }
    },
    methods: {
        getChildrenCount,
        getHeadData,
        remove(item) {
            var index = this.columns.indexOf(item);
            if (index > -1) {
                this.columns.splice(index, 1);
            }
        },
        add(item, index) {
            this.columns.splice(index, 0, item);
        },
        renderHeaderItem(column, idx) {
            var r = column;
            if (r.rowspan == 0 || r.colspan == 0) {
                return null;
            }
            return (
                <th rowspan={r.rowspan} colspan={r.colspan} class={{'goodwe-table__fixed': !!r.isFixed, 'goodwe-table__fixed--right': r.isFixed == 'right'}}>
                    {r.column.$scopedSlots.header
                        ? r.column.$scopedSlots.header({
                              column: r.column,
                              $index: idx
                          })
                        : r.label}
                </th>
            );
        },
        updateLayout: debounce(function() {
            this.getHeadData();
        }, 10),
        rowClick(row, column, rowIndex, colIndex, event) {
            var oldIndex = this.selectedIndex;
            this.selectedIndex = rowIndex;
            this.$emit("row-click", row, column.column, event);
            this.$emit("cell-click", row, column.column, event.target, event);
            this.$emit("current-change", row, (this.data || [])[oldIndex]);
        },
        tdCellStyle(row, column, rowIndex, colIndex) {
            var r = {};
            var c = column.column;
            if (c.width) {
                r.width = parseFloat(c.width) + "px";
            }
            if (c.minWidth) {
                r["min-width"] = parseFloat(c.minWidth) + "px";
            }
            return r;
        },
        tdStyle(row, column, rowIndex, colIndex) {
            var r = {};
            var c = column.column;
            if (c.width) {
                r.width = parseFloat(c.width) + "px";
            }
            return r;
        },
        scrollChange(event) {
            console.log(event);
        }
    },
    computed: {
        headerRender() {
            return this.rowcols.map(row => (
                <tr>{row.map((m, i) => this.renderHeaderItem(m, i))}</tr>
            ));
        },
        bodyRender() {
            if (this.data && this.data.length > 0) {
                return this.data.map((d, i) => (
                    <tr
                        class={[
                            this.highlightCurrentRow && i == this.selectedIndex
                                ? "selected"
                                : "",
                            this.rowClassName &&
                                this.rowClassName({ row: d, rowIndex: i })
                        ]}
                    >
                        {this.realColumns.map((c, idx) => {
                            var rowSpan = 1,
                                colSpan = 1;
                            if (this.spanMethod) {
                                var spanResult = this.spanMethod({
                                    row: d,
                                    coloumn: c.column,
                                    rowIndex: i,
                                    columnIndex: idx
                                });
                                if (Array.isArray(spanResult)) {
                                    [rowSpan, colSpan] = spanResult;
                                } else {
                                    rowSpan = spanResult.rowspan;
                                    colSpan = spanResult.colspan;
                                }
                            }

                            if (rowSpan == 0 || colSpan == 0) return null;

                            return (
                                <td
                                    rowspan={rowSpan}
                                    colspan={colSpan}
                                    on-click={e =>
                                        this.rowClick(d, c, i, idx, e)
                                    }
                                    style={this.tdStyle(d, c, i, idx)}
                                    class={{'goodwe-table__fixed': !!c.isFixed, 'goodwe-table__fixed--right': c.isFixed == 'right'}}
                                >
                                    <div
                                        class="goodwe-table-cell"
                                        style={this.tdCellStyle(d, c, i, idx)}
                                    >
                                        {c.column.$scopedSlots.default
                                            ? c.column.$scopedSlots.default({
                                                  row: d,
                                                  column: c.column,
                                                  $index: i
                                              })
                                            : d[c.column.prop]}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                ));
            } else {
                return (
                    <tr>
                        <td class="no-data" colspan={this.realColumns.length}>
                            暂无数据
                        </td>
                    </tr>
                );
            }
        }
    },
    beforeDestroy() {
        this.$refs.goodweTableWrapper.removeEventListener(
            "scroll",
            this.scrollChange
        );
    },
    mounted() {
        this.$refs.goodweTableWrapper.addEventListener(
            "scroll",
            this.scrollChange,
            false
        );
    },
    render() {
        var cls = ["goodwe-table"];
        if (this.stripe) {
            cls.push("goodwe-table__stripe");
        }
        if (this.border || this.isMultiple) {
            cls.push("goodwe-table__border");
        }

        return (
            <div class={cls} ref="goodweTableWrapper">
                <div>{this.$slots.default}</div>
                <table class="goodwe-table-table">
                    <thead>
                        {this.showHeader ? this.headerRender : null}
                    </thead>
                    <tbody>{this.bodyRender}</tbody>
                </table>
            </div>
        );
    }
};
</script>
<style lang="scss">
.goodwe-table {
    width: 100%;
    overflow: auto;
    position: relative;
    border: 1px solid #ebeef5;
    &-table {
        min-width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 14px;
        tr:hover {
            td {
                background-color: #f5f7fa;
            }
            &.selected {
                td {
                    background-color: #edf5ff;
                }
            }
        }
        tr.selected {
            td {
                background-color: #edf5ff;
            }
        }
        th {
            border-bottom: 1px solid #ebeef5;
            white-space: nowrap;
            padding: 15px 20px;
            color: #909399;
            background-color: #ffffff;
        }
        td {
            border-bottom: 1px solid #ebeef5;
            white-space: nowrap;
            color: #606266;
            background-color: #ffffff;
            padding: 0;
            &.no-data {
                height: 50px;
                text-align: center;
            }
        }
    }
    &-cell {
        box-sizing: border-box;
        padding: 16px 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    &__stripe {
        table {
            tbody {
                tr:nth-child(2n) {
                    td {
                        background-color: #fafafa;
                    }
                }
                tr:hover {
                    td {
                        background-color: #f5f7fa;
                    }
                    &.selected {
                        td {
                            background-color: #edf5ff;
                        }
                    }
                }
                tr.selected {
                    td {
                        background-color: #edf5ff;
                    }
                }
            }
        }
    }
    &__border {
        table {
            th,
            td {
                border: 1px solid #ebeef5;
                &:first-child {
                    border-left: none;
                }
                &:last-child {
                    border-right: 1px solid transparent;
                }
            }
            tr:first-child {
                th {
                    border-top: none;
                }
            }
            tr:last-child {
                td {
                    border-bottom: none;
                }
            }
        }
    }
    &__fixed {
        position: sticky;
        left: 0;
        &:after {
            content: ' ';
            display: block;
            position: absolute;
            width:30px;
            right:-30px;
            top:0;
            bottom:0;
            box-shadow: inset 10px 0 8px -8px rgba(0,0,0,.15)
        }
        &--right {
            left:auto;
            right: 0;
            &:after {
                right:auto;
                left:-30px;
                box-shadow: inset -10px 0 8px -8px rgba(0,0,0,.15)
            }
        }
    }
}
</style>