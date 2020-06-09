
import debounce from "debounce";
import { getChildrenCount, getHeadData } from "../../../utils/header";
import * as attrs from './attrs';
import props from './table-props';
import '../../../base.scss'
export default {
    name: "goodwe-table",
    mixins: [props],
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
        renderHeaderItem(column, idx) {
            var r = column;
            if (r.rowspan == 0 || r.colspan == 0) {
                return null;
            }
            return (
                <th rowspan={r.rowspan} colspan={r.colspan} class={{ 'goodwe-table__fixed': !!r.isFixed, 'goodwe-table__fixed--right': r.isFixed == 'right' }}>
                    {r.column.$scopedSlots.header
                        ? r.column.$scopedSlots.header({
                            column: r.column,
                            $index: idx
                        })
                        : r.label}
                </th>
            );
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
                return this.data.map((d, i) => (
                    <tr class={attrs.getTableBodyTrClass.call(this, d, i)}>
                        {this.realColumns.map((c, idx) => {
                            if (attrs.isHiddenTd.call(this, d, c.column, i, idx)) return null;
                            return (
                                <td  {...attrs.getTableTdAttributes.call(this, d, c, i, idx)}>
                                    <div class="goodwe-table-cell" style={this.tdCellStyle(d, c, i, idx)}>
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
    updated() {
        // var allTDs = this._vnode.elm.querySelectorAll(".goodwe-table__fixed");
        // allTDs.forEach(m => {
        //     var isRight = m.classList.contains("goodwe-table__fixed--right");
        //     if (!isRight) {
        //         m.style.left = m.offsetLeft + 'px';
        //     } else {
        //         var r = this._vnode.elm.scrollWidth - m.offsetLeft - m.offsetWidth;
        //         m.style.right = r + 'px';
        //     }
        // })
    },
    render(h) {
        var cls = attrs.getTableClass.call(this);
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