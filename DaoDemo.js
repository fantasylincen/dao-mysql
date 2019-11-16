var dao = require("./Dao")

dao.config = {
    host: '192.168.1.86',
    user: 'tester',
    password: 'loiqwnltnlz1123',
    database: 'test',
    port: '8918'
}

for (let index = 0; index < 10000; index++) { 
    
    var dto = {
        name: "lincen", age: 18, id: index
    }
    dao.save("User", dto)
    console.info(index)
} 

var user = dao.get("User", 1, function(u) {
    console.info(u)
})