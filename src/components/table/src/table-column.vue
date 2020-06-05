<script>
var columnID = 10;
export default {
    name: "goodwe-table-column",
    data() {
        return {
            columns: [],
            id: null
        };
    },
    props: {
        label: {
            type: String,
            default: ""
        },
        prop: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            validator(value) {
                return ["selection", "index", "expand"].indexOf(value) !== -1;
            }
        },
        index: [Number, Function],
        columnKey: String,
        width: String,
        minWidth: String,
        maxWidth: String,
        fixed: {
            type: [Boolean, String],
            validator(value) {
                return [true, false, "left", "right"].indexOf(value) !== -1;
            }
        },
        renderHeader: Function,
        sortable: {
            type: [String, Boolean],
            default: false,
            validator(value) {
                return [true, false, "custom"].indexOf(value) !== -1;
            }
        },
        sortMethods: Function,
        sortBy: [String, Array, Function],
        sortOrders: {
            type: Array,
            default: function() {
                return ["ascending", "descending", null];
            }
        },
        resizable: {
            type: Boolean,
            default: true
        },
        formatter: Function,
        showOverflowTooltip: {
            type: Boolean,
            default: false
        },
        align: {
            type: String,
            default: "left",
            validator(value) {
                return ["left", "center", "right"].indexOf(value) !== -1;
            }
        },
        headerAlign: {
            type: String,
            validator(value) {
                return ["left", "center", "right"].indexOf(value) !== -1;
            }
        },
        className: String,
        labelClassName: String,
        selectable: Function,
        reserveSelection: {
            type: Boolean,
            default: false
        },
        filters: Array,
        filterPlacement: String,
        filterMultiple: {
            type: Boolean,
            default: true
        },
        filterMethod: Function,
        filteredValue: Array
    },
    methods: {
        remove(item) {
            var index = this.columns.indexOf(item);
            if (index > -1) {
                this.columns.splice(index, 1);
            }
        },
        add(item, index) {
            this.columns.splice(index, 0, item);
        }
    },
    computed: {
        table() {
            var r = this;
            while (r) {
                if(r.$options.name == "goodwe-table") {
                    break;
                }
                r = r.$parent;
            }
            return r;
        },
        parentColumn() {
            var r = this;
            while(r) {
                r = r.$parent;
                if(r.$options.name == 'goodwe-table-column' || r.$options.name == 'goodwe-table') break;
            }
            return r;
        }
    },
    created() {
        this.id = columnID++;
        var index = this.$parent.$children.indexOf(this);
        this.$parent.add && this.$parent.add(this, index);
        this.table.updateLayout();
    },
    beforeDestroy() {
        this.$parent.remove && this.$parent.remove(this);
        this.table.updateLayout();
    },
    render() {
        return <div>{this.$slots.default}</div>;
    }
};
</script>