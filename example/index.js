// Please start your performance

import Vue from 'vue';
import { Table as GoodweTable, TableColumn as GoodweTableColumn } from '../src/components/table';


var d = [
    {
        a: "钢铁是怎么炼成的",
        b: "43.00",
        c: "21.50",
        ms: "10.00",
        d: "https://item.jd.com/12586572.html",
        dd: "http://product.dangdang.com/24228859.html",
        sd: "新华书店"
    }, {
        a: "红与黑",
        b: "42.00",
        c: "37.80",
        ms: "10.00",
        d: "https://item.jd.com/12052514.html",
        dd: "http://product.dangdang.com/24228859.html",
        sd: "新华书店"
    }, {
        a: "茶花女",
        b: "32.80",
        c: "21.75",
        ms: "10.00",
        d: "https://item.jd.com/12586572.html",
        dd: "http://product.dangdang.com/24228859.html",
        sd: "新华书店"
    }, {
        a: "悲惨的世界",
        b: "77.20",
        c: "44.80",
        ms: "10.00",
        d: "https://item.jd.com/12586572.html",
        dd: "http://product.dangdang.com/24228859.html",
        sd: "新华书店"
    }
]

new Vue({
    el: '#app',
    data() {
        return {
            d: d,
            t: false,
            p: [
                {
                    a: "围城",
                    b:'钱钟书',
                    c:'47.00',
                    d: '人民文学出版社',
                    e: '2019-01-01',
                    f: '平装',
                    g: 240
                },
                {
                    a: '兄弟',
                    b:'余华',
                    c:'32.00',
                    d:'南海出版公司',
                    e: '2019-01-01',
                    f: '精装',
                    g: 300
                },
                {
                    a: '白鹿原',
                    b: '陈忠实',
                    c: '35.00',
                    d: '湖南文艺出版社',
                    e: '2019-01-01',
                    f: '礼盒',
                    g:400
                }
            ]
        }
    },
    components: {
        GoodweTable,
        GoodweTableColumn
    },
    methods: {
        cellclick(row, column, cell, event) {
            console.log(cell);
        },
        rowclassname(a) {
            if (a.rowIndex == 1) {
                return 'haha'
            }
        },
        spanColums({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 2 && columnIndex == 1) {
                return [1, 2];
            }
            if (rowIndex == 2 && columnIndex == 2) {
                return [0, 0];
            }
            return [1, 1]
        }
    },
    computed: {
        testRender() {
            return <div>
                {
                    this.isShowLst ? (<ul>
                        {this.lst.map(m => <li>{m}</li>)}
                    </ul>) : null
                }
            </div>
        }
    },
    mounted() {
        setTimeout(() => {
            this.isShowLst = true;
        }, 2000);
    },
    render(h) {
        return <div>
            <goodwe-table data={this.d} show-header={true}
                scroll={0}
                highlight-current-row={false}
                row-class-name={this.rowclassname}
                span-method={this.spanColums}
                on-cell-click={(row, col, cell, ev) => this.cellclick(row, col, cell, ev)}
                on-row-click={(row, column) => console.log(row, column)}
                stripe height="100px" max-height="200px">

                <goodwe-table-column label="书名" prop="a" width="200" fixed></goodwe-table-column>
                <goodwe-table-column label="售价" prop="c" fixed header-align="center"  align="center">
                    <goodwe-table-column label="原价" header-align="center"  align="center" width="100" prop="b" {
                        ...{
                            scopedSlots: {
                                'default': props => {
                                    return <div style="color:#999999;text-decoration:line-through">{props.row.b} 元</div>
                                },
                                header: props => {
                                    return <div style="color:#ff0000;font-weight:bold;font-style:italic">{props.column.label}++</div>
                                }
                            }
                        }
                    }>
                    </goodwe-table-column>
                    <goodwe-table-column label="会员" header-align="center"  align="center" prop="c" width="100"></goodwe-table-column>
                    {
                        this.t ? <goodwe-table-column label="秒杀" prop="ms"></goodwe-table-column> : null
                    }
                </goodwe-table-column>
                <goodwe-table-column label="购买方式">
                    <goodwe-table-column label="线上">
                        <goodwe-table-column label="京东" prop="d"></goodwe-table-column>
                        <goodwe-table-column label="当当" prop="dd" max-width="300"></goodwe-table-column>
                    </goodwe-table-column>
                    <goodwe-table-column label="线下" prop="sd">
                    </goodwe-table-column>
                </goodwe-table-column>
                <goodwe-table-column width="120" fixed="right" header-align="center" align="center" label="操作" {...{
                    scopedSlots: {
                        'default': props => {
                            return <div>
                                <button>编辑</button>
                                <button>删除</button>
                            </div>
                        }
                    }
                }}>

                </goodwe-table-column>
            </goodwe-table>
            <h3>Example</h3>
            <goodwe-table data={this.p}>
                <goodwe-table-column label="书名" width="120" fixed prop="a"></goodwe-table-column>
                <goodwe-table-column label="作者" prop="b"></goodwe-table-column>
                <goodwe-table-column label="价格" prop="c"></goodwe-table-column>
                <goodwe-table-column label="出版社" prop="d"></goodwe-table-column>
                <goodwe-table-column label="出版时间" prop="e"></goodwe-table-column>
                <goodwe-table-column label="包装" prop="f"></goodwe-table-column>
                <goodwe-table-column label="页数" prop="g"></goodwe-table-column>
            </goodwe-table>
        </div>
    }
})