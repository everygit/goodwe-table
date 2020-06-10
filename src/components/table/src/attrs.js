/**
 * get table's class list
 */
export function getTableClass() {
    var cls = ["goodwe-table"];
    if (this.stripe) {
        cls.push("goodwe-table__stripe");
    }
    if (this.border || this.isMultiple) {
        cls.push("goodwe-table__border");
    }
    return cls;
}

/**
 * get class of tr
 * @param {Object} row table row's data
 * @param {Number} rowIndex the index of tr rows
 */
export function getTableBodyTrClass(row, rowIndex) {
    var cls = [];
    if (this.highlightCurrentRow && rowIndex == this.selectedIndex) {
        cls.push('selected');
    }
    if (this.rowClassName) {
        cls.push(this.rowClassName({ row, rowIndex }))
    }
    return cls;
}

export function getTableTdAttributes(row, columnContainer, rowIndex, columnIndex) {
    var a = [...arguments];
    var [rowspan, colspan] = getSpanValue.call(this, row, columnContainer.column, rowIndex, columnIndex);
    var ret = {};
    ret.attrs = { rowspan, colspan };
    ret.on = {
        click: e => this.rowClick.apply(this, [...a, e])
    };
    ret.style = this.tdStyle.apply(this, a);
    ret['class'] = [];
    thTdStickySetting.call(this, ret, colspan, columnIndex);
    return ret;
}


export function isHiddenTd(row, column, rowIndex, columnIndex) {
    var [rowspan, colspan] = getSpanValue.apply(this, [...arguments]);
    return rowspan == 0 || colspan == 0;
}

/**
 * get the value of merge methods
 * @param {Object} row row's data
 * @param {Object} column column component
 * @param {Number} rowIndex row's index
 * @param {number} columnIndex column's index
 */
export function getSpanValue(row, column, rowIndex, columnIndex) {
    var rowSpan = 1,
        colSpan = 1;

    if (this.spanMethod) {
        var spanResult = this.spanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        });
        if (Array.isArray(spanResult)) {
            [rowSpan, colSpan] = spanResult;
        } else {
            rowSpan = spanResult.rowspan;
            colSpan = spanResult.colspan;
        }
    }

    return [rowSpan, colSpan];
}

export function thTdStickySetting(attr, colspan, idx) {
    var sticky = this.stickyData[idx];
    if (sticky) {
        attr['class'].push('goodwe-table__fixed');
        if (sticky.isRight) {
            attr['class'].push('goodwe-table__fixed--right');
            attr.style.right = sticky.width + 'px';
            if (sticky.isShadow) {
                attr['class'].push("goodwe-table__shadow--right");
            }
        } else {
            attr.style.left = sticky.width + 'px';
            if (idx + colspan >= sticky.count) {
                attr['class'].push("goodwe-table__shadow--left");
            }
        }
    }
}