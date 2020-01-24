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

    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()

}


/**
 * 从表中读取记录(同步读取)
 * @param {表名} tableName 
 * @param {id} id 
 */
function getSync(tableName, id) {

    if (!pool.hasInit) {
        pool.init(this.config)
    }

    pm = new Promise(( resolve, reject ) => {

        pool.getConnection(function (err, conn) {

            if (err) {
                reject( err )
            } else {

                sql = "select * from " + tableName + " where id = ?;";
                let param = [id];
                conn.query(sql, param, function (err, rs) {
                    conn.end();//释放连接池
                    if (err) {
                        reject( err ) 
                    } else if (rs.length > 0) {
                        resolve(rs[0])
                    } else {
                        resolve(null)
                    }
                    
                })

            
            }

        });
    })
 
    return pm
}




/**
 * 从表中读取记录, 多个主键 比如 getByKeys("User", {name:"zs", age:"12"}, onGetFunction)
 * @param {表名} tableName 
 * @param {id} ids 
 */
function getByKeys(tableName, ids, onGet) {

    var g = function () {

        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }

            var ks = Object.keys(ids)
            var values = []

            ks.forEach(k => {
                values.push(ids[k])
            });

            var wheres = ""
            for (let ii = 0; ii < ks.length; ii++) {
                const k = ks[ii];
                isLast = ii == ks.length - 1
                if(!isLast)
                    wheres += k + " = ? AND "
                else
                    wheres += k + " = ?;"
            }

            sql = "select * from " + tableName + " where " + wheres;
           
            conn.query(sql, values, function (err, rs) {
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
 

    if (!pool.hasInit) {
        pool.init(this.config)
    }
    g()

}

/**
 * 同步获取
 * 从表中读取记录, 多个主键 比如 getByKeys("User", {name:"zs", age:"12"}, onGetFunction) 
 * @param {表名} tableName 
 * @param {id} ids 
 */
function getByKeysSync(tableName, ids) {


    if (!pool.hasInit) {
        pool.init(this.config)
    }

    pm = new Promise(( resolve, reject ) => {

        pool.getConnection(function (err, conn) { 

            if (err) {
                reject(err)
                return
            }

            var ks = Object.keys(ids)
            var values = []

            ks.forEach(k => {
                values.push(ids[k])
            });

            var wheres = ""
            for (let ii = 0; ii < ks.length; ii++) {
                const k = ks[ii];
                isLast = ii == ks.length - 1
                if(!isLast)
                    wheres += k + " = ? AND "
                else
                    wheres += k + " = ?;"
            }

            sql = "select * from " + tableName + " where " + wheres;
           
            conn.query(sql, values, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    reject(err)
                    return
                }
                if (rs.length > 0) {
                    resolve(rs[0])
                } else {
                    resolve(null)
                } 
            }) 
        });
    })
 
    return pm
 

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
 * 删除某条记录
 * @param {表名} tableName  
 * @param {列名} fieldName  
 * @param {值} value 
 */
function delSync(tableName, fieldName, value) {


    if (!pool.hasInit) {
        pool.init(this.config)
    }
    
    pm = new Promise(( resolve, reject ) => {
    
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(err)
                return
            }

            sql = "delete from " + tableName + " where " + fieldName + " = ?;";
            let param = [value];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    reject(err) 
                } else {
                    resolve(rs)
                }
            })

        });
    })
    
    return pm

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
                    onGet([])
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
 * 范围查找, 查找在from-to之间的数据, 包含from和to (同步查询)
 * @param {表名} tableName 
 * @param {字段名} fieldName 
 * @param {要查找的字段值} from 
 * @param {要查找的字段值} to 
 */
function findBetweenSync(tableName, fieldName, from, to, onGet) {


    if (!pool.hasInit) {
        pool.init(this.config)
    }

    pm = new Promise(( resolve, reject ) => {
 
        pool.getConnection(function (err, conn) {
 
            if (err) {
                reject(err)
                return
            }
 
            sql = "select * from " + tableName + " where " + fieldName + " >= ? AND " + fieldName + " <= ?;";
            let param = [from, to];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    reject(err)
                    return
                }
                if (rs.length > 0) {
                    resolve(rs)
                } else {
                    resolve([])
                }
            })
         });
    })

    return pm

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
                    onGet([])
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
 * 获取所有 (同步查询)
 * @param {*} tableName 表名 
 * 
 */
function getAllSync(tableName) {


    if (!pool.hasInit) {
        pool.init(this.config)
    }

    pm = new Promise(( resolve, reject ) => {
 
        pool.getConnection(function (err, conn) {
 

            if (err) {
                reject(err)
                return
            }


            sql = "select * from " + tableName + ";";
            let param = [];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    reject(err)
                    return
                }
                if (rs.length > 0) {
                    resolve(rs)
                } else {
                    resolve([])
                }
            })
         });
    })

    return pm

}



/**
 * 按值查找 
 * @param {*} tableName 表名
 * @param {*} fieldName 字段名
 * @param {*} value  要查找的字段值
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
                    onFind([])
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
 * 分页查找
 * @param {*} tableName 表名
 * @param {*} page 第几页
 * @param {*} countPerPage  每页数量
 * 
 * return 如果没有数据返回空数组
 * 
 */
