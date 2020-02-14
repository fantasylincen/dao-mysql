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
		{ id: "u1", age: 12, name: "lincen1" },
		{ id: "u2", age: 20, name: "lincen2" },
		{ id: "u3", age: 18, name: "lincen3" }
	]
	// 批量保存
	dao.saves(TABLE_NAME, dtos)
	console.log("saves3Users")
}

function save(id, age, name) {

	var dto = {
		id: id,
		name: name,
		age: age
	}

	//把数据保存到User表中
	dao.save(TABLE_NAME, dto)
	console.log("save1User")
}

// 生成3条测试记录
save3Users()

// 批量保存3个用户
saves3Users()

//获取表中id为u1的用户信息
dao.get(TABLE_NAME, "u1", function (u) {
	if (u != null)
		console.info("get: " + u.id + ", " + u.name + ", " + u.age)
})

//获取表中 id = u1 且age = 12的用户信息 (联合主键查询)
ids = { id: "u1", age: 12 }
dao.getByKeys(TABLE_NAME, ids, function (u) {
	if (u != null)
		console.info("getByKeys: " + u.id + ", " + u.name + ", " + u.age)
})

//查找User表中 age == 18 的所有记录
dao.find(TABLE_NAME, "age", 18, function (us) {
	for (var i in us) {
		var u = us[i]
		console.info("find: " + u.id + ", " + u.name + ", " + u.age)
	}
})

//查找User表所有记录
dao.getAll(TABLE_NAME, function (us) {
	for (var i in us) {
		var u = us[i]
		console.info("getAll: " + u.id + ", " + u.name + ", " + u.age)
	}
})

//查找User表中 age >= 10 且 age <= 20 的所有记录
dao.findBetween(TABLE_NAME, "age", 15, 20, function (us) {
	for (var i in us) {
		var u = us[i]
		console.info("findBetween: " + u.id + ", " + u.name + ", " + u.age)
	}
})

//删除User表中id为u123123的数据
dao.del(TABLE_NAME, "id", "u1")
console.log("delete")





var ss = []
for (let index = 10; index < 35; index++) {
	ss.push({ id: "u" + index, age: 19, name: "lincen" + index })
}

// 批量保存
dao.saves(TABLE_NAME, ss)
console.info("saves:" + ss.length + " users")


//分页查找 
for (let page = 1; page <= 3; page++) {

	var countPerPage = 10
	dao.getPage(TABLE_NAME, page, countPerPage, function (rs) {
		console.info("getPage:" + rs.length)
	})
}

//分页查找, 按age排序
for (let page = 1; page <= 3; page++) {

	var countPerPage = 10
	dao.getPageSortBy(TABLE_NAME, "age", true, page, countPerPage, function (rs) {
		console.info("getPageSortBy:" + rs.length)
	})
}


var sql = "SELECT * FROM " + TABLE_NAME + " WHERE age >= ? AND name like ?;"
var param = [12, "lin%"]
dao.sql(sql, param, function (rs) {
	rs.forEach(r => {
		console.info(JSON.stringify(r))
	});
	console.info("sql result size: " + rs.length)
})

//////////////////////////////////////////////  异步保存  ////////////////////////////////////////////////////////////








//////////////////////////////////////////////  同步保存  ////////////////////////////////////////////////////////////


async function startTest() {

	// 单个保存
	await dao.saveSync(TABLE_NAME, { id: "u1", age: 12, name: "lincen1" })
	console.log("saveSync: u1")
	await dao.saveSync(TABLE_NAME, { id: "u2", age: 20, name: "lincen2" })
	console.log("saveSync: u2")
	await dao.saveSync(TABLE_NAME, { id: "u3", age: 18, name: "lincen3" })
	console.log("saveSync: u3")

	// 批量保存
	await dao.savesSync(TABLE_NAME, [{ id: "u1", age: 12, name: "lincen1" }, { id: "u2", age: 20, name: "lincen2" }, { id: "u3", age: 18, name: "lincen3" }])

	//获取表中id为u123123的用户信息
	u = await dao.getSync(TABLE_NAME, "u1")
	console.log("getSync:" + JSON.stringify(u))

	//如果一个表有多个主键, 用这个方法取值
	u = await dao.getByKeysSync(TABLE_NAME, { id: "u1", age: 12 })
	console.log("getByKeysSync:" + JSON.stringify(u))

	//查找User表中 age == 18 的所有记录
	us = await dao.findSync(TABLE_NAME, "age", 151)
	for (var i in us) {
		var u = us[i]
		console.info("findSync:" + JSON.stringify(u))
	}

	//查找所有记录
	us = await dao.getAllSync(TABLE_NAME)
	for (var i in us) {
		var u = us[i]
		console.info("getAllSync:" + JSON.stringify(u))
	}

	//查找User表中 age >= 10 且 age <= 20 的所有记录
	us = await dao.findBetweenSync(TABLE_NAME, "age", 15, 20)

	for (var i in us) {
		var u = us[i]
		console.info("findBetweenSync:" + JSON.stringify(u))
	}

	//删除User表中id为u123123的数据
	rs = await dao.delSync(TABLE_NAME, "id", "u1")
	console.info("delSync:" + JSON.stringify(rs))


	var ss = []
	for (let index = 10; index < 35; index++) {
		ss.push({ id: "u" + index, age: 19, name: "lincen" + index })
	}

	// 批量保存
	await dao.savesSync(TABLE_NAME, ss)
	console.info("savesSync:" + ss.length + " users")


	//分页查找
	var page = 1
	while (true) {
		var countPerPage = 10
		var dtos = await dao.getPageSync(TABLE_NAME, page, countPerPage)
		console.info("getPageSync:" + dtos.length)
		if (dtos.length < countPerPage) {
			break
		}
		page++
	}


	//分页查找, 按age排序
	var page = 1
	while (true) {
		var countPerPage = 10
		var dtos = await dao.getPageSortBySync(TABLE_NAME, "age", true, page, countPerPage)
		console.info("getPageSortBySync:" + dtos.length)
		if (dtos.length < countPerPage) {
			break
		}
		page++
	}
}

startTest()


//////////////////////////////////////////////  同步保存  ////////////////////////////////////////////////////////////