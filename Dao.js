 

var MySqlPool = require('./MySqlPool');

var mySqlPool = new MySqlPool();
var pool = mySqlPool.getPool();

/**
 * 从表中读取记录
 * @param {表名} tableName 
 * @param {id} id 
 */
function get(tableName, id, onGet) {

    var g = function() {

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
 * 从表中读取记录
 * @param {数据} dto  
 */
function save(tableName, dto, onSave) {

    var g = function() {

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