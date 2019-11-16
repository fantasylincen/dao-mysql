var dao = require("./Dao")

//初始化MySQL连接,这里填写您的主机,用户名,密码,数据库,端口号...
dao.config = {
    host: '192.168.1.86',
    user: 'tester',
    password: 'loiqwnltnlz1123',
    database: 'test',
    port: '8918'
}


function save3Users() {
	save("u1", 12, "lincen1")
	save("u2", 20, "lincen2")
	save("u3", 18, "lincen3")
}

function save(id, age, name) {

	var dto = {
		id: id,
		name: name, 
		age: age
	}
	
	//把数据保存到User表中
	dao.save("User", dto)
}

// 生成3条测试记录
save3Users()

//获取表中id为u123123的用户信息
dao.get("User", "u1", function(u) {
    console.info("---	get	---")
    console.info(u.id + ", " + u.name + ", " + u.age) 
})

//查找User表中 age == 18 的所有记录
dao.find("User", "age", 18, function(us) {
    console.info("---	find	---")
	for(var i in us) {
		var u = us[i]
		console.info(u.id + ", " + u.name + ", " + u.age) 
	}
})

//查找User表中 age >= 10 且 age <= 20 的所有记录
dao.findBetween("User", "age", 15, 20, function(us) {
    console.info("---	findBetween	---")
	for(var i in us) {
		var u = us[i]
		console.info(u.id + ", " + u.name + ", " + u.age) 
	} 
})

//删除User表中id为u123123的数据
dao.del("User", "id", "u1") 
 