function getPage(tableName, page, countPerPage, onFind) {

    var g = function () {
        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }


            sql = "select * from " + tableName + " LIMIT ?, ?;"
            let param = [(page - 1) * countPerPage, countPerPage];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    error(err)
                    throw err;
                }
                if (rs.length > 0) {
                    onFind(rs)
                } else {
                    onFind([])
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
 * 分页查找, 以fieldName排序
 * @param {*} tableName 表名
 * @param {*} fieldName 字段名
 * @param {*} isAsc 是否升序
 * 
 * @param {*} page 第几页
 * @param {*} countPerPage  每页数量
 * 
 * return 如果没有数据返回空数组
 * 
 */
function getPageSortBy(tableName, fieldName, isAsc, page, countPerPage, onFind) {

    var g = function () {
        
        pool.getConnection(function (err, conn) {

            if (err) {
                error(err)
                throw err;
            }


            sql = "select * from " + tableName + " ORDER BY `" + fieldName + "` " + (isAsc ? "ASC" :"DESC") + " LIMIT ?, ?;"
            let param = [(page - 1) * countPerPage, countPerPage];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    error(err)
                    throw err;
                }
                if (rs.length > 0) {
                    onFind(rs)
                } else {
                    onFind([])
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
 * 按值查找 (同步查询)
 * @param {*} tableName 表名
 * @param {*} fieldName 字段名
 * @param {*} value  要查找的字段值
 * 
 */
function findSync(tableName, fieldName, value) {


    if (!pool.hasInit) {
        pool.init(this.config)
    }

    pm = new Promise(( resolve, reject ) => {
 
        pool.getConnection(function (err, conn) {
 

            if (err) {
                reject(err)
                return
            }


            sql = "select * from " + tableName + " where " + fieldName + " = ?;";
            let param = [value];
            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    reject(err)
                    return
                }
                if (rs.length > 0) {
                    resolve(rs)
                } else {
                    resolve([])
                }
            }) 
         });
    })

    return pm

}





/**
 * 分页查找 (同步查询)
 * @param {*} tableName 表名
 * @param {*} page 第几页
 * @param {*} countPerPage  每页数量
 * 
 * return 如果没有数据返回空数组
 * 
 */
function getPageSync(tableName, page, countPerPage) {


    if (!pool.hasInit) {
        pool.init(this.config)
    }

    pm = new Promise(( resolve, reject ) => {
 
        pool.getConnection(function (err, conn) {
 

            if (err) {
                reject(err)
                return
            }

            sql = "select * from " + tableName + " LIMIT ?, ?;"
            let param = [(page - 1) * countPerPage, countPerPage];

            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    reject(err)
                    return
                }
                if (rs.length > 0) {
                    resolve(rs)
                } else {
                    resolve([])
                }
            }) 
         });
    })

    return pm

}

 
/**
 * 分页查找, 以fieldName排序 (同步查询)
 * @param {*} tableName 表名
 * @param {*} fieldName 字段名
 * @param {*} isAsc 是否升序
 * 
 * @param {*} page 第几页
 * @param {*} countPerPage  每页数量
 * 
 * return 如果没有数据返回空数组
 * 
 */
function getPageSortBySync(tableName, fieldName, isAsc, page, countPerPage) {


    if (!pool.hasInit) {
        pool.init(this.config)
    }

    pm = new Promise(( resolve, reject ) => {
 
        pool.getConnection(function (err, conn) {
 

            if (err) {
                reject(err)
                return
            }

            sql = "select * from " + tableName + " ORDER BY `" + fieldName + "` " + (isAsc ? "ASC" :"DESC") + " LIMIT ?, ?;" 
            let param = [(page - 1) * countPerPage, countPerPage];

            conn.query(sql, param, function (err, rs) {
                conn.end();//释放连接池
                if (err) {
                    reject(err)
                    return
                }
                if (rs.length > 0) {
                    resolve(rs)
                } else {
                    resolve([])
                }
            }) 
         });
    })

    return pm

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
 * 批量保存(同步)
 * @param {数据} dtos
 */
function savesSync(tableName, dtos) {

 
    if (!pool.hasInit) {
        pool.init(this.config)
    }
    
    pm = new Promise(( resolve, reject ) => {
    
        pool.getConnection(function (err, conn) {
    

            if (err) {
                reject(err)
                return
            } 

            if (dtos.length == 0) {
                resolve([])
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
 
            var ks = Object.keys(dtos[0])
            var values = buildValues(ks, dtos)
            const saveSq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values ?';

            conn.query(saveSq, [values], (err, res) => {
                conn.end();//释放连接池 
                if (err) {
                    reject(err)
                    return
                }
                resolve(res)
            }); 
        });
    })
    
    return pm
}


/**
 * 保存单个(同步)
 * @param {数据} dto  
 */
function saveSync(tableName, dto) {

    if (!pool.hasInit) {
        pool.init(this.config)
    }
    
    pm = new Promise(( resolve, reject ) => {
    
        pool.getConnection(function (err, conn) {
    
            if (err) {
                reject(err)
                return
            }

            var param = Object.values(dto)
            var ks = Object.keys(dto)
            var symbols = questionSymbols(param.length)
            const saveSq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values(' + symbols + ')';


            conn.query(saveSq, param, (err, res) => {
                conn.end();//释放连接池
                if (err){
                    reject(err) 
                } else {
                    resolve(res)
                    // console.info("save1:" + JSON.stringify(dto))
                }
            });
        });
    })
    
    return pm
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
exports.getByKeys = getByKeys;
exports.save = save;
exports.saves = saves;
exports.find = find;
exports.getPage = getPage;
exports.getPageSortBy = getPageSortBy;
exports.getAll = getAll;
exports.findBetween = findBetween;
exports.del = del;

exports.getSync = getSync;
exports.getByKeysSync = getByKeysSync;
exports.saveSync = saveSync;
exports.savesSync = savesSync;
exports.findSync = findSync;
exports.getPageSync = getPageSync;
exports.getPageSortBySync = getPageSortBySync;
exports.getAllSync = getAllSync;
exports.findBetweenSync = findBetweenSync;
exports.delSync = delSync;
