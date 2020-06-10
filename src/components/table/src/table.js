
import debounce from "debounce";
import { getHeadData } from "../../../utils/header";
import { getTableClass, getSpanValue } from './attrs';
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
            stickyData: [],
            colWidth: [],
            isLeftShadow: false,
            isRightShadow: false
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
            // 需要判断是否合并单元格
            if (c.width) {
                var [_, colspan] = getSpanValue.call(this, row, column, rowIndex, colIndex);
                if (colspan == 1)
                    r.width = parseFloat(c.width) - 1 + "px";
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
        setShadowStyle() {
            var l = this.$refs.goodweTableWrapper.scrollLeft;
            var r = this.$refs.goodweTableWrapper.scrollWidth - this.$refs.goodweTableWrapper.clientWidth - l;

            if(l == 0) {
                this.isLeftShadow = false;
            } else {
                this.isLeftShadow = true;
            }

            if(r == 0) {
                this.isRightShadow = false;
            } else {
                this.isRightShadow = true;
            }
        },
        scrollChange(event) {
            this.setShadowStyle();
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
        },
        colgroupRender() {
            return <colgroup>
                {
                    this.colWidth.map(m => (<col {...m}></col>))
                }
            </colgroup>
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
        this.setShadowStyle();
        // this.$refs.goodwe_table.style.width =  this.$refs.goodwe_table.offsetWidth + 'px'
    },
    render(h) {
        var cls = getTableClass.call(this);
        var tst = {};
        if(this.scroll) {
            tst.width = this.scroll + 'px';
        }
        return (
            <div class={cls}>
                <div ref="goodweTableWrapper">
                    <div class="goodwe-table-hidden">{this.$slots.default}</div>
                    <table ref="goodwe_table" class="goodwe-table-table" style={tst}>
                        {this.colgroupRender}
                        <thead>
                            {this.showHeader ? this.headerRender : null}
                        </thead>
                        <tbody>{this.bodyRender}</tbody>
                    </table>
                </div>
            </div>
        );
    }
};