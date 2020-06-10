

export function getChildrenCount(columns) {
    var l = 0;
    (function _getChildrenCount(c) {
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
    })(columns)
    return l;
}


export function getHeadData() {
    var allColumns = [],
        level = 1,
        isMultiple = false,
        rowcols = [],
        hasColspan = {};

    // Get some information:
    // All columns that show the data
    // The levels of table's header
    (function _getHeadData(
        columns,
        curLevel,
        parent,
        isFixed
    ) {
        columns.forEach((m, i) => {
            if (m.columns.length > 0) {
                _getHeadData(m.columns, curLevel + 1, m, m.fixed);
                isMultiple = true;
            } else {
                level = Math.max(level, curLevel);
                allColumns.push({
                    level: curLevel,
                    column: m,
                    parent: parent,
                    isFixed: isFixed || m.fixed
                });
            }
        });
    })(this.columns, 0, null, false);


    stickyCell.call(this, allColumns);

    getColumnsWidth.call(this, allColumns);

    // 
    for (var i = level; i >= 0; i--) {
        var r = [];
        var pre = rowcols[i + 1] || allColumns;
        pre.forEach((m, idx) => {
            var c = m.column;
            var p = m.parent;
            var l = m.level;
            var isFixed = m.isFixed;

            var rowspan = 1;
            var colspan = 1;

            if (i < m.level) {
                c = m.parent;
                p = c.$parent;
            }


            if (i == l) {
                rowspan = level - l + 1;
            } else {
                if (i > l) {
                    rowspan = 0;
                }
            }


            if (hasColspan[i + "_" + c.id]) {
                colspan = 0;
            } else {
                colspan = getChildrenCount(c.columns);
                hasColspan[i + "_" + c.id] = true;
            }


            r[r.length] = {
                row: i,
                col: idx,
                column: c,
                parent: p,
                level: l,
                label: c.label,
                isFixed,
                rowspan,
                colspan
            };
        });
        rowcols[i] = r;
    }

    this.realColumns = allColumns;
    this.headerLevel = level;
    this.isMultiple = isMultiple;
    this.rowcols = rowcols;
}

/**
 * sticky info
 * @param {array} cs columns
 */
function stickyCell(cs) {

    var preWidth = 0;
    var columnSticky = []

    for (var i = 0; i < cs.length; i++) {
        if (i == 0 && !cs[i].isFixed) break;
        if (cs[i].isFixed) {
            columnSticky[i] = {
                width: preWidth,
                isRight: false
            }
            if (!cs[i].column.width) {
                throw new Error("[goodwe-table] Fixed columns need to provide width!")
            }
            preWidth += parseFloat(cs[i].column.width);
        } else {
            preWidth = 0;
            break;
        }
    }

    columnSticky.forEach(m => {
        m.count = columnSticky.length
    });

    for (var i = cs.length - 1; i >= 0; i--) {
        if (i == 0 && !cs[i].isFixed) break;
        if(cs[i].isFixed) {
            columnSticky[i] = {
                width: preWidth,
                isRight: true,
                isShadow: false
            }
            if (!cs[i].column.width) {
                throw new Error("[goodwe-table] Fixed columns need to provide width!")
            }
            preWidth += parseFloat(cs[i].column.width);
        } else {
            if(columnSticky[i + 1])
                columnSticky[i + 1].isShadow = true;
            break;
        }
    }

    columnSticky.forEach(m => {
        if(m.isRight) m.count = columnSticky.filter(m => m.isRight).length
    })

    this.stickyData = columnSticky || [];

    console.table(JSON.parse(JSON.stringify(columnSticky)))
}


function getColumnsWidth(columns) {
    this.colWidth = columns.map((columnContainer, columnIndex) => {
        var r = {
            style: {},
            attrs: {}
        };
        if(columnContainer.column.width) {
            r.attrs.width  = r.style.width = parseFloat(columnContainer.column.width) + 'px';
            
        }
        if(columnContainer.column.minWidth) {
            r.style['min-width'] = parseFloat(columnContainer.column.minWidth) + 'px';
        }
        return r;
    })

    console.table(JSON.parse(JSON.stringify(this.colWidth)))
}