export default {
    props: {
        data: {
            tpye: Array,
            default: function () {
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
    }
}