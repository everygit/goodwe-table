<script>
import debounce from "debounce";
export default {
    name: "goodwe-table",
    data() {
        return {
            columns: [],
            realColumns: [],
            headerLevel: 1,
            rowcols: []
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
        rowClassName: [Function, String],
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
            var _getHeadData = function _getHeadData(
                columns,
                curLevel,
                parent
            ) {
                columns.forEach((m, i) => {
                    if (m.columns.length > 0) {
                        _getHeadData(m.columns, curLevel + 1, m);
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
        renderHeaderItem(column) {
            var r = column;
            if (r.rowspan == 0 || r.colspan == 0) {
                return null;
            }
            return (
                <th rowspan={r.rowspan} colspan={r.colspan}>
                    {r.label}
                </th>
            );
        },
        updateLayout: debounce(function() {
            this.getHeadData();
        }, 10)
    },
    computed: {
        headerRender() {
            return this.rowcols.map(row => (
                <tr>{row.map(m => this.renderHeaderItem(m))}</tr>
            ));
        },
        bodyRender() {
            if (this.data.length > 0) {
                return this.data.map((d, i) => (
                    <tr>
                        {this.realColumns.map(c => (
                            <td>{d[c.column.prop]}</td>
                        ))}
                    </tr>
                ));
            } else {
                return (
                    <tr>
                        <td class="no-data" colspan="6">
                            暂无数据
                        </td>
                    </tr>
                );
            }
        }
    },
    mounted() {
        console.log(this.data);
    },
    render() {
        return (
            <div class="goodwe-table">
                <div>{this.$slots.default}</div>
                <table class="goodwe-table-table">
                    <thead>{this.headerRender}</thead>
                    <tbody>{this.bodyRender}</tbody>
                </table>
            </div>
        );
    }
};
</script>
<style lang="scss">
.goodwe-table {
    &-table {
        min-width: 100%;
        border-collapse: collapse;
        th {
            border: 1px solid #dddddd;
            white-space: nowrap;
            padding: 15px 20px;
        }
        td {
            border: 1px solid #dddddd;
            padding: 16px 15px;
            // word-wrap: break-word;
            // word-break: break-all;
            white-space: nowrap;
            &.no-data {
                height: 50px;
                text-align: center;
            }
        }
    }
}
</style>