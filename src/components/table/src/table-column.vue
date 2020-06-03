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
        }
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
            while (r && r.$options.name == "goodwe-table-column") {
                r = r.$parent;
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