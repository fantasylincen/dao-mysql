var mysql =  require('mysql');
 
function MySqlPool() {
    
    this.hasInit = false;
    
    this.init = function (config) {
        this.config = config
        if(config == null) 
            throw "please set dao.config = {host:'*' user:'*' password:'*' database:'*' port:*}"
        this.pool = mysql.createPool(config);
    },
 
    this.getConnection = function (callback) {
        
        try {
            
            var connection = mysql.createConnection(this.config); 
            
            connection.connect();

        } catch (err) {
            
            callback(err, connection)
            return
        }
        
        callback(null, connection)
    }

    

};
module.exports = MySqlPool;