<script>
import debounce from "debounce";
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
        getChildrenCount(columns) {
            var l = 0;
            var _getChildrenCount = function(c) {
                if (c.length == 0) {
                    l++;
                } else {
                    c.forEach(m => {
                        if (m.columns.length > 0) {
                            _getChildrenCount(m.columns);
                        } else {
                            l++;
                        }
                    });
                }
            };
            _getChildrenCount(columns);
            return l;
        },
        getHeadData() {
            // 所有的列
            var allColumns = [];
            // 层级
            var level = 1;
            var isMultiple = false;
            var _getHeadData = function _getHeadData(
                columns,
                curLevel,
                parent
            ) {
                columns.forEach((m, i) => {
                    if (m.columns.length > 0) {
                        _getHeadData(m.columns, curLevel + 1, m);
                        isMultiple = true;
                    } else {
                        level = Math.max(level, curLevel);
                        allColumns.push({
                            level: curLevel,
                            column: m,
                            parent: parent
                        });
                    }
                });
            }.bind(this);
            _getHeadData(this.columns, 0);
            this.realColumns = allColumns;
            this.headerLevel = level;
            this.isMultiple = isMultiple;
            var rowcols = [];
            var hasColspan = {};
            for (var i = level; i >= 0; i--) {
                var r = [];
                var pre = rowcols[i + 1] || allColumns;
                pre.forEach((m, idx) => {
                    var c = m.column;
                    var p = m.parent;
                    var l = m.level;
                    var rowspan = 1;
                    var colspan = 1;
                    if (i < m.level) {
                        c = m.parent;
                        p = c.$parent;
                    }
                    if (i == l) {
                        rowspan = this.headerLevel - l + 1;
                    } else {
                        if (i > l) {
                            rowspan = 0;
                        }
                    }
                    if (hasColspan[i + "_" + c.id]) {
                        colspan = 0;
                    } else {
                        colspan = this.getChildrenCount(c.columns);
                        hasColspan[i + "_" + c.id] = true;
                    }
                    r[r.length] = {
                        row: i,
                        col: idx,
                        column: c,
                        parent: p,
                        level: l,
                        label: c.label,
                        rowspan,
                        colspan
                    };
                });
                rowcols[i] = r;
            }
            this.rowcols = rowcols;
        },
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
                <th rowspan={r.rowspan} colspan={r.colspan}>
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
            if(c.minWidth) {
                r['min-width'] = parseFloat(c.minWidth) + 'px';
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
                        {this.realColumns.map((c, idx) => (
                            <td on-click={e => this.rowClick(d, c, i, idx, e)} style={this.tdStyle(d,c,i,idx)}>
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
                        ))}
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
    mounted() {
        // console.log(this.data);
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
            <div class={cls}>
                <div>{this.$slots.default}</div>
                <table class="goodwe-table-table">
                    <thead>{this.showHeader ? this.headerRender : null}</thead>
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
        }
        td {
            border-bottom: 1px solid #ebeef5;
            white-space: nowrap;
            color: #606266;
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
                    border-left:none;
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
}
</style>