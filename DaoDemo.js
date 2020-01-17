var dao = require("./Dao")

//初始化MySQL连接,这里填写您的主机,用户名,密码,数据库,端口号...
dao.config = {
    host: '192.168.1.86',
    user: 'tester',
    password: 'loiqwnltnlz1123',
    database: 'test',
    port: '8918'
}


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
	dao.saves("User", dtos)
	console.log("saves3Users" )
}

function save(id, age, name) {

	var dto = {
		id: id,
		name: name, 
		age: age
	}
	
	//把数据保存到User表中
	dao.save("User", dto)
	console.log("save1User" )
}

// 生成3条测试记录
save3Users()

// 批量保存3个用户
saves3Users()

//获取表中id为u1的用户信息
dao.get("User", "u1", function(u) {
	console.info("get: " + u.id + ", " + u.name + ", " + u.age) 
})

//获取表中 id = u1 且age = 12的用户信息 (联合主键查询)
ids = {id:"u1", age:12}
dao.getByKeys("User", ids, function(u) { 
	console.info("getByKeys: " + u.id + ", " + u.name + ", " + u.age) 
})

//查找User表中 age == 18 的所有记录
dao.find("User", "age", 18, function(us) { 
	for(var i in us) {
		var u = us[i]
		console.info("find: " + u.id + ", " + u.name + ", " + u.age) 
	}
})

//查找User表所有记录
dao.getAll("User", function(us) { 
	for(var i in us) {
		var u = us[i]
		console.info("getAll: " + u.id + ", " + u.name + ", " + u.age) 
	}
})

//查找User表中 age >= 10 且 age <= 20 的所有记录
dao.findBetween("User", "age", 15, 20, function(us) { 
	for(var i in us) {
		var u = us[i]
		console.info("findBetween: " + u.id + ", " + u.name + ", " + u.age) 
	} 
})

//删除User表中id为u123123的数据
dao.del("User", "id", "u1") 
console.log("delete")
 