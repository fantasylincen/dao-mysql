var dao = require("./Dao")

//初始化MySQL连接,这里填写您的主机,用户名,密码,数据库,端口号...
dao.config = {
    host: '192.168.1.86',
    user: 'tester',
    password: 'loiqwnltnlz1123',
    database: 'test',
    port: '8918'
}


async function startTest() {

	// 单个保存
	await dao.saveSync("User", {id:"u1", age:12, name:"lincen1"})
	console.log("saveSync: u1")
	await dao.saveSync("User", {id:"u2", age:20, name:"lincen2"})
	console.log("saveSync: u2")
	await dao.saveSync("User", {id:"u3", age:18, name:"lincen3"})
	console.log("saveSync: u3")

	// 批量保存
	await dao.savesSync("User", [{id:"u1", age:12, name:"lincen1"}, {id:"u2", age:20, name:"lincen2"}, {id:"u3", age:18, name:"lincen3"}])

	//获取表中id为u123123的用户信息
	u = await dao.getSync("User", "u1")
	console.log("getSync:" + JSON.stringify(u))

	//如果一个表有多个主键, 用这个方法取值
	u = await dao.getByKeysSync("User", {id:"u1", age:12})
	console.log("getByKeysSync:" + JSON.stringify(u))

	//查找User表中 age == 18 的所有记录
	us = await dao.findSync("User", "age", 18)
	for(var i in us) {
		var u = us[i]
		console.info("findSync:" + JSON.stringify(u)) 
	}
	
	//查找所有记录
	us = await dao.getAllSync("User")
	for(var i in us) {
		var u = us[i]
		console.info("getAllSync:" + JSON.stringify(u)) 
	}

	//查找User表中 age >= 10 且 age <= 20 的所有记录
	us = await dao.findBetweenSync("User", "age", 15, 20 )
 
	for(var i in us) {
		var u = us[i]
		console.info("findBetweenSync:" + JSON.stringify(u)) 
	} 

	//删除User表中id为u123123的数据
	rs = await dao.delSync("User", "id", "u1") 
	console.info("delSync:" + JSON.stringify(rs)) 
	
}

startTest()
 
