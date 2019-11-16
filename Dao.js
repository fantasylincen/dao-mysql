var MySqlPool = require('./MySqlPool');

var mySqlPool = new MySqlPool();

/**
 * 从表中读取记录
 * @param {表名} tableName 
 * @param {id} id 
 */
function get(tableName, id, onGet) {

    var g = function() {

        var pool = mySqlPool.getPool();
        pool.getConnection(function (err, conn) {
        
            if (err) {
                throw err;
            }
           
    
            sql = "select * from " + tableName + " where id = ?;";
            let param = [id];
            conn.query(sql, param, function (err, rs) {
                if (err) { 
                    throw err;
                }
                if(rs.length > 0) {
                    onGet(rs[0])
                } else {
                    onGet(null)
                } 
                conn.release();//释放连接池
            })
        
        });
    }


    if(!mySqlPool.hasInit) {
        mySqlPool.init(this.config)
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

    var g = function() {

        var pool = mySqlPool.getPool();
        pool.getConnection(function (err, conn) {
        
            if (err) {
                throw err;
            }
           
    
            sql = "delete from " + tableName + " where " + fieldName + " = ?;";
            let param = [value];
            conn.query(sql, param, function (err, rs) {
                if (err) { 
                    throw err;
                } 
                conn.release();//释放连接池
            })
        
        });
    }


    if(!mySqlPool.hasInit) {
        mySqlPool.init(this.config)
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

    var g = function() {

        var pool = mySqlPool.getPool();
        pool.getConnection(function (err, conn) {
        
            if (err) {
                throw err;
            }
           
    
            sql = "select * from " + tableName + " where " + fieldName + " >= ? AND " + fieldName + " <= ?;";
            let param = [from, to];
            conn.query(sql, param, function (err, rs) {
                if (err) { 
                    throw err;
                }
                if(rs.length > 0) {
                    onGet(rs )
                } else {
                    onGet(null)
                } 
                conn.release();//释放连接池
            })
        
        });
    }


    if(!mySqlPool.hasInit) {
        mySqlPool.init(this.config)
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

    var g = function() {

        var pool = mySqlPool.getPool();
        pool.getConnection(function (err, conn) {
        
            if (err) {
                throw err;
            }
           
    
            sql = "select * from " + tableName + " where " + fieldName + " = ?;";
            let param = [value];
            conn.query(sql, param, function (err, rs) {
                if (err) { 
                    throw err;
                }
                if(rs.length > 0) {
                    onFind(rs )
                } else {
                    onFind(null)
                } 
                conn.release();//释放连接池
            })
        
        });
    }


    if(!mySqlPool.hasInit) {
        mySqlPool.init(this.config)
    }
    g()

} 

/**
 * 从表中读取记录
 * @param {数据} dto  
 */
function save(tableName, dto, onSave) {

    var g = function() {

        var pool = mySqlPool.getPool();
        pool.getConnection(function (err, conn) {
            
            if (err) {
                throw err;
            }
            
            var param = Object.values(dto)
            var ks = Object.keys(dto)
            var symbols = questionSymbols(param.length)
            const saveSq = 'replace into ' + tableName + ' (' + ks.join(",") + ') values(' + symbols + ')';
    
            
            conn.query(saveSq,param,(err,res)=>{
                if(err) 
                    throw err
                if(onSave != null) onSave(res)
                conn.release();//释放连接池
            });
    
        });
    }
    

    if(!mySqlPool.hasInit) {
        mySqlPool.init(this.config)
    }
    g()
}  

function questionSymbols(count) {
    rs = ''
    for (let i = 0; i < count; i++) {
         if(i != count - 1) {
            rs += "?,"
         } else {
            rs += "?"
         }
    }
    return rs
}

exports.get = get;
exports.save = save;
exports.find = find;
exports.findBetween = findBetween;
exports.del = del;