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
        dd:"http://product.dangdang.com/24228859.html",
        sd:"新华书店"
    }, {
        a: "红与黑",
        b: "42.00",
        c: "37.80",
        ms: "10.00",
        d: "https://item.jd.com/12052514.html",
        dd:"http://product.dangdang.com/24228859.html",
        sd:"新华书店"
    }, {
        a: "茶花女",
        b: "32.80",
        c: "21.75",
        ms: "10.00",
        d: "https://item.jd.com/12586572.html",
        dd:"http://product.dangdang.com/24228859.html",
        sd:"新华书店"
    }, {
        a: "悲惨的世界",
        b: "77.20",
        c: "44.80",
        ms: "10.00",
        d: "https://item.jd.com/12586572.html",
        dd:"http://product.dangdang.com/24228859.html",
        sd:"新华书店"
    }
]

new Vue({
    el: '#app',
    data() {
        return {
            d,
            t: false
        }
    },
    components: {
        GoodweTable,
        GoodweTableColumn
    },
    mounted() {
        setTimeout(() => {
            this.t = true
        }, 3000);
        setTimeout(() => {
            this.t = false
        }, 8000);
    },
    render(h) {
        return <div>
            <goodwe-table data={this.d}>
                <goodwe-table-column label="书名" prop="a"></goodwe-table-column>
                <goodwe-table-column label="售价" prop="c">
                    <goodwe-table-column label="原价" prop="b"></goodwe-table-column>
                    <goodwe-table-column label="会员" prop="c"></goodwe-table-column>
                    {
                        this.t ? <goodwe-table-column label="秒杀" prop="ms"></goodwe-table-column> : null
                    }
                </goodwe-table-column>
                <goodwe-table-column label="购买方式">
                    <goodwe-table-column label="线上">
                        <goodwe-table-column label="京东" prop="d"></goodwe-table-column>
                        <goodwe-table-column label="当当" prop="dd"></goodwe-table-column>
                    </goodwe-table-column>
                    <goodwe-table-column label="线下" prop="sd">
                    </goodwe-table-column>
                </goodwe-table-column>
            </goodwe-table>
        </div>
    }
})