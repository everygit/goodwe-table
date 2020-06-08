

export function getChildrenCount(columns) {
    var l = 0;
    var _getChildrenCount = function(c) {
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
    };
    _getChildrenCount(columns);
    return l;
}


export function getHeadData() {
    var allColumns = [];
    var level = 1;
    var isMultiple = false;
    var _getHeadData = function _getHeadData(
        columns,
        curLevel,
        parent,
        isFixed
    ) {
        columns.forEach((m, i) => {
            console.log(m)
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
    }.bind(this);
    _getHeadData(this.columns, 0, null, false);
    console.log(allColumns)
    this.realColumns = allColumns;
    this.headerLevel = level;
    this.isMultiple = isMultiple;
    var rowcols = [];
    var hasColspan = {};
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
                rowspan = this.headerLevel - l + 1;
            } else {
                if (i > l) {
                    rowspan = 0;
                }
            }
            if (hasColspan[i + "_" + c.id]) {
                colspan = 0;
            } else {
                colspan = this.getChildrenCount(c.columns);
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
    this.rowcols = rowcols;
}