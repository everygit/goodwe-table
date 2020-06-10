
import debounce from "debounce";
import { getHeadData } from "../../../utils/header";
import { getTableClass } from './attrs';
import props from './table-props';
import render from './table-render';
import '../../../base.scss'
export default {
    name: "goodwe-table",
    mixins: [props, render],
    data() {
        return {
            columns: [],
            realColumns: [],
            headerLevel: 1,
            rowcols: [],
            isMultiple: false,
            selectedIndex: -1,
            stickyData: []
        };
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
        updateLayout: debounce(function () {
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
            if (c.minWidth) {
                r["min-width"] = parseFloat(c.minWidth) + "px";
            }
            if (c.width) {
                r.width = parseFloat(c.width) + "px";
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
            // console.log(event);
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
                return this.data.map((d, i) => this.bodyTrRender(d, i));
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
    updated() {
    },
    render(h) {
        var cls = getTableClass.call(this);
        return (
            <div class={cls} ref="goodweTableWrapper">
                <div class="goodwe-table-hidden">{this.$slots.default}</div>
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