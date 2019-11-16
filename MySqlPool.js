var mysql =  require('mysql');
 
function MySqlPool() {
    this.hasInit = false;
    
    this.init = function (config) {
        if(config == null) 
            throw "please set dao.config = {host:'*' user:'*' password:'*' database:'*' port:*}"
        this.pool = mysql.createPool(config);
    },

    this.getPool = function () {
        if (this.hasInit) {
            this.pool.on('connection', function (connection) {
                connection.query("SET SESSION auto_increment_increment=1");
                this.hasInit = false;
            });
        }
        return this.pool;
    }
    

};
module.exports = MySqlPool;