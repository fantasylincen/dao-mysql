var mysql = require('mysql');
class MySqlPool {

    constructor(config) {
        this.config = config
        if (config == null)
            throw "please set dao.config = {host:'*' user:'*' password:'*' database:'*' port:*}" 
        this.pool = mysql.createPool(config)
    }

    getConnection(callback) {
        
        this.pool.getConnection(callback) 

        // try {

        //     var connection = mysql.createConnection(this.config);
        //     connection.on("error")
        //     connection.connect(function (error) {
                
        //         callback(error, connection)
        //     });

        // } catch (err) {

        //     callback(err, connection)
        //     return
        // }
 
    }
}

class Dao {

    constructor(config) {
        this.pool = new MySqlPool(config);
    }

    /**
     * 从表中读取记录
     * @param {表名} tableName 
     * @param {id} id 
     */
    get(tableName, id, onGet) {

        var sq = "select * from " + tableName + " where id = ?;";
        let param = [id];
        this._sqlOneResult(sq, param, onGet)
    }

    _sqlOneResult(sq, param, onGet) {
        this.sql(sq, param, function (rs) {
            if (onGet == null)
                return
            if (rs.length == 0)
                onGet(null)
            else
                onGet(rs[0])
        })
    }

    /**
     * 从表中读取记录(同步读取)
     * @param {表名} tableName 
     * @param {id} id 
     */
    getSync(tableName, id) {
        var sq = "select * from " + tableName + " where id = ?;";
        let param = [id];
        return this._sqlOneResultSync(sq, param)
    }




    /**
     * 从表中读取记录, 多个主键 比如 getByKeys("User", {name:"zs", age:"12"}, onGetFunction)
     * @param {表名} tableName 
     * @param {id} ids 
     * @param {onGet} onGet(obj)
     */
    getByKeys(tableName, ids, onGet) {

        var ks = Object.keys(ids)
        var param = []

        ks.forEach(k => {
            param.push(ids[k])
        });

        var wheres = ""
        for (let ii = 0; ii < ks.length; ii++) {
            const k = ks[ii];
            var isLast = ii == ks.length - 1
            if (!isLast)
                wheres += k + " = ? AND "
            else
                wheres += k + " = ?;"
        }

        var sq = "select * from " + tableName + " where " + wheres;

        this._sqlOneResult(sq, param, onGet)
    }


    /**
     * 指定根据多个属性值, 查找数据  比如findByFields("User", {name:"zs", age:"12"}, onGetFunction)
     * @param {表名} tableName 
     * @param {id} fields 
     * @param {onGet} onFind(array)
     */
    findByFields(tableName, fields, onFind) {

        var ks = Object.keys(fields)
        var param = []

        ks.forEach(k => {
            param.push(fields[k])
        });

        var wheres = ""
        for (let ii = 0; ii < ks.length; ii++) {
            const k = ks[ii];
            var isLast = ii == ks.length - 1
            if (!isLast)
                wheres += k + " = ? AND "
            else
                wheres += k + " = ?;"
        }

        var sq = "select * from " + tableName + " where " + wheres;

        this._sql(sq, param, onFind)
    }

    /**
     * 同步获取
     * 从表中读取记录, 多个主键 比如 getByKeys("User", {name:"zs", age:"12"}, onGetFunction) 
     * @param {表名} tableName 
     * @param {id} ids 
     */
    getByKeysSync(tableName, ids) {

        var ks = Object.keys(ids)
        var values = []

        ks.forEach(k => {
            values.push(ids[k])
        });

        var wheres = ""
        for (let ii = 0; ii < ks.length; ii++) {
            const k = ks[ii];
            var isLast = ii == ks.length - 1
            if (!isLast)
                wheres += k + " = ? AND "
            else
                wheres += k + " = ?;"
        }

        var sq = "select * from " + tableName + " where " + wheres;

        return this._sqlOneResultSync(sq, values)
    }

