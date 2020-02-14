var Dao = require("./Dao").Dao

//初始化MySQL连接,这里填写您的主机,用户名,密码,数据库,端口号...
var config = {
    host: '192.168.1.86',
    user: 'tester',
    password: 'loiqwnltnlz1123',
    database: 'test',
    port: '8918'
}

const TABLE_NAME = "User"

var dao = new Dao(config)



//////////////////////////////////////////////  异步保存  ////////////////////////////////////////////////////////////



// 逐个保存3个用户
function save3Users() {
	save("u1", 12, "lincen1")
	save("u2", 20, "lincen2")
	save("u3", 18, "lincen3")
}

// 批量保存3个用户
function saves3Users() {

	dtos = [
		{id:"u1", age:12, name:"lincen1"}, 
		{id:"u2", age:20, name:"lincen2"}, 
		{id:"u3", age:18, name:"lincen3"}
	]
	// 批量保存
	dao.saves(TABLE_NAME, dtos)
	console.log("saves3Users" )
}
saves3Users()