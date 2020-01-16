var MySqlPool = require('./MySqlPool');

var pool = new MySqlPool();

/**
 * 从表中读取记录
 * @param {表名} tableName 
 * @param {id} id 
 */
function get(tableName, id, onGet) {

    var g = function () {

        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }


            sql = "select * from " + tableName + " where id = ?;";
            let param = [id];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    error(err)
                    throw err;
                }
                if (rs.length > 0) {
                    onGet(rs[0])
                } else {
                    onGet(null)
                }
                
            })

        });
    }
    var mysql  = require('mysql');  
 

    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()

}

/**
 * 删除某条记录
 * @param {表名} tableName  
 * @param {列名} fieldName  
 * @param {值} value 
 */
function del(tableName, fieldName, value) {

    var g = function () {

        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }


            sql = "delete from " + tableName + " where " + fieldName + " = ?;";
            let param = [value];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    error(err)
                    throw err;
                }
            })

        });
    }


    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()

}


/**
 * 范围查找, 查找在from-to之间的数据, 包含from和to 
 * @param {表名} tableName 
 * @param {字段名} fieldName 
 * @param {要查找的字段值} from 
 * @param {要查找的字段值} to 
 */
function findBetween(tableName, fieldName, from, to, onGet) {

    var g = function () {

        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }


            sql = "select * from " + tableName + " where " + fieldName + " >= ? AND " + fieldName + " <= ?;";
            let param = [from, to];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    error(err)
                    throw err;
                }
                if (rs.length > 0) {
                    onGet(rs)
                } else {
                    onGet(null)
                }
            })

        });
    }


    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()

}
/**
 * 获取表中所有数据
 * @param {表名} tableName  
 */
function getAll(tableName, onGet) {

    var g = function () {

        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }


            sql = "select * from " + tableName + ";";
            let param = [];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    error(err)
                    throw err;
                }
                if (rs.length > 0) {
                    onGet(rs)
                } else {
                    onGet(null)
                }
            })

        });
    }


    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()

}

/**
 * 范围查找, 查找在from-to之间的数据, 包含from和to 
 * @param {*} tableName 表名
 * @param {*} fieldName 字段名
 * @param {*} from  要查找的字段值
 * @param {*} onFind 回调
 * 
 */
function find(tableName, fieldName, value, onFind) {

    var g = function () {

        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }


            sql = "select * from " + tableName + " where " + fieldName + " = ?;";
            let param = [value];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    error(err)
                    throw err;
                }
                if (rs.length > 0) {
                    onFind(rs)
                } else {
                    onFind(null)
                }
            })

        });
    }


    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()

}
function error(err) {
    if(err.sql != null) {

        if(err.sql.length > 1000){
            err.sql = err.sql.substring(0, 1000) + "......"
        }
    }
    console.error(err)
}
/**
 * 批量保存
 * @param {数据} dtos : array  
 */
function saves(tableName, dtos, onSave) {

    if (dtos.length == 0) {
        onSave([])
        return
    }


    var toArray = function (ks, dto) {
        var rt = []
        ks.forEach(key => {
            rt.push(dto[key])
        });
        return rt
    }

    var buildValues = function (ks, dtos) {
        var rt = []
        dtos.forEach(dto => {
            rt.push(toArray(ks, dto))
        });
        return rt
    }

    var g = function () {

        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }

            var ks = Object.keys(dtos[0])
            var values = buildValues(ks, dtos)
            const saveSq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values ?';


            conn.query(saveSq, [values], (err, res) => {
                conn.end();//释放连接池 
                if (err) {
                    error(err)
                    throw err
                }
                if (onSave != null) onSave(res)

            });

        });
    }




    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()
}



/**
 * 从表中读取记录
 * @param {数据} dto  
 */
function save(tableName, dto, onSave) {

    var g = function () {

        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }

            var param = Object.values(dto)
            var ks = Object.keys(dto)
            var symbols = questionSymbols(param.length)
            const saveSq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values(' + symbols + ')';


            conn.query(saveSq, param, (err, res) => {
                conn.end();//释放连接池
                if (err){
                    error(err)
                    throw err
                }
                if (onSave != null) onSave(res)

            });

        });
    }


    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()
}

function questionSymbols(count) {
    rs = ''
    for (let i = 0; i < count; i++) {
        if (i != count - 1) {
            rs += "?,"
        } else {
            rs += "?"
        }
    }
    return rs
}

exports.get = get;
exports.save = save;
exports.saves = saves;
exports.find = find;
exports.getAll = getAll;
exports.findBetween = findBetween;
exports.del = del;