    /**
     * 指定根据多个属性值, 查找数据  比如findByFields("User", {name:"zs", age:"12"}, onGetFunction)  同步查询
     * @param {表名} tableName 
     * @param {id} fields 
     * @return array
     */
    findByFieldsSync(tableName, fields) {

        var ks = Object.keys(fields)
        var values = []

        ks.forEach(k => {
            values.push(fields[k])
        });

        var wheres = ""
        for (let ii = 0; ii < ks.length; ii++) {
            const k = ks[ii];
            var isLast = ii == ks.length - 1
            if (!isLast)
                wheres += k + " = ? AND "
            else
                wheres += k + " = ?;"
        }

        var sq = "select * from " + tableName + " where " + wheres;

        return this.sqlSync(sq, values)
    }

    /**
     * 删除某条记录
     * @param {表名} tableName  
     * @param {列名} fieldName  
     * @param {值} value 
     */
    del(tableName, fieldName, value) {

        var sq = "delete from " + tableName + " where " + fieldName + " = ?;";
        let param = [value];
        this._sqlOneResult(sq, param)
    }



    /**
     * 删除某条记录
     * @param {表名} tableName  
     * @param {列名} fieldName  
     * @param {值} value 
     */
    delSync(tableName, fieldName, value) {
        var sq = "delete from " + tableName + " where " + fieldName + " = ?;";
        let param = [value];
        return this._sqlOneResultSync(sq, param)
    }


    /**
     * 范围查找, 查找在from-to之间的数据, 包含from和to 
     * @param {表名} tableName 
     * @param {字段名} fieldName 
     * @param {要查找的字段值} from 
     * @param {要查找的字段值} to 
     */
    findBetween(tableName, fieldName, from, to, onGet) {

        var sq = "select * from " + tableName + " where " + fieldName + " >= ? AND " + fieldName + " <= ?;";
        let param = [from, to];
        this.sql(sq, param, onGet)
    }



    /**
     * 范围查找, 查找在from-to之间的数据, 包含from和to (同步查询)
     * @param {表名} tableName 
     * @param {字段名} fieldName 
     * @param {要查找的字段值} from 
     * @param {要查找的字段值} to 
     */
    findBetweenSync(tableName, fieldName, from, to) {

        var sq = "select * from " + tableName + " where " + fieldName + " >= ? AND " + fieldName + " <= ?;";
        let param = [from, to];
        return this.sqlSync(sq, param)
    }

    /**
     * 获取表中所有数据
     * @param {表名} tableName  
     */
    getAll(tableName, onGet) {

        var sq = "select * from " + tableName + ";";
        let param = [];
        this.sql(sq, param, onGet)
    }



    /**
     * 获取所有 (同步查询)
     * @param {*} tableName 表名 
     * 
     */
    getAllSync(tableName) {
        var sq = "select * from " + tableName + ";";
        let param = [];
        return this.sqlSync(sq, param)
    }



    /**
     * 按值查找 
     * @param {*} tableName 表名
     * @param {*} fieldName 字段名
     * @param {*} value  要查找的字段值
     * @param {*} onFind 回调
     * 
     */
    find(tableName, fieldName, value, onFind) {

        var sq = "select * from " + tableName + " where " + fieldName + " = ?;";
        let param = [value];
        this.sql(sq, param, onFind)
    }

    sql(sql, param, onFind) {

        var self = this

        self.pool.getConnection(function (err, conn) {

            if (err) {
                self._error(err) 
                if(onFind != null) onFind({ error: err })
                return
            }

            conn.query(sql, param, function (err, rs) {
                conn.release();//释放连接池
                if (err) {
                    self._error(err)
                    if(onFind != null) onFind({ error: err })
                    return
                }

                if (onFind == null)
                    return
                if (rs == null) {
                    onFind([])
                }

                if (Array.isArray(rs)) {
                    onFind(rs)
                } else {
                    onFind([rs])
                }

            })

        });

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
    getPage(tableName, page, countPerPage, onFind) {
        var sq = "select * from " + tableName + " LIMIT ?, ?;"
        let param = [(page - 1) * countPerPage, countPerPage];
        this.sql(sq, param, onFind)
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
    getPageSortBy(tableName, fieldName, isAsc, page, countPerPage, onFind) {

        var sq = "select * from " + tableName + " ORDER BY `" + fieldName + "` " + (isAsc ? "ASC" : "DESC") + " LIMIT ?, ?;"
        let param = [(page - 1) * countPerPage, countPerPage];
        this.sql(sq, param, onFind)
    }



    /**
     * 按值查找 (同步查询)
     * @param {*} tableName 表名
     * @param {*} fieldName 字段名
     * @param {*} value  要查找的字段值
     * 
     */
    findSync(tableName, fieldName, value) {

        var sq = "select * from " + tableName + " where " + fieldName + " = ?;";
        let param = [value];
        return this.sqlSync(sq, param)
    }


    sqlSync(sql, param) {

        var self = this

        var pm = new Promise((resolve, reject) => {

            self.pool.getConnection(function (err, conn) {


                if (err) {
                    reject(err)
                    return
                }

                conn.query(sql, param, function (err, rs) {
                    conn.release();//释放连接池
                    if (err) {
                        reject(err)
                        return
                    }

                    if (rs == null) {
                        resolve([])
                    }

                    if (Array.isArray(rs)) {
                        resolve(rs)
                    } else {
                        resolve([rs])
                    }

                })
            });
        })

        return pm
    }



    _sqlOneResultSync(sql, param) {

        var self = this

        var pm = new Promise((resolve, reject) => {

            self.pool.getConnection(function (err, conn) {

                if (err) {
                    reject(err)
                    return
                }

                conn.query(sql, param, function (err, r) {
                    conn.release();//释放连接池
                    if (err) {
                        reject(err)
                        return
                    }



                    if (r == null) {
                        resolve(null)
                    }

                    if (Array.isArray(r)) {
                        resolve(r[0])
                    } else {
                        resolve(r)
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
    getPageSync(tableName, page, countPerPage) {

        var sq = "select * from " + tableName + " LIMIT ?, ?;"
        let param = [(page - 1) * countPerPage, countPerPage];
        return this.sqlSync(sq, param)
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
    getPageSortBySync(tableName, fieldName, isAsc, page, countPerPage) {
        var sq = "select * from " + tableName + " ORDER BY `" + fieldName + "` " + (isAsc ? "ASC" : "DESC") + " LIMIT ?, ?;"
        let param = [(page - 1) * countPerPage, countPerPage];
        return this.sqlSync(sq, param)
    }



    _error(err) {
        if (err.sql != null) {

            if (err.sql.length > 1000) {
                err.sql = err.sql.substring(0, 1000) + "......"
            }
            console.error(err.sql)
        }
        console.error(err)
    }
    /**
     * 批量保存
     * @param {数据} dtos : array  
     */
    saves(tableName, dtos, onSave) {

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

        var ks = Object.keys(dtos[0])
        var param = buildValues(ks, dtos)
        const sq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values ?';

        this.sql(sq, [param], onSave)

    }



    /**
     * 批量保存(同步)
     * @param {数据} dtos
     */
    savesSync(tableName, dtos) {


        if (dtos == null || dtos.length == 0) {
            return []
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
        var param = buildValues(ks, dtos)
        const sq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values ?';

        return this.sqlSync(sq, [param])

    }

    end() {
        this.pool.pool.end()
    }

    /**
     * 保存单个(同步)
     * @param {数据} dto  
     */
    saveSync(tableName, dto) {

        var param = Object.values(dto)
        var ks = Object.keys(dto)
        var symbols = this._questionSymbols(param.length)
        const sq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values(' + symbols + ')';
        return this._sqlOneResultSync(sq, param)
    }

    /**
     * 从表中读取记录
     * @param {数据} dto  
     */
    save(tableName, dto, onSave) {
        var param = Object.values(dto)
        var ks = Object.keys(dto)
        var symbols = this._questionSymbols(param.length)
        const sq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values(' + symbols + ')';

        this._sqlOneResult(sq, param, onSave)
    }

    _questionSymbols(count) {
        var rs = ''
        for (let i = 0; i < count; i++) {
            if (i != count - 1) {
                rs += "?,"
            } else {
                rs += "?"
            }
        }
        return rs
    }
}

exports.Dao = Dao